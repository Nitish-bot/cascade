#![allow(unexpected_cfgs)]

pub mod constants;
pub mod errors; 

use anchor_lang::prelude::*;
use constants::*;
use errors::*;

declare_id!("6LvLTeiy6JNitq1WGdGp75DvRBHKrmpMAREfYgoMMyGq");

#[program]
pub mod cascade {
    use anchor_lang::{solana_program::native_token::LAMPORTS_PER_SOL, system_program::{transfer, Transfer}};

    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let campaign_counter = &mut ctx.accounts.campaign_counter;
        campaign_counter.count = 0;

        Ok(())
    }

    pub fn create_campaign(ctx: Context<CreateCampaign>, goal: u64, metadata: String) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        let campaign_counter = &mut ctx.accounts.campaign_counter;

        let min_goal = MIN_GOAL; // 0.05 SOL
        let metadata_len = campaign.metadata.len();
        require!(goal > min_goal, CascadeError::InsufficientGoal);
        require!(metadata_len <= 128, CascadeError::MetadataTooLong);

        campaign.id = campaign_counter.count;
        campaign.organiser = ctx.accounts.organiser.key();
        campaign.goal = goal;
        campaign.raised = 0;
        campaign.metadata = metadata;
        campaign.vault_bump = ctx.bumps.vault;
        campaign.created_at = Clock::get()?.unix_timestamp;
        campaign.status = CampaignStatus::Active;

        campaign_counter.count = campaign_counter.count.checked_add(1).unwrap();

        Ok(())
    }

    pub fn donate(ctx: Context<Donate>, amount: u64) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        let donor = &ctx.accounts.donor;
        
        let platfee = PLATFORM_FEE_PERCENT;
        let fee = amount.checked_mul(platfee / 100).ok_or(CascadeError::FeeCalculationOverflow)?;
        let donation = amount.checked_sub(fee).ok_or(CascadeError::InsufficientFundsForDonation)?;

        transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                Transfer {
                    from: donor.to_account_info(),
                    to: ctx.accounts.vault.to_account_info(),
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
            amount,
        )?;

        campaign.raised = campaign.raised.checked_add(amount).unwrap();

        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let organiser = &ctx.accounts.organiser;
        let vault = &ctx.accounts.vault;
        let campaign = &ctx.accounts.campaign;

        let current_balance = **vault.lamports.borrow();
        let rent_exempt = Rent::get()?.minimum_balance(vault.data_len());
        
        require!(current_balance >= LAMPORTS_PER_SOL / 100, CascadeError::InsufficientFundsForWithdrawal);
        require!(current_balance - amount >= rent_exempt, CascadeError::VaultBelowRentExempt);
        
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

    pub system_program: Program<'info, System>,
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

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Donate<'info> {
    #[account(mut)]
    pub donor: Signer<'info>,

    #[account(
        mut,
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
    // Status of the campaign
    pub status: CampaignStatus,
}

#[account]
#[derive(InitSpace)]
pub struct CampaignCounter {
    pub count: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, InitSpace)]
pub enum CampaignStatus {
    Active,
    Completed,
    Cancelled,
}