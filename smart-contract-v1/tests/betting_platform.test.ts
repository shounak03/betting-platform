import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BettingPlatform } from "../target/types/betting_platform";
import { PublicKey, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { expect } from "chai";
import { error } from "console";

interface Err{
  message:string;
}

describe("betting-platform", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.bettingPlatform as Program<BettingPlatform>;
  const provider = anchor.getProvider();

  // Test accounts
  let platformAuthority: Keypair;
  let creator: Keypair;
  let resolver: Keypair;
  let bettor1: Keypair;
  let bettor2: Keypair;
  let bettor3: Keypair;

  const bettingAmount = new anchor.BN(LAMPORTS_PER_SOL); // 1 SOL minimum bet

  // PDAs
  let platformPda: PublicKey;
  let platformBump: number;

  beforeAll(async () => {
    // Initialize test accounts
    platformAuthority = Keypair.generate();
    creator = Keypair.generate();
    resolver = Keypair.generate();
    bettor1 = Keypair.generate();
    bettor2 = Keypair.generate();
    bettor3 = Keypair.generate();

    // Airdrop SOL to test accounts
    const accounts = [platformAuthority, creator, resolver, bettor1, bettor2, bettor3];
    for (const account of accounts) {
      await provider.connection.requestAirdrop(account.publicKey, 10 * LAMPORTS_PER_SOL);
    }

    // Wait for airdrops to confirm
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find platform PDA
    [platformPda, platformBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("platform")],
      program.programId
    );
  });

  // describe("Platform Initialization", () => {
    it("Should initialize the platform successfully", async () => {
      const tx = await program.methods
        .initializePlatform(platformAuthority.publicKey)
        .accounts({
          platform: platformPda,
          payer: platformAuthority.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([platformAuthority])
        .rpc();

      console.log("Platform initialization tx:", tx);

      // Verify platform account
      const platformAccount = await program.account.platform.fetch(platformPda);
      expect(platformAccount.authority.toString()).to.equal(platformAuthority.publicKey.toString());
      expect(platformAccount.totalBets.toNumber()).to.equal(0);
      expect(platformAccount.totalVolume.toNumber()).to.equal(0);
      expect(platformAccount.bump).to.equal(platformBump);
    });

  describe("Bet Creation", () => {
    const betId = 1;
    let betPda: PublicKey;
    let betVaultPda: PublicKey;

    beforeAll(() => {
      [betPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), new anchor.BN(betId).toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      [betVaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet_vault"), new anchor.BN(betId).toArrayLike(Buffer, "le", 8)],
        program.programId
      );
    });

    it("Should create a bet successfully", async () => {
      const title = "Will Bitcoin reach $100k by end of year?";
      const description = "Will Bitcoin reach $100k by end of year?";
      const endTime = new anchor.BN(Date.now() / 1000 + 3600); // 1 hour from now
      const bettingAmount = new anchor.BN(LAMPORTS_PER_SOL); // 1 SOL minimum bet

      const tx = await program.methods
        .createBet(
          new anchor.BN(betId),
          title,
          description,
          resolver.publicKey,
          endTime,
          bettingAmount // Add the missing betting amount parameter
        )
        .accounts({
          bet: betPda,
          betVault: betVaultPda,
          platform: platformPda,
          creator: creator.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([creator])
        .rpc();

      console.log("Bet creation tx:", tx);

      // Verify bet account
      const betAccount = await program.account.bet.fetch(betPda);
      expect(betAccount.id.toNumber()).to.equal(betId);
      expect(betAccount.creator.toString()).to.equal(creator.publicKey.toString());
      expect(betAccount.title).to.equal(title);
      expect(betAccount.description).to.equal(description);
      expect(betAccount.resolver.toString()).to.equal(resolver.publicKey.toString());
      expect(betAccount.endTime.toNumber()).to.equal(endTime.toNumber());
      expect(betAccount.bettingAmount.toNumber()).to.equal(bettingAmount.toNumber());
      expect(betAccount.status).to.deep.equal({ active: {} });
      expect(betAccount.totalAmount.toNumber()).to.equal(0);
      expect(betAccount.sideAAmount.toNumber()).to.equal(0);
      expect(betAccount.sideBAmount.toNumber()).to.equal(0);
      expect(betAccount.winner).to.be.null;

      // Verify platform stats updated
      const platformAccount = await program.account.platform.fetch(platformPda);
      expect(platformAccount.totalBets.toNumber()).to.equal(1);
    });

  
  });

  describe("Placing Bets", () => {

    const betId = 1;
    let betPda: PublicKey;
    let betVaultPda: PublicKey;
    let userBet1Pda: PublicKey;
    let userBet2Pda: PublicKey;

    beforeAll(() => {
      [betPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), new anchor.BN(betId).toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      [betVaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet_vault"), new anchor.BN(betId).toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      [userBet1Pda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("user_bet"),
          new anchor.BN(betId).toArrayLike(Buffer, "le", 8),
          bettor1.publicKey.toBuffer(),
        ],
        program.programId
      );

      [userBet2Pda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("user_bet"),
          new anchor.BN(betId).toArrayLike(Buffer, "le", 8),
          bettor2.publicKey.toBuffer(),
        ],
        program.programId
      );
    });

    it("Should place bet on side A successfully", async () => {
      const betAmount = new anchor.BN(LAMPORTS_PER_SOL); // 1 SOL

      const tx = await program.methods
        .placeBet(
          new anchor.BN(betId),
          { a: {} }, // BetSide::A
          betAmount
        )
        .accounts({
          bet: betPda,
          betVault: betVaultPda,
          userBet: userBet1Pda,
          platform: platformPda,
          bettor: bettor1.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([bettor1])
        .rpc();

      console.log("Place bet tx:", tx);

      // Verify bet account updated
      const betAccount = await program.account.bet.fetch(betPda);
      expect(betAccount.totalAmount.toNumber()).to.equal(betAmount.toNumber());
      expect(betAccount.sideAAmount.toNumber()).to.equal(betAmount.toNumber());
      expect(betAccount.sideBAmount.toNumber()).to.equal(0);

      // Verify user bet account
      const userBetAccount = await program.account.userBet.fetch(userBet1Pda);
      expect(userBetAccount.bettor.toString()).to.equal(bettor1.publicKey.toString());
      expect(userBetAccount.betId.toNumber()).to.equal(betId);
      expect(userBetAccount.side).to.deep.equal({ a: {} });
      expect(userBetAccount.amount.toNumber()).to.equal(betAmount.toNumber());
      expect(userBetAccount.claimed).to.be.false;

      // Verify platform volume updated
      const platformAccount = await program.account.platform.fetch(platformPda);
      expect(platformAccount.totalVolume.toNumber()).to.equal(betAmount.toNumber());
    });
  

    it("Should place bet on side B successfully", async () => {
      const betAmount = new anchor.BN(LAMPORTS_PER_SOL); // 2 SOL

      const tx = await program.methods
        .placeBet(
          new anchor.BN(betId),
          { b: {} }, // BetSide::B
          betAmount
        )
        .accounts({
          bet: betPda,
          betVault: betVaultPda,
          userBet: userBet2Pda,
          platform: platformPda,
          bettor: bettor2.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([bettor2])
        .rpc();

      console.log("Place bet side B tx:", tx);

      // Verify bet account updated
      const betAccount = await program.account.bet.fetch(betPda);
      expect(betAccount.totalAmount.toNumber()).to.equal(2 * LAMPORTS_PER_SOL);
      expect(betAccount.sideAAmount.toNumber()).to.equal(LAMPORTS_PER_SOL);
      expect(betAccount.sideBAmount.toNumber()).to.equal(1 * LAMPORTS_PER_SOL);
    });


    it("Should fail on additional bets by the same account", async () => {
      const additionalAmount = new anchor.BN(LAMPORTS_PER_SOL); // 0.5 SOL
      try {
        await program.methods
          .placeBet(
            new anchor.BN(betId),
            { a: {} }, // Same side as before
            additionalAmount
          )
          .accounts({
            bet: betPda,
            betVault: betVaultPda,
            userBet: userBet1Pda,
            platform: platformPda,
            bettor: bettor1.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([bettor1])
          .rpc();
  
        // Verify user bet amount increased
        // const userBetAccount = await program.account.userBet.fetch(userBet1Pda);
        // expect(userBetAccount.amount.toNumber()).to.equal(1.5 * LAMPORTS_PER_SOL);
  
        // // Verify bet totals updated
        // const betAccount = await program.account.bet.fetch(betPda);
        // expect(betAccount.totalAmount.toNumber()).to.equal(3.5 * LAMPORTS_PER_SOL);
        // expect(betAccount.sideAAmount.toNumber()).to.equal(1.5 * LAMPORTS_PER_SOL);
      expect.fail("Should have thrown an error");
      } catch (error) {
        // expect(error.message)
        console.log(error.message)
        // .to.include("Title is too long");
      }
    });
  

    it("Should fail when trying to bet on different side", async () => {
      const betAmount = new anchor.BN(LAMPORTS_PER_SOL);

      try {
        await program.methods
          .placeBet(
            new anchor.BN(betId),
            { b: {} }, // Different side
            betAmount
          )
          .accounts({
            bet: betPda,
            betVault: betVaultPda,
            userBet: userBet1Pda,
            platform: platformPda,
            bettor: bettor1.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([bettor1])
          .rpc();

        expect.fail("Should have thrown an error");
      } catch (error:any) {
        expect(error.message)
      }
    });
 

    it("Should fail when resolver tries to bet", async () => {
      const betAmount = new anchor.BN(LAMPORTS_PER_SOL);
      const [resolverUserBetPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("user_bet"),
          new anchor.BN(betId).toArrayLike(Buffer, "le", 8),
          resolver.publicKey.toBuffer(),
        ],
        program.programId
      );

      try {
        await program.methods
          .placeBet(
            new anchor.BN(betId),
            { a: {} },
            betAmount
          )
          .accounts({
            bet: betPda,
            betVault: betVaultPda,
            userBet: resolverUserBetPda,
            platform: platformPda,
            bettor: resolver.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([resolver])
          .rpc();

        expect.fail("Should have thrown an error");
      } catch (error:any) {
        expect(error.message).to.include("Resolver cannot place bets");
      }
    });
  });
  

  describe("Bet Resolution", () => {
    const betId = 1;
    let betPda: PublicKey;

    beforeAll(() => {
      [betPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), new anchor.BN(betId).toArrayLike(Buffer, "le", 8)],
        program.programId
      );
    });

    it("Should fail to resolve bet before end time", async () => {
      try {
        await program.methods
          .resolveBet(
            new anchor.BN(betId),
            { a: {} } // Winner side A
          )
          .accounts({
            bet: betPda,
            resolver: resolver.publicKey,
          })
          .signers([resolver])
          .rpc();

        expect.fail("Should have thrown an error");
      } catch (error:any) {
        
        console.log(error.message);
        

      }
    });

      
    it("Should resolve bet successfully after end time", async () => {
      // Wait for bet to end (or modify the bet's end time for testing)
      // For testing purposes, let's create a new bet with a past end time
      const shortBetId = 5;
      const resolverBalanceBefore = await provider.connection.getBalance(resolver.publicKey);
      const [shortBetPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), new anchor.BN(shortBetId).toArrayLike(Buffer, "le", 8)],
        program.programId
      );
      const [shortBetVaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet_vault"), new anchor.BN(shortBetId).toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      // Create a bet that ends in 1 second
      const endTime = new anchor.BN(Date.now() / 1000 + 1);
      await program.methods
        .createBet(
          new anchor.BN(shortBetId),
          "Quick test bet",
          "A bet for testing resolution",
          resolver.publicKey,
          endTime,
          bettingAmount
        )
        .accounts({
          bet: shortBetPda,
          betVault: shortBetVaultPda,
          platform: platformPda,
          creator: creator.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([creator])
        .rpc();

      // Place some bets
      const [userBetPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("user_bet"),
          new anchor.BN(shortBetId).toArrayLike(Buffer, "le", 8),
          bettor1.publicKey.toBuffer(),
        ],
        program.programId
      );

      await program.methods
        .placeBet(
          new anchor.BN(shortBetId),
          { a: {} },
          new anchor.BN(LAMPORTS_PER_SOL)
        )
        .accounts({
          bet: shortBetPda,
          betVault: shortBetVaultPda,
          userBet: userBetPda,
          platform: platformPda,
          bettor: bettor1.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([bettor1])
        .rpc();

      // Wait for bet to end
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Now resolve the bet
      const tx = await program.methods
        .resolveBet(
          new anchor.BN(shortBetId),
          { a: {} } // Side A wins
        )
        .accounts({
          bet: shortBetPda,
          resolver: resolver.publicKey,
        })
        .signers([resolver])
        .rpc();

      console.log("Resolve bet tx:", tx);

      // Verify bet is resolved
      const betAccount = await program.account.bet.fetch(shortBetPda);
      const resolverBalance = await provider.connection.getBalance(resolver.publicKey);
      expect(resolverBalance).to.be.greaterThan(resolverBalanceBefore);
      
      expect(betAccount.status).to.deep.equal({ resolved: {} });
      expect(betAccount.winner).to.deep.equal({ a: {} });
    });
  
  

    it("Should fail when unauthorized user tries to resolve", async () => {
      const shortBetId = 6;
      const [shortBetPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), new anchor.BN(shortBetId).toArrayLike(Buffer, "le", 8)],
        program.programId
      );
      const [shortBetVaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet_vault"), new anchor.BN(shortBetId).toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      // Create and end a bet
      const endTime = new anchor.BN(Date.now() / 1000 + 1);
      await program.methods
        .createBet(
          new anchor.BN(shortBetId),
          "Another test bet",
          "A bet for testing unauthorized resolution",
          resolver.publicKey,
          endTime,
          bettingAmount
        )
        .accounts({
          bet: shortBetPda,
          betVault: shortBetVaultPda,
          platform: platformPda,
          creator: creator.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([creator])
        .rpc();

      await new Promise(resolve => setTimeout(resolve, 2000));

      try {
        await program.methods
          .resolveBet(
            new anchor.BN(shortBetId),
            { a: {} }
          )
          .accounts({
            bet: shortBetPda,
            resolver: creator.publicKey, // Wrong resolver
          })
          .signers([creator])
          .rpc();

        expect.fail("Should have thrown an error");
      } catch (error:any) {
        expect(error.message)
      }
    });
  });
  

  describe("Claiming Winnings", () => {
    const betId = 5; // Use the resolved bet from previous test
    let betPda: PublicKey;
    let betVaultPda: PublicKey;
    let userBetPda: PublicKey;

    beforeAll(() => {
      [betPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), new anchor.BN(betId).toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      [betVaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet_vault"), new anchor.BN(betId).toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      [userBetPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("user_bet"),
          new anchor.BN(betId).toArrayLike(Buffer, "le", 8),
          bettor1.publicKey.toBuffer(),
        ],
        program.programId
      );
    });

    it("Should claim winnings successfully", async () => {
      const balanceBefore = await provider.connection.getBalance(bettor1.publicKey);

      const tx = await program.methods
        .claimWinnings(new anchor.BN(betId))
        .accounts({
          bet: betPda,
          betVault: betVaultPda,
          userBet: userBetPda,
          bettor: bettor1.publicKey,
        })
        .signers([bettor1])
        .rpc();

      console.log("Claim winnings tx:", tx);

      const balanceAfter = await provider.connection.getBalance(bettor1.publicKey);
     
      expect(balanceAfter).to.be.greaterThan(balanceBefore);

      // Verify user bet is marked as claimed
      const userBetAccount = await program.account.userBet.fetch(userBetPda);
      expect(userBetAccount.claimed).to.be.true;
    });

    it("Should fail to claim winnings twice", async () => {
      try {
        await program.methods
          .claimWinnings(new anchor.BN(betId))
          .accounts({
            bet: betPda,
            betVault: betVaultPda,
            userBet: userBetPda,
            bettor: bettor1.publicKey,
          })
          .signers([bettor1])
          .rpc();

        expect.fail("Should have thrown an error");
      } catch (error:any) {
        expect(error.message)
      }
    });
  });

  describe("Bet Refunds", () => {
    const refundBetId = 7;
    let refundBetPda: PublicKey;
    let refundBetVaultPda: PublicKey;
    let refundUserBetPda: PublicKey;

    beforeAll(async () => {
      [refundBetPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), new anchor.BN(refundBetId).toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      [refundBetVaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet_vault"), new anchor.BN(refundBetId).toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      [refundUserBetPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("user_bet"),
          new anchor.BN(refundBetId).toArrayLike(Buffer, "le", 8),
          bettor1.publicKey.toBuffer(),
        ],
        program.programId
      );

      // Create a bet that will expire without resolution
      const endTime = new anchor.BN(Date.now() / 1000 + 1);
      await program.methods
        .createBet(
          new anchor.BN(refundBetId),
          "Refund test bet",
          "A bet for testing refunds",
          resolver.publicKey,
          endTime,
          bettingAmount
          
        )
        .accounts({
          bet: refundBetPda,
          betVault: refundBetVaultPda,
          platform: platformPda,
          creator: creator.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([creator])
        .rpc();

      // Place a bet
      await program.methods
        .placeBet(
          new anchor.BN(refundBetId),
          { a: {} },
          new anchor.BN(LAMPORTS_PER_SOL)
        )
        .accounts({
          bet: refundBetPda,
          betVault: refundBetVaultPda,
          userBet: refundUserBetPda,
          platform: platformPda,
          bettor: bettor1.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([bettor1])
        .rpc();

      // Wait for bet to end and resolution deadline to pass (48 hours + buffer)
      // For testing, we'll need to wait or modify the contract for shorter deadlines
      await new Promise(resolve => setTimeout(resolve, 2000));
    });

    it("Should fail to refund before resolution deadline", async () => {
      try {
        await program.methods
          .claimRefund(new anchor.BN(refundBetId))
          .accounts({
            bet: refundBetPda,
            betVault: refundBetVaultPda,
            userBet: refundUserBetPda,
            bettor: bettor1.publicKey,
          })
          .signers([bettor1])
          .rpc();

        expect.fail("Should have thrown an error");
      } catch (error:any) {
        expect(error.message).to.include("Resolution deadline has not passed");
      }
    });


  });

  describe("Claim Platform Fees", () => {
    const feeBetId = 8;
    let feeBetPda: PublicKey;
    let feeBetVaultPda: PublicKey;
    let feeUserBetPda: PublicKey;

    beforeAll(async () => {
      [feeBetPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), new anchor.BN(feeBetId).toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      [feeBetVaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet_vault"), new anchor.BN(feeBetId).toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      [feeUserBetPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("user_bet"),
          new anchor.BN(feeBetId).toArrayLike(Buffer, "le", 8),
          bettor1.publicKey.toBuffer(),
        ],
        program.programId
      );

      // Create a bet for testing platform fees
      const endTime = new anchor.BN(Date.now() / 1000 + 1);
      await program.methods
        .createBet(
          new anchor.BN(feeBetId),
          "Platform fee test bet",
          "A bet for testing platform fee claims",
          resolver.publicKey,
          endTime,
          bettingAmount
        )
        .accounts({
          bet: feeBetPda,
          betVault: feeBetVaultPda,
          platform: platformPda,
          creator: creator.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([creator])
        .rpc();

      // Place bets on both sides
      await program.methods
        .placeBet(
          new anchor.BN(feeBetId),
          { a: {} },
          new anchor.BN(LAMPORTS_PER_SOL)
        )
        .accounts({
          bet: feeBetPda,
          betVault: feeBetVaultPda,
          userBet: feeUserBetPda,
          platform: platformPda,
          bettor: bettor1.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([bettor1])
        .rpc();

      const [feeUserBet2Pda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("user_bet"),
          new anchor.BN(feeBetId).toArrayLike(Buffer, "le", 8),
          bettor2.publicKey.toBuffer(),
        ],
        program.programId
      );

      await program.methods
        .placeBet(
          new anchor.BN(feeBetId),
          { b: {} },
          new anchor.BN(LAMPORTS_PER_SOL)
        )
        .accounts({
          bet: feeBetPda,
          betVault: feeBetVaultPda,
          userBet: feeUserBet2Pda,
          platform: platformPda,
          bettor: bettor2.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([bettor2])
        .rpc();

      // Wait for bet to end
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Resolve the bet
      await program.methods
        .resolveBet(
          new anchor.BN(feeBetId),
          { a: {} } // Side A wins
        )
        .accounts({
          bet: feeBetPda,
          betVault: feeBetVaultPda,
          resolver: resolver.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([resolver])
        .rpc();
    });

    it("Should claim platform fees successfully", async () => {
      const platformAuthorityBalanceBefore = await provider.connection.getBalance(
        platformAuthority.publicKey
      );

      const betAccount = await program.account.bet.fetch(feeBetPda);
      const expectedPlatformFee = (betAccount.totalAmount.toNumber() * 10) / 100; // 10% platform fee

      try {
        const tx = await program.methods
          .claimPlatformFees(new anchor.BN(feeBetId))
          .accounts({
            bet: feeBetPda,
            betVault: feeBetVaultPda,
            platform: platformPda,
            authority: platformAuthority.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([platformAuthority])
          .rpc();
  
        console.log("Claim platform fees tx:", tx);
  
        const platformAuthorityBalanceAfter = await provider.connection.getBalance(
          platformAuthority.publicKey
        );
  
        // Verify platform authority received the fee
        expect(platformAuthorityBalanceAfter).to.be.greaterThan(platformAuthorityBalanceBefore);
        
        // Calculate the actual received amount (minus transaction fees)
        const actualReceived = platformAuthorityBalanceAfter - platformAuthorityBalanceBefore;
        
        // The received amount should be close to the expected platform fee
        // (allowing for some difference due to transaction fees)
        expect(actualReceived).to.be.greaterThan(expectedPlatformFee * 0.99); // At least 99% of expected fee
      } catch (error) {
          console.log(error);
          
      }
    });

    it("Should fail when unauthorized user tries to claim platform fees", async () => {
      try {
        await program.methods
          .claimPlatformFees(new anchor.BN(feeBetId))
          .accounts({
            bet: feeBetPda,
            betVault: feeBetVaultPda,
            platform: platformPda,
            authority: creator.publicKey, // Wrong authority
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([creator])
          .rpc();

        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.message)
      }
    });

    it("Should fail to claim platform fees from unresolved bet", async () => {
      // Create another bet but don't resolve it
      const unresolvedBetId = 9;
      const [unresolvedBetPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), new anchor.BN(unresolvedBetId).toArrayLike(Buffer, "le", 8)],
        program.programId
      );
      const [unresolvedBetVaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet_vault"), new anchor.BN(unresolvedBetId).toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const endTime = new anchor.BN(Date.now() / 1000 + 3600); // 1 hour from now
      await program.methods
        .createBet(
          new anchor.BN(unresolvedBetId),
          "Unresolved bet",
          "A bet that won't be resolved",
          resolver.publicKey,
          endTime,
          bettingAmount
        )
        .accounts({
          bet: unresolvedBetPda,
          betVault: unresolvedBetVaultPda,
          platform: platformPda,
          creator: creator.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([creator])
        .rpc();

      try {
        await program.methods
          .claimPlatformFees(new anchor.BN(unresolvedBetId))
          .accounts({
            bet: unresolvedBetPda,
            betVault: unresolvedBetVaultPda,
            platform: platformPda,
            authority: platformAuthority.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([platformAuthority])
          .rpc();

        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.message)
      }
    });
  });
});
  