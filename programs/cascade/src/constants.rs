use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;

pub const TREASURY_PUBKEY: &str = "E8DgocVb8JCtXVb4wwyPpNvPVshm1McSoN9H2qBMSBcm";
pub const PLATFORM_FEE_PERCENT: u64 = 2; 
pub const MIN_GOAL: u64 = LAMPORTS_PER_SOL / 20; // 0.05 SOL in lamports
pub const MIN_WITHDRAWAL: u64 = LAMPORTS_PER_SOL / 100; // 0.01 SOL in lamports
