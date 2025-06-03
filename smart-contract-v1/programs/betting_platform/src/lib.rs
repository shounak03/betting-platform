use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::Clock;

use anchor_lang::solana_program::{system_instruction::transfer, program::{invoke_signed,invoke}};
declare_id!("JAVuBXeBZqXNtS73azhBDAoYaaAFfo4gWXoZe2e7Jf8H");

const _PLATFORM_FEE:u32 =   10;
const RESOLUTION_DEADLINE:u64 = 48*60*60;
const ANCHOR_SPACE_DENOMINATOR:usize = 8;

#[program]
pub mod betting_platform {

    use super::*;

    pub fn initialize_platform(ctx: Context<InitializePlatform>,
                                platform_authority: Pubkey,
    ) -> Result<()> {

        let platform = &mut ctx.accounts.platform;
        platform.authority = platform_authority;
        platform.total_bets = 0;
        platform.total_volume = 0;
        platform.bump =ctx.bumps.platform;

        Ok(())
    }

    pub fn create_bet(ctx: Context<CreateBet>,
                      bet_id: u64,
                      title: String,
                      description: String,
                      resolver: Pubkey,
                      end_time: u64,
                      betting_amount:u64
    ) -> Result<()> {

        let bet = &mut ctx.accounts.bet;

        bet.id = bet_id;
        bet.creator = ctx.accounts.creator.key();
        bet.title = title;
        bet.description = description;
        bet.resolver = resolver;
        bet.end_time = end_time;
        bet.betting_amount = betting_amount;
        bet.resolution_deadline = end_time + RESOLUTION_DEADLINE;
        bet.status = BetStatus::Active;
        bet.participants = 0;
        bet.total_amount = 0;
        bet.side_a_amount = 0;
        bet.side_b_amount = 0;
        bet.winner = None;
        bet.bump = ctx.bumps.bet;

        let platform = &mut ctx.accounts.platform;
        platform.total_bets += 1;

        emit!(BetCreated{
            bet_id,
            creator: ctx.accounts.creator.key(),
            resolver,
            title: bet.title.clone(),
            end_time
        });

        Ok(())
    }

    
    pub fn place_bet(  ctx: Context<PlaceBet>,
                        bet_id:u64,
                        side: BetSide,
                        amount: u64
    ) -> Result<()> { 
        let bet = &mut ctx.accounts.bet;

        //checking some imp condition before placing the bet. throws error if fails
        require!(bet.status == BetStatus::Active,BettingError::BetNotActive);
        require!(Clock::get()?.unix_timestamp < bet.end_time as i64 ,BettingError::BetEnded);
        require!(amount != bet.betting_amount,BettingError::InvalidAmount);
        require!(ctx.accounts.bettor.key() != bet.resolver,BettingError::ResolverCannotPlaceBet);
        require!(ctx.accounts.user_bet.amount != 0,BettingError::BetCanOnlyBePlacedOnce);


        //Transfering the bet amount to vault
        let from_pubkey = &ctx.accounts.bettor.key();
        let to_pubkey = &ctx.accounts.bet_vault.key();

        let transfer_instruction = transfer(from_pubkey, to_pubkey, amount);
        invoke(&transfer_instruction, 
        &[
            ctx.accounts.bettor.to_account_info(),
            ctx.accounts.bet_vault.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ])?;

        bet.total_amount += amount;
        bet.participants += 1; 

        match side{
            BetSide::A => bet.side_a_amount+=amount,
            BetSide::B => bet.side_b_amount+=amount
        }
        //Updating user record

        let user_bet = &mut ctx.accounts.user_bet;
        if user_bet.amount == 0{
            user_bet.bettor = ctx.accounts.bettor.key();
            user_bet.bet_id = bet_id;
            user_bet.amount = amount;
            user_bet.bump = ctx.bumps.user_bet;
        }else {
            require!(user_bet.side == side, BettingError::CannotChangeSide);
            user_bet.amount += amount;
        }

        //Updating platform record

        let platform = &mut ctx.accounts.platform;
        platform.total_volume += amount;

        emit!(BetPlaced {
            bet_id,
            bettor: ctx.accounts.bettor.key(),
            side,
            amount,
            total_amount: bet.total_amount,
        });


        Ok(())  
    
    }
    
    
    pub fn resolve_bet(ctx: Context<ResolveBet>,
                        bet_id:u64,
                        winner: BetSide
    ) -> Result<()> {   

        let bet = &mut ctx.accounts.bet;
        let clock = Clock::get()?;

        require!(bet.status == BetStatus::Active,BettingError::BetNotActive);
        require!(clock.unix_timestamp as u64 >= bet.end_time, BettingError::BetNotEnded);
        require!(clock.unix_timestamp as u64 >= bet.resolution_deadline,BettingError::ResolutionDeadlineExpired);
        require!(ctx.accounts.resolver.key() == bet.resolver,BettingError::UnauthorizedResolver);

        bet.status = BetStatus::Resolved;
        bet.winner = Some(winner.clone());
       
        emit!(BetResolved{
            bet_id,
            winner,
            resolver: ctx.accounts.resolver.key()
        });

        Ok(())
    }

