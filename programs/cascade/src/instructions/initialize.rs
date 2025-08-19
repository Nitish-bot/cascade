use anchor_lang::prelude::*;

use crate::constants::*;
use crate::state::*;

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
