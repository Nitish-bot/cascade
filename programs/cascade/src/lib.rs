#![allow(unexpected_cfgs)]
#![allow(deprecated)]

mod constants;
mod errors;
mod instructions;
mod state;

use anchor_lang::prelude::*;
use instructions::*;

declare_id!("HQ8ejrFMtoNsShZRqkH842BRDqpzh7Xy7b5iqc1U9ffA");

#[program]
pub mod cascade {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        instructions::initialize(ctx)
    }

    pub fn update_config(
        ctx: Context<UpdateConfig>,
        new_authority: Option<Pubkey>,
        new_treasury_pubkey: Option<Pubkey>,
        new_min_goal: Option<u64>,
        new_min_withdrawal: Option<u64>,
        new_platform_fee_bps: Option<u64>,
    ) -> Result<()> {
        instructions::update_config(
            ctx,
            new_authority,
            new_treasury_pubkey,
            new_min_goal,
            new_min_withdrawal,
            new_platform_fee_bps,
        )
    }

    pub fn create_campaign(ctx: Context<CreateCampaign>, goal: u64, metadata: String, deadline: i64) -> Result<()> {
        instructions::create_campaign(ctx, goal, metadata, deadline)        
    }

    pub fn donate(ctx: Context<Donate>, amount: u64) -> Result<()> {
        instructions::donate(ctx, amount)
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        instructions::withdraw(ctx, amount)
    }
}
