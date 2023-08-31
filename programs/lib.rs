use anchor_lang::prelude::*;

pub mod constant;
pub mod error;
pub mod states;
use crate::{constant::*, error::*, states::*};

declare_id!("6at6Z1UyXaSz8qfjuCZCjPCmY4pU6FVqhTdtowF1GpZb");

#[program]
pub mod solana_confessions {
    use super::*;

    pub fn initialize_user(
        ctx: Context<InitializeUser>
    ) -> Result<()> {
        // Initialize user profile with default data
        let user_profile = &mut ctx.accounts.user_profile;
        user_profile.authority = ctx.accounts.authority.key();
        user_profile.confessions_count = 0;
        user_profile.last_confession = 0;

        msg!("Initialized user: {}", user_profile.authority);
        Ok(())
    }
    // Add a USER_PROFILE to the blockchain
    // Add values for the default data

    // See CONFESSIONS board

    // Add a CONFESSION

    pub fn add_confession(
        ctx: Context<AddConfession>,
        _confession: String
    ) -> Result<()> {
        let confession_account = &mut ctx.accounts.confession_account;
        let user_profile = &mut ctx.accounts.user_profile;

        // Confession should not be empty
        require!(!_confession.is_empty(), ConfessionError::ConfessionNotEmpty);

        // Fill states with argument
        confession_account.authority = ctx.accounts.authority.key();
        confession_account.idx = user_profile.last_confession;
        confession_account.confession = _confession;

        // Increase confession idx for PDA
        user_profile.last_confession = user_profile.last_confession
            .checked_add(1)
            .unwrap();

        // Increase total confessions count
        user_profile.confessions_count = user_profile.confessions_count
            .checked_add(1)
            .unwrap();

        msg!("Added confession '{}' from {}", confession_account.confession, user_profile.authority);
        msg!("User {} has now a total of {} confessions", user_profile.authority, user_profile.confessions_count);
        
        Ok(())
    }

    // Retrieve all CONFESSIONS for the board again
}

#[derive(Accounts)]
#[instruction()]
pub struct InitializeUser<'info> {
    #[account(mut)]
    pub authority:Signer<'info>,

    #[account(
        init,
        seeds = [USER_TAG,authority.key().as_ref()],
        bump,
        payer = authority,
        space = 8 + std::mem::size_of::<UserProfile>(),
    )]
    pub user_profile: Box<Account<'info, UserProfile>>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction()]
pub struct AddConfession<'info> {
    #[account(
        mut,
        seeds = [USER_TAG, authority.key().as_ref()],
        bump,
        has_one = authority,
    )]
    pub user_profile: Box<Account<'info, UserProfile>>,

    #[account(
        init,
        seeds = [CONFESSION_TAG, authority.key().as_ref(), &[user_profile.last_confession as u8].as_ref()],
        bump,
        payer = authority,
        space = std::mem::size_of::<ConfessionAccount>() + 8,
    )]
    pub confession_account: Box<Account<'info, ConfessionAccount>>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}
