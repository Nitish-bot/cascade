use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct CampaignCounter {
    pub count: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, InitSpace)]
pub enum CampaignStatus {
    Active,
    Completed,
    Cancelled,
}

#[account]
#[derive(InitSpace)]
pub struct Campaign {
    // Unique identifier for the campaign
    pub id: u64,
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
    // Timestamp when the campaign was created
    pub created_at: i64,
    // Deadline for the campaign
    pub deadline: i64,
    // Status of the campaign
    pub status: CampaignStatus,
}