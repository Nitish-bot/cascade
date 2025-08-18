use anchor_lang::prelude::*;

#[error_code]
pub enum CascadeError {
    #[msg("Campaign Counter overflow")]
    CounterOverflow,

    #[msg("Metadata link too long, must be 128 characters or less")]
    MetadataTooLong,

    #[msg("Goal must be greater than 0.05 SOL")]
    InsufficientGoal,

    #[msg("Deadline must be in the future")]
    DeadlineInPast,

    #[msg("Deadline must be at least 1 day in the future")]
    DeadlineTooSoon,

    #[msg("Fee calculation overflow")]
    FeeCalculationOverflow,

    #[msg("Raised amount overflow")]
    RaisedOverflow,

    #[msg("Insufficient funds for donation")]
    InsufficientFundsForDonation,

    #[msg("Insufficient funds for withdrawal, must be greater than 0.01 SOL")]
    InsufficientFundsForWithdrawal,

    #[msg("Withdrawal amount must be less than or equal to the vault balance")]
    WithdrawalAmountExceedsBalance,

    #[msg("Completing this withdrawal will leave the vault below rent exempt threshold")]
    VaultBelowRentExempt,

    #[msg("Unauthorized action")]
    UnauthorizedAction,
}