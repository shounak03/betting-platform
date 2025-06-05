// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import BettingPlatformIDL from '../target/idl/betting_platform.json'
import type { BettingPlatform } from '../target/types/betting_platform'

// Re-export the generated IDL and type
export { BettingPlatform, BettingPlatformIDL }

// The programId is imported from the program IDL.
export const PROGRAM_ID = new PublicKey(BettingPlatformIDL.address)

// This is a helper function to get the Basic Anchor program.
export function getBettingProgram(provider: AnchorProvider, address?: PublicKey): Program<BettingPlatform> {
  return new Program({ ...BettingPlatformIDL, address: address ? address.toBase58() : BettingPlatformIDL.address } as BettingPlatform, provider)
}

// This is a helper function to get the program ID for the Basic program depending on the cluster.
export function getBettingProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Basic program on devnet and testnet.
      return new PublicKey('6z68wfurCMYkZG51s1Et9BJEd9nJGUusjHXNt4dGbNNF')
    case 'mainnet-beta':
    default:
      return PROGRAM_ID
      
  }
}