    pub fn claim_winnings(ctx: Context<ClaimWinnings>,
                            bet_id:u64,
    ) -> Result<()> {

        let bet = &ctx.accounts.bet;
        let user_bet = &ctx.accounts.user_bet;

        require!(bet.status == BetStatus::Resolved,BettingError::UnresolvedBet);
        require!(user_bet.bettor == ctx.accounts.bettor.key(),BettingError::Unauthorized);
        require!(!user_bet.claimed,BettingError::AlreadyClaimed);

        let winner = bet.winner.clone().unwrap();
        require!(user_bet.side == winner,BettingError::NotWinner);

        let winning_amount = ((bet.total_amount * 90) / 100)/bet.participants;

        let bet_id_bytes = bet.id.to_le_bytes();
        let bet_vault_seeds = &[
            b"bet_vault",
            bet_id_bytes.as_ref(),
            &[ctx.bumps.bet_vault],
        ];
        let signer_seeds = &[&bet_vault_seeds[..]];

        let transfer_instruction = transfer(
            &ctx.accounts.bet_vault.key(),
            &ctx.accounts.bettor.key(),
            winning_amount,
        );

        invoke_signed(
            &transfer_instruction,
            &[
                ctx.accounts.bet_vault.to_account_info(),
                ctx.accounts.bettor.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
            signer_seeds,
        )?;

        // **ctx.accounts.bet_vault.to_account_info().try_borrow_mut_lamports()? -= winning_amount;
        // **ctx.accounts.bettor.to_account_info().try_borrow_mut_lamports()? += winning_amount;


       
        
        let user_bet = &mut ctx.accounts.user_bet;
        user_bet.claimed = true;

        emit!(WinningsClaimed {
            bet_id,
            bettor: ctx.accounts.bettor.key(),
            amount: winning_amount,
        });

        Ok(())
    }
    
    // // pub fn claim_platform_fees(_ctx: Context<Initialize>) -> Result<()> {

    //     Ok(())
    // }
}


//Context Data Structures
#[derive(Accounts)]
pub struct InitializePlatform<'info> {
    #[account(
        init,
        payer = payer,
        space = ANCHOR_SPACE_DENOMINATOR + Platform::INIT_SPACE,
        seeds = [b"platform"],
        bump
    )]
    pub platform: Account<'info,Platform>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info,System>
}


#[derive(Accounts)]
#[instruction(bet_id:u64)]
pub struct CreateBet<'info>{
    #[account(
        init,
        payer = creator,
        space =ANCHOR_SPACE_DENOMINATOR + Bet::INIT_SPACE,
        seeds = [b"bet",bet_id.to_le_bytes().as_ref()],
        bump
    )]

    pub bet: Account<'info,Bet>,

    /// CHECK: This is the bet vault that will hold the SOL for this bet

    #[account(
        mut,
        seeds = [b"bet_vault", &bet_id.to_le_bytes()],
        bump
    )]
    pub bet_vault: AccountInfo<'info>,

    #[account(
        mut,
        seeds = [b"platform"],
        bump
    )]
    pub platform: Account<'info,Platform>,

    #[account(mut)]
    pub creator: Signer<'info>,

    pub system_program: Program<'info,System>
}

#[derive(Accounts)]
#[instruction(bet_id: u64)]
pub struct PlaceBet<'info>{
    #[account(
        mut,
        seeds = [b"bet",&bet_id.to_le_bytes()],
        bump
    )]
    pub bet: Account<'info,Bet>,

    /// CHECK: This is the bet vault that will hold the SOL for this bet
     #[account(
        mut,
        seeds = [b"bet_vault", &bet_id.to_le_bytes()],
        bump 
    )]
    pub bet_vault: AccountInfo<'info>,

     #[account(
        init_if_needed,
        payer = bettor,
        space = ANCHOR_SPACE_DENOMINATOR + UserBet::INIT_SPACE,
        seeds = [b"user_bet",&bet_id.to_le_bytes(),bettor.key().as_ref()],
        bump
    )]
    pub user_bet: Account<'info,UserBet>,
    #[account(
        mut,
        seeds = [b"platform"],
        bump
    )]
    pub platform: Account<'info,Platform>,

    #[account(mut)]
    pub bettor: Signer<'info>,
    pub system_program: Program<'info,System>
}

