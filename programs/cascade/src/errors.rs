use anchor_lang::prelude::*;

#[error_code]
pub enum CascadeError {
    #[msg("Campaign not found")]
    CampaignNotFound,

    #[msg("Goal must be greater than 0.05 SOL")]
    InsufficientGoal,

    #[msg("Fee calculation overflow")]
    FeeCalculationOverflow,

    #[msg("Insufficient funds for donation")]
    InsufficientFundsForDonation,

    #[msg("Insufficient funds for withdrawal")]
    InsufficientFundsForWithdrawal,

    #[msg("Completing this withdrawal will leave the vault below rent exempt threshold")]
    VaultBelowRentExempt,

    #[msg("Campaign goal already reached")]
    CampaignGoalReached,

    #[msg("Unauthorized action")]
    UnauthorizedAction,
}