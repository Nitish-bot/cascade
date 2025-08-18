#![allow(unexpected_cfgs)]

pub mod constants;
pub mod errors; 

use anchor_lang::prelude::*;
use constants::*;
use errors::*;

declare_id!("6LvLTeiy6JNitq1WGdGp75DvRBHKrmpMAREfYgoMMyGq");

#[program]
pub mod cascade {
    use anchor_lang::{solana_program::{clock::SECONDS_PER_DAY, native_token::LAMPORTS_PER_SOL}, system_program::{transfer, Transfer}};

    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let campaign_counter = &mut ctx.accounts.campaign_counter;
        campaign_counter.count = 0;

        let config = &mut ctx.accounts.config;
        config.authority = ctx.accounts.signer.key();
        config.treasury_pubkey = ctx.accounts.treasury.key();
        config.min_goal = MIN_GOAL;
        config.min_withdrawal = MIN_WITHDRAWAL;
        config.platform_fee_bps = PLATFORM_FEE_BPS;
        Ok(())
    }

    pub fn update_config(
        ctx: Context<UpdateConfig>,
        new_authority: Option<Pubkey>,
        new_treasury_pubkey: Option<Pubkey>,
        new_min_goal: Option<u64>,
        new_min_withdrawal: Option<u64>,
        new_platform_fee_bps: Option<u64>,
    ) -> Result<()> {
        let config = &mut ctx.accounts.config;
        
        require!(ctx.accounts.authority.key() == config.authority, CascadeError::UnauthorizedAction); // Ensure fee is not more than 100%
        
        config.authority = new_authority.unwrap_or(config.authority);
        config.treasury_pubkey = new_treasury_pubkey.unwrap_or(config.treasury_pubkey);
        config.min_goal = new_min_goal.unwrap_or(config.min_goal);
        config.min_withdrawal = new_min_withdrawal.unwrap_or(config.min_withdrawal);
        config.platform_fee_bps = new_platform_fee_bps.unwrap_or(config.platform_fee_bps);
        Ok(())
    }

    pub fn create_campaign(ctx: Context<CreateCampaign>, goal: u64, metadata: String, deadline: i64) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        let campaign_counter = &mut ctx.accounts.campaign_counter;

        let min_goal = ctx.accounts.config.min_goal;
        require!(goal > min_goal, CascadeError::InsufficientGoal);
        
        let metadata_len = campaign.metadata.len();
        require!(metadata_len <= 128, CascadeError::MetadataTooLong);
        
        let current_time = Clock::get()?.unix_timestamp;
        require!(deadline > current_time, CascadeError::DeadlineInPast);
        require!(deadline > current_time + SECONDS_PER_DAY as i64, CascadeError::DeadlineTooSoon);

        campaign.id = campaign_counter.count;
        campaign.organiser = ctx.accounts.organiser.key();
        campaign.goal = goal;
        campaign.raised = 0;
        campaign.metadata = metadata;
        campaign.vault_bump = ctx.bumps.vault;
        campaign.created_at = Clock::get()?.unix_timestamp;
        campaign.deadline = deadline;
        campaign.status = CampaignStatus::Active;

        campaign_counter.count = campaign_counter.count.checked_add(1).ok_or(CascadeError::CounterOverflow)?;

        Ok(())
    }

    pub fn donate(ctx: Context<Donate>, amount: u64) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        let donor = &ctx.accounts.donor;

        let platfee = ctx.accounts.config.platform_fee_bps;
        let fee = amount
            .checked_mul(platfee)
            .ok_or(CascadeError::FeeCalculationOverflow)?
            .checked_div(10_000)
            .ok_or(CascadeError::FeeCalculationOverflow)?;
        let donation = amount.checked_sub(fee).ok_or(CascadeError::InsufficientFundsForDonation)?;

        transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                Transfer {
                    from: donor.to_account_info(),
                    to: ctx.accounts.treasury.to_account_info(),
                }
            ),
            fee,
        )?;

        transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                Transfer {
                    from: donor.to_account_info(),
                    to: ctx.accounts.vault.to_account_info(),
                }
            ),
            donation,
        )?;

        campaign.raised = campaign.raised.checked_add(amount).ok_or(CascadeError::RaisedOverflow)?;

        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let organiser = &ctx.accounts.organiser;
        let vault = &ctx.accounts.vault;
        let campaign = &ctx.accounts.campaign;

        let current_balance = **vault.lamports.borrow();
        let rent_exempt = Rent::get()?.minimum_balance(vault.data_len());
        let remaining_balance = current_balance.checked_sub(amount).ok_or(CascadeError::WithdrawalAmountExceedsBalance)?;
        require!(current_balance >= LAMPORTS_PER_SOL / 100, CascadeError::InsufficientFundsForWithdrawal);
        require!(remaining_balance >= rent_exempt, CascadeError::VaultBelowRentExempt);
        
        let organiser_key = organiser.key();
        let id_bytes = campaign.id.to_le_bytes();
        let signer_seeds: &[&[&[u8]]] = &[&[
            b"vault",
            organiser_key.as_ref(),
            id_bytes.as_ref(),
            &[campaign.vault_bump],
        ]];

        transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                Transfer {
                    from: vault.to_account_info(),
                    to: organiser.to_account_info(),
                }
            ).with_signer(signer_seeds),
            amount,
        )?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init,
        payer = signer,
        space = 8 + CampaignCounter::INIT_SPACE,
        seeds = [b"campaign_counter"],
        bump
    )]
    pub campaign_counter: Account<'info, CampaignCounter>,

    #[account(
        init,
        payer = signer,
        space = 8 + Config::INIT_SPACE,
        seeds = [b"config"],
        bump
    )]
    pub config: Account<'info, Config>,

    /// CHECK: This is a
    pub treasury: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateConfig<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        has_one = authority,
        seeds = [b"config"],
        bump
    )]
    pub config: Account<'info, Config>,
}