#[derive(Accounts)]
#[instruction(bet_id: u64)]
pub struct ResolveBet<'info>{
    #[account(
        mut,
        seeds = [b"bet",&bet_id.to_le_bytes()],
        bump
    )]
    pub bet: Account<'info,Bet>,

    pub resolver: Signer<'info>
}

#[derive(Accounts)]
#[instruction(bet_id: u64)]
pub struct ClaimWinnings<'info>{
    #[account(
        seeds = [b"bet",&bet_id.to_le_bytes()],
        bump
    )]
    pub bet: Account<'info,Bet>,
    /// CHECK: This is the bet vault that will hold the SOL for this bet
    #[account(
        mut,
        seeds = [b"bet_vault",&bet_id.to_le_bytes()],
        bump
    )]
    pub bet_vault: AccountInfo<'info>,
    #[account(
        mut,
        seeds = [b"user_bet",&bet_id.to_le_bytes(),bettor.key().as_ref()],
        bump
    )]
    pub user_bet: Account<'info,UserBet>,

    #[account(mut)]
    pub bettor: Signer<'info>,

    pub system_program: Program<'info,System>
}




///Data Structures
#[account]
#[derive(InitSpace)]
pub struct Platform{
    pub authority: Pubkey,
    pub total_bets: u64,
    pub total_volume: u64,
    pub bump: u8
}

#[account]
#[derive(InitSpace)]
pub struct Bet{
    pub id: u64,
    pub creator: Pubkey,
    #[max_len(50)]
    pub title: String,
    #[max_len(100)]
    pub description: String,
    pub betting_amount:u64,
    pub resolver: Pubkey,
    pub end_time: u64,
    pub resolution_deadline: u64,
    pub status: BetStatus,
    pub participants: u64,
    pub total_amount: u64,
    pub side_a_amount: u64,
    pub side_b_amount: u64,
    pub winner: Option<BetSide>,
    pub bump: u8
}

#[account]
#[derive(InitSpace)]
pub struct UserBet{
    pub bettor: Pubkey,
    pub bet_id: u64,
    pub amount: u64,
    pub side: BetSide,
    pub claimed: bool,
    pub bump: u8
}


///Enum 
#[derive(AnchorSerialize,AnchorDeserialize,Clone,PartialEq,Eq,InitSpace)]
pub enum BetStatus{
    Active, Resolved, Refunded
}
#[derive(AnchorSerialize,AnchorDeserialize,Clone,PartialEq,Eq,InitSpace)]
pub enum BetSide{
    A, B
}

//Emitting Events
#[event]
pub struct BetCreated{
    pub bet_id: u64,
    pub creator: Pubkey,
    pub resolver: Pubkey,
    pub title: String,
    pub end_time: u64,
    
}

#[event]
pub struct BetPlaced {
    pub bet_id: u64,
    pub bettor: Pubkey,
    pub side: BetSide,
    pub amount: u64,
    pub total_amount: u64,
}

#[event]
pub struct BetResolved {
    pub bet_id: u64,
    pub winner: BetSide,
    pub resolver: Pubkey,
}

#[event]
pub struct WinningsClaimed {
    pub bet_id: u64,
    pub bettor: Pubkey,
    pub amount: u64,
}

#[event]
pub struct BetRefunded {
    pub bet_id: u64,
    pub bettor: Pubkey,
    pub amount: u64,
}


//Error
#[error_code]
pub enum  BettingError {
    
    #[msg("Title too long")]
    TitleTooLong,
    #[msg("Description too long")]
    DescriptionTooLong,
    #[msg("Resolver cannot be the creator")]
    ResolverCannotBeCreator,
    #[msg("Bet is not active")]
    BetNotActive,
    #[msg("Bet has Expired")]
    BetEnded,
    #[msg("Bet is yet to end")]
    BetNotEnded,
    #[msg("Resolution deadline has expired, Bet amounts to be refunded soon")]
    ResolutionDeadlineExpired,
    #[msg("Invalid Amount")]
    InvalidAmount,
    #[msg("Resolver cannot place bets ")]
    ResolverCannotPlaceBet,
    #[msg("One account can bet only one side")]
    CannotChangeSide,
    #[msg("Unauthorized Resolver")]
    UnauthorizedResolver,
    #[msg("Bet not Resolved")]
    UnresolvedBet,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Not a winner")]
    NotWinner,
    #[msg("Winnings already claimed")]
    AlreadyClaimed,
    #[msg("Resolution deadline has not passed")]
    ResolutionDeadlineNotPassed,
    #[msg("A bet can only be placed once")]
    BetCanOnlyBePlacedOnce,

}
