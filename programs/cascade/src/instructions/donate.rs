use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

use crate::errors::*;
use crate::state::*;

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
