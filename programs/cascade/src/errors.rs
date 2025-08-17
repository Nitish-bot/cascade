use anchor_lang::prelude::*;

#[error_code]
pub enum CascadeError {
    #[msg("Campaign not found")]
    CampaignNotFound,

    #[msg("Insufficient funds for withdrawal")]
    InsufficientFundsForWithdrawal,

    #[msg("Insufficient funds for donation")]
    InsufficientFundsForDonation,

    #[msg("Campaign goal already reached")]
    CampaignGoalReached,

    #[msg("Unauthorized action")]
    UnauthorizedAction,
}