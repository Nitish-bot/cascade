use anchor_lang::prelude::*;

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
