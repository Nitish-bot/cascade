use anchor_lang::prelude::*;

declare_id!("6LvLTeiy6JNitq1WGdGp75DvRBHKrmpMAREfYgoMMyGq");

#[program]
pub mod faucet {
    use super::*;

    pub fn create_campaign(ctx: Context<CreateCampaign>, metadata: String) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        
        
        campaign.organiser = ctx.accounts.organiser.key();
        campaign.goal = 0;
        campaign.raised = 0;
        campaign.metadata = metadata;
        campaign.vault_bump = ctx.bumps.campaign;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateCampaign<'info> {
    #[account(mut)]
    pub organiser: Signer<'info>,

    #[account(
        init,
        payer = organiser,
        space = Campaign::INIT_SPACE,
        seeds = [b"campaign", organiser.key().as_ref()],
        bump
    )]
    pub campaign: Account<'info, Campaign>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Donate<'info> {
    #[account(mut)]
    pub donor: Signer<'info>,

    #[account(
        mut,
        has_one = organiser,
        seeds = [b"campaign", organiser.key().as_ref()],
        bump = campaign.vault_bump
    )]
    pub campaign: Account<'info, Campaign>,

    pub organiser: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Campaign {
    // Wallet address of the organiser
    pub organiser: Pubkey,
    // Goal amount in lamports
    pub goal: u64,
    // Amount of lamports raised so far
    pub raised: u64,
    // Link to metadata (hosted off chain for now) 
    #[max_len(128)]
    pub metadata: String,
    // Bump for the vault that holds the funds
    pub vault_bump: u8,
}