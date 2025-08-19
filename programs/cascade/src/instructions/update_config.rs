use anchor_lang::prelude::*;

use crate::errors::*;
use crate::state::Config;

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