#[derive(Accounts)]
pub struct CreateCampaign<'info> {
    #[account(mut)]
    pub organiser: Signer<'info>,

    #[account(
        init,
        payer = organiser,
        space = Campaign::INIT_SPACE,
        seeds = [
            b"campaign",
            organiser.key().as_ref(),
            campaign_counter.count.to_le_bytes().as_ref(),
        ],
        bump
    )]
    pub campaign: Account<'info, Campaign>,

    #[account(
        seeds = [
            b"vault",
            organiser.key().as_ref(),
            campaign_counter.count.to_le_bytes().as_ref(),
        ],
        bump,
    )]
    pub vault: SystemAccount<'info>,
    
    #[account(
        mut,
        seeds = [b"campaign_counter"],
        bump,
    )]
    pub campaign_counter: Account<'info, CampaignCounter>,

    #[account(
        seeds = [b"config"],
        bump
    )]
    pub config: Account<'info, Config>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Donate<'info> {
    #[account(mut)]
    pub donor: Signer<'info>,

    #[account(
        mut,
        has_one = organiser,
        seeds = [
            b"campaign",
            organiser.key().as_ref(),
            campaign.id.to_le_bytes().as_ref(),
        ],
        bump
    )]
    pub campaign: Account<'info, Campaign>,

    #[account(
        mut,
        seeds = [
            b"vault",
            organiser.key().as_ref(),
            campaign.id.to_le_bytes().as_ref(),
        ],
        bump = campaign.vault_bump,
    )]
    pub vault: SystemAccount<'info>,

    #[account(
        seeds = [b"config"],
        bump
    )]
    pub config: Account<'info, Config>,

    #[account(
        mut,
        address = config.treasury_pubkey @ CascadeError::UnauthorizedAction,
    )]
    /// CHECK: address is checked against config.treasury_pubkey
    pub treasury: UncheckedAccount<'info>,
    
    /// CHECK: has_one constraint ensures the organiser passed is the creator
    pub organiser: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub organiser: Signer<'info>,

    #[account(
        mut,
        has_one = organiser,
        seeds = [
            b"campaign",
            organiser.key().as_ref(),
            campaign.id.to_le_bytes().as_ref(),
        ],
        bump,
    )]
    pub campaign: Account<'info, Campaign>,

    #[account(
        mut,
        seeds = [
            b"vault",
            organiser.key().as_ref(),
            campaign.id.to_le_bytes().as_ref(),
        ],
        bump = campaign.vault_bump,
    )]
    pub vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Campaign {
    // Unique identifier for the campaign
    pub id: u64,
    // Wallet address of the organiser
    pub organiser: Pubkey,
    // Goal amount in lamports
    pub goal: u64,
    // Amount of lamports raised so far
    pub raised: u64,
    // Link to metadata (hosted off chain for now) 
    #[max_len(128)]
    pub metadata: String,
    // Bump for the vault that holds the funds
    pub vault_bump: u8,
    // Timestamp when the campaign was created
    pub created_at: i64,
    // Deadline for the campaign
    pub deadline: i64,
    // Status of the campaign
    pub status: CampaignStatus,
}

#[account]
#[derive(InitSpace)]
pub struct CampaignCounter {
    pub count: u64,
}

#[account]
#[derive(InitSpace)]
pub struct Config {
    // Authority of the program
    pub authority: Pubkey,
    // Treasury wallet address
    pub treasury_pubkey: Pubkey,
    // Minimum goal for a campaign in lamports (0.05 SOL)
    pub min_goal: u64,
    // Minimum withdrawal amount in lamports (0.01 SOL)
    pub min_withdrawal: u64,
    // Platform fee in basis points (200 = 2%)
    pub platform_fee_bps: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, InitSpace)]
pub enum CampaignStatus {
    Active,
    Completed,
    Cancelled,
}
