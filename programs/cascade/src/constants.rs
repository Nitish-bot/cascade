use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;

pub const PLATFORM_FEE_BPS: u64 = 200; // 2% in basis points
pub const MIN_GOAL: u64 = LAMPORTS_PER_SOL / 20; // 0.05 SOL in lamports
pub const MIN_WITHDRAWAL: u64 = LAMPORTS_PER_SOL / 100; // 0.01 SOL in lamports
