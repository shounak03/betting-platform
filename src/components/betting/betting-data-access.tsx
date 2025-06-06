'use client'

import { getBettingProgram, getBettingProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../use-transaction-toast'
import { toast } from 'sonner'
import * as anchor from '@coral-xyz/anchor'

export function useBettingProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getBettingProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getBettingProgram(provider, programId), [provider, programId])

  // Get platform PDA
  const [platformPda] = useMemo(() => 
    PublicKey.findProgramAddressSync([Buffer.from("platform")], programId),
    [programId]
  )

  // Get platform account
  const getPlatform = useQuery({
    queryKey: ['get-platform', { cluster }],
    queryFn: async () => {
      try {
        return await program.account.platform.fetch(platformPda)
      } catch (error) {
        console.log('Platform not initialized')
        return null
      }
    },
  })

  // Get all bets
  const getAllBets = useQuery({
    queryKey: ['get-all-bets', { cluster }],
    queryFn: async () => {
      try {
        return await program.account.bet.all()
      } catch (error) {
        console.log('Error fetching bets:', error)
        return []
      }
    },
  })

  // Get bet by ID
  const getBet = (betId: number) => {
    const [betPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("bet"), new anchor.BN(betId).toArrayLike(Buffer, "le", 8)],
      programId
    )

    return useQuery({
      queryKey: ['get-bet', betId, { cluster }],
      queryFn: async () => {
        try {
          return await program.account.bet.fetch(betPda)
        } catch (error) {
          console.log(`Bet ${betId} not found`)
          return null
        }
      },
    })
  }

  // Get user bet
  const getUserBet = (betId: number, userPubkey: PublicKey | null) => {
    const [userBetPda] = useMemo(() => {
      if (!userPubkey) return [PublicKey.default]
      return PublicKey.findProgramAddressSync(
        [
          Buffer.from("user_bet"),
          new anchor.BN(betId).toArrayLike(Buffer, "le", 8),
          userPubkey.toBuffer(),
        ],
        programId
      )
    }, [betId, userPubkey, programId])

    return useQuery({
      queryKey: ['get-user-bet', betId, userPubkey?.toString(), { cluster }],
      queryFn: async () => {
        if (!userPubkey) return null
        try {
          return await program.account.userBet.fetch(userBetPda)
        } catch (error) {
          return null
        }
      },
      enabled: !!userPubkey,
    })
  }

  // Initialize platform
  const initializePlatform = useMutation({
    mutationKey: ['betting', 'initialize-platform', { cluster }],
    mutationFn: async ({ platformAuthority }: { platformAuthority: PublicKey }) => {
      return await program.methods
        .initializePlatform(platformAuthority)
        .accountsPartial({
          platform: platformPda,
          payer: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      return getPlatform.refetch()
    },
    onError: () => toast.error('Failed to initialize platform'),
  })

  // Create bet
  const createBet = useMutation({
    mutationKey: ['betting', 'create-bet', { cluster }],
    mutationFn: async ({ 
      betId, 
      title, 
      description, 
      resolver, 
      endTime, 
      bettingAmount 
    }: {
      betId: number
      title: string
      description: string
      resolver: PublicKey
      endTime: number
      bettingAmount: number
    }) => {
      const [betPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), new anchor.BN(betId).toArrayLike(Buffer, "le", 8)],
        programId
      )
      const [betVaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet_vault"), new anchor.BN(betId).toArrayLike(Buffer, "le", 8)],
        programId
      )

      return await program.methods
        .createBet(
          new anchor.BN(betId),
          title,
          description,
          resolver,
          new anchor.BN(endTime),
          new anchor.BN(bettingAmount)
        )
        .accountsPartial({
          bet: betPda,
          betVault: betVaultPda,
          platform: platformPda,
          creator: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      getAllBets.refetch()
      getPlatform.refetch()
    },
    onError: () => toast.error('Failed to create bet'),
  })

  // Place bet
  const placeBet = useMutation({
    mutationKey: ['betting', 'place-bet', { cluster }],
    mutationFn: async ({ 
      betId, 
      side, 
      amount 
    }: {
      betId: number
      side: 'A' | 'B'
      amount: number
    }) => {
      const [betPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), new anchor.BN(betId).toArrayLike(Buffer, "le", 8)],
        programId
      )
      const [betVaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet_vault"), new anchor.BN(betId).toArrayLike(Buffer, "le", 8)],
        programId
      )
      const [userBetPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("user_bet"),
          new anchor.BN(betId).toArrayLike(Buffer, "le", 8),
          provider.wallet.publicKey.toBuffer(),
        ],
        programId
      )

      const betSide = side === 'A' ? { a: {} } : { b: {} }

      return await program.methods
        .placeBet(
          new anchor.BN(betId),
          betSide,
          new anchor.BN(amount)
        )
        .accountsPartial({
          bet: betPda,
          betVault: betVaultPda,
          userBet: userBetPda,
          platform: platformPda,
          bettor: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      getAllBets.refetch()
      getPlatform.refetch()
    },
    onError: (error) => {
      console.error('Place bet error:', error)
      toast.error('Failed to place bet')
    },
  })

  // Resolve bet
  const resolveBet = useMutation({
    mutationKey: ['betting', 'resolve-bet', { cluster }],
    mutationFn: async ({ 
      betId, 
      winner 
    }: {
      betId: number
      winner: 'A' | 'B'
    }) => {
      const [betPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), new anchor.BN(betId).toArrayLike(Buffer, "le", 8)],
        programId
      )
      const [betVaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet_vault"), new anchor.BN(betId).toArrayLike(Buffer, "le", 8)],
        programId
      )

      const winnerSide = winner === 'A' ? { a: {} } : { b: {} }

      return await program.methods
        .resolveBet(
          new anchor.BN(betId),
          winnerSide
        )
        .accountsPartial({
          bet: betPda,
          betVault: betVaultPda,
          resolver: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      getAllBets.refetch()
    },
    onError: () => toast.error('Failed to resolve bet'),
  })

  // Claim winnings
  const claimWinnings = useMutation({
    mutationKey: ['betting', 'claim-winnings', { cluster }],
    mutationFn: async ({ betId }: { betId: number }) => {
      const [betPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), new anchor.BN(betId).toArrayLike(Buffer, "le", 8)],
        programId
      )
      const [betVaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet_vault"), new anchor.BN(betId).toArrayLike(Buffer, "le", 8)],
        programId
      )
      const [userBetPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("user_bet"),
          new anchor.BN(betId).toArrayLike(Buffer, "le", 8),
          provider.wallet.publicKey.toBuffer(),
        ],
        programId
      )

      return await program.methods
        .claimWinnings(new anchor.BN(betId))
        .accountsPartial({
          bet: betPda,
          betVault: betVaultPda,
          userBet: userBetPda,
          bettor: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      getAllBets.refetch()
    },
    onError: () => toast.error('Failed to claim winnings'),
  })

  // Claim refund
  const claimRefund = useMutation({
    mutationKey: ['betting', 'claim-refund', { cluster }],
    mutationFn: async ({ betId }: { betId: number }) => {
      const [betPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), new anchor.BN(betId).toArrayLike(Buffer, "le", 8)],
        programId
      )
      const [betVaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet_vault"), new anchor.BN(betId).toArrayLike(Buffer, "le", 8)],
        programId
      )
      const [userBetPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("user_bet"),
          new anchor.BN(betId).toArrayLike(Buffer, "le", 8),
          provider.wallet.publicKey.toBuffer(),
        ],
        programId
      )

      return await program.methods
        .claimRefund(new anchor.BN(betId))
        .accountsPartial({
          bet: betPda,
          betVault: betVaultPda,
          userBet: userBetPda,
          bettor: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      getAllBets.refetch()
    },
    onError: () => toast.error('Failed to claim refund'),
  })

  return {
    program,
    programId,
    platformPda,
    getPlatform,
    getAllBets,
    getBet,
    getUserBet,
    initializePlatform,
    createBet,
    placeBet,
    resolveBet,
    claimWinnings,
    claimRefund,
  }
}

// Helper function for the old interface
export function useBasicProgram() {
  return useBettingProgram()
}
