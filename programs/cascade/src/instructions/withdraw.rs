use anchor_lang::prelude::*;
use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;
use anchor_lang::system_program::{ transfer, Transfer };

use crate::errors::*;
use crate::state::*;

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
