use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::SECONDS_PER_DAY;

use crate::errors::*;
use crate::state::*;

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
