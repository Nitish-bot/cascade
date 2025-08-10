use anchor_lang::prelude::*;

declare_id!("6LvLTeiy6JNitq1WGdGp75DvRBHKrmpMAREfYgoMMyGq");

#[program]
pub mod faucet {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
