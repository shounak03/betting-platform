'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { ExplorerLink } from '../cluster/cluster-ui'
import { WalletButton } from '../solana/solana-provider'
import { useBettingProgram } from './betting-data-access'
import { BettingProgram } from './betting-ui'
import { AppHero } from '../app-hero'
import { ellipsify } from '@/lib/utils'
import { DashboardFeature } from '../dashboard/dashboard-feature'

export default function   BettingFeature() {
  const { publicKey } = useWallet()
  const { programId } = useBettingProgram()

  return publicKey ? (
    <div>
      <AppHero 
        title="WagerVerse" 
        subtitle="Create bets, place wagers, and win rewards in a decentralized betting platform."
      >
        <p className="mb-6">
          <ExplorerLink path={`account/${programId}`} label={ellipsify(programId.toString())} />
        </p>
      </AppHero>
      <BettingProgram />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <DashboardFeature />
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Betting Platform</h1>
            <p className="py-6">
              Connect your wallet to start creating bets, placing wagers, and participating in decentralized betting.
            </p>
            <WalletButton className="btn btn-primary" />
          </div>
        </div>
      </div>
    </div>
  )
}
