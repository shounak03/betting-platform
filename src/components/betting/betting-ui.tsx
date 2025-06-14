'use client'

import { useBettingProgram } from './betting-data-access'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useState } from 'react'
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Clock, Users, TrendingUp, Trophy, RefreshCw } from 'lucide-react'

// Initialize Platform Component
export function InitializePlatform() {
  const { initializePlatform, getPlatform } = useBettingProgram()
  const { publicKey } = useWallet()
  const [authority, setAuthority] = useState('')

  const handleInitialize = async () => {
    if (!authority.trim()) {
      toast.error('Please enter a platform authority public key')
      return
    }

    try {
      const authorityPubkey = new PublicKey(authority)
      await initializePlatform.mutateAsync({ platformAuthority: authorityPubkey })
    } catch (error) {
      console.error('Error initializing platform:', error)
      toast.error('Invalid public key format')
    }
  }

  if (getPlatform.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Platform Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{getPlatform.data.totalBets.toString()}</div>
              <div className="text-sm text-muted-foreground">Total Bets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {(Number(getPlatform.data.totalVolume) / LAMPORTS_PER_SOL).toFixed(2)} SOL
              </div>
              <div className="text-sm text-muted-foreground">Total Volume</div>
            </div>
            <div className="text-center">
              <Badge variant="default" className="bg-green-100 text-green-800">
                Active
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Initialize Platform</CardTitle>
        <CardDescription>
          Initialize the betting platform with a platform authority
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="authority">Platform Authority Public Key</Label>
          <Input
            id="authority"
            value={authority}
            onChange={(e) => setAuthority(e.target.value)}
            placeholder={publicKey?.toString() || 'Enter public key...'}
          />
        </div>
        <Button 
          onClick={handleInitialize} 
          disabled={initializePlatform.isPending}
          className="w-full"
        >
          {initializePlatform.isPending ? 'Initializing...' : 'Initialize Platform'}
        </Button>
      </CardContent>
    </Card>
  )
}

//get the user public key from the wallet and use it as the creatorId in the createBet API call



// Create Bet Component
export function CreateBetForm() {
  const { createBet } = useBettingProgram()
  const { publicKey } = useWallet()
  const [formData, setFormData] = useState({
    betId: '',
    title: '',
    description: '',
    resolver: '',
    endTime: '',
    bettingAmount: '',
  })
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet first')
      return
    }

    try {
      const endTimeTimestamp = Math.floor(new Date(formData.endTime).getTime() / 1000)
      const bettingAmountLamports = parseFloat(formData.bettingAmount) * LAMPORTS_PER_SOL

      const betId = await fetch('/api/betting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creatorId: publicKey.toString(),
          title: formData.title,
          description: formData.description,
          resolverId: formData.resolver,
          endTime: endTimeTimestamp,
          amount: bettingAmountLamports,
        })
      })

      if (!betId.ok) {
        throw new Error('Failed to create bet in database')
      }

      const response = await betId.json()
      console.log('Bet created with ID:', response.betId);
      
      const receivedBetId = response.betId

      // await createBet.mutateAsync({
      //   betId: receivedBetId,
      //   title: formData.title,
      //   description: formData.description,
      //   resolver: new PublicKey(formData.resolver),
      //   endTime: endTimeTimestamp,
      //   bettingAmount: bettingAmountLamports,
      // })

      setFormData({
        betId: '',
        title: '',
        description: '',
        resolver: '',
        endTime: '',
        bettingAmount: '',
      })
      setIsOpen(false)
      toast.success('Bet created successfully!')
    } catch (error) {
      console.error('Error creating bet:', error)
      toast.error('Failed to create bet')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto">
          Create New Bet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Bet</DialogTitle>
          <DialogDescription>
            Create a new betting event for users to participate in.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bet-id" className="text-right">
              Bet ID
            </Label>
            <Input
              id="bet-id"
              type="number"
              value={formData.betId}
              onChange={(e) => setFormData(prev => ({ ...prev, betId: e.target.value }))}
              className="col-span-3"
              placeholder="Unique bet ID"
            />
          </div> */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="col-span-3"
              placeholder="Bet title (max 100 chars)"
              maxLength={100}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="col-span-3"
              placeholder="Bet description (max 200 chars)"
              maxLength={200}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="resolver" className="text-right">
              Resolver
            </Label>
            <Input
              id="resolver"
              value={formData.resolver}
              onChange={(e) => setFormData(prev => ({ ...prev, resolver: e.target.value }))}
              className="col-span-3"
              placeholder="Resolver public key"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="end-time" className="text-right">
              End Time
            </Label>
            <Input
              id="end-time"
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="betting-amount" className="text-right">
              Bet Amount (SOL)
            </Label>
            <Input
              id="betting-amount"
              type="number"
              step="0.1"
              value={formData.bettingAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, bettingAmount: e.target.value }))}
              className="col-span-3"
              placeholder="Amount in SOL"
            />
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={createBet.isPending} className="w-full">
          {createBet.isPending ? 'Creating...' : 'Create Bet'}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

// Bet Card Component
export function BetCard({ bet, betData }: { bet: any, betData: any }) {
  const { placeBet, resolveBet, claimWinnings, claimRefund, getUserBet } = useBettingProgram()
  const { publicKey } = useWallet()
  const [selectedSide, setSelectedSide] = useState<'A' | 'B'>('A')

  const userBet = getUserBet(betData.id.toNumber(), publicKey)
  const isExpired = Date.now() / 1000 > betData.endTime.toNumber()
  const isResolutionExpired = Date.now() / 1000 > betData.resolutionDeadline.toNumber()
  const isActive = betData.status.active !== undefined
  const isResolved = betData.status.resolved !== undefined
  const canResolve = isExpired && !isResolved && !isResolutionExpired && publicKey?.equals(betData.resolver)
  const canClaim = isResolved && userBet.data && !userBet.data.claimed
  const canRefund = isResolutionExpired && userBet.data && !userBet.data.claimed
  const totalPool = Number(betData.totalAmount) / LAMPORTS_PER_SOL

  const getWinnerText = () => {
    if (betData.winner?.a) return 'Side A'
    if (betData.winner?.b) return 'Side B'
    return 'Not resolved'
  }

  const getUserWinnings = () => {
    if (!userBet.data || !isResolved) return 0
    
    const userSide = userBet.data.side.a ? 'A' : 'B'
    const winnerSide = betData.winner?.a ? 'A' : 'B'
    
    if (userSide !== winnerSide) return 0
    
    const userAmount = Number(userBet.data.amount)
    const winningSideAmount = userSide === 'A' ? Number(betData.sideAAmount) : Number(betData.sideBAmount)
    const totalAmount = Number(betData.totalAmount)
    
    // Calculate winnings: user gets their share of the total pool minus platform fees
    const platformFee = totalAmount * 0.1 // 10% platform fee
    const resolverFee = totalAmount * 0.01 // 1% resolver fee
    const netPool = totalAmount - platformFee - resolverFee
    
    return (userAmount / winningSideAmount) * netPool
  }

  const handlePlaceBet = async () => {
    try {
      await placeBet.mutateAsync({
        betId: betData.id.toNumber(),
        side: selectedSide,
        amount: Number(betData.bettingAmount),
      })
      toast.success('Bet placed successfully!')
    } catch (error) {
      console.error('Error placing bet:', error)
    }
  }

  const handleResolve = async (winner: 'A' | 'B') => {
    try {
      await resolveBet.mutateAsync({
        betId: betData.id.toNumber(),
        winner,
      })
      toast.success('Bet resolved successfully!')
    } catch (error) {
      console.error('Error resolving bet:', error)
    }
  }

  const handleClaimWinnings = async () => {
    try {
      await claimWinnings.mutateAsync({ betId: betData.id.toNumber() })
      toast.success('Winnings claimed successfully!')
    } catch (error) {
      console.error('Error claiming winnings:', error)
    }
  }

  const handleClaimRefund = async () => {
    try {
      await claimRefund.mutateAsync({ betId: betData.id.toNumber() })
      toast.success('Refund claimed successfully!')
    } catch (error) {
      console.error('Error claiming refund:', error)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{betData.title}</CardTitle>
            <CardDescription className="mt-1">{betData.description}</CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={isActive ? 'default' : isResolved ? 'secondary' : 'destructive'}>
              {isActive ? 'Active' : isResolved ? 'Resolved' : 'Expired'}
            </Badge>
            <div className="text-right text-sm text-muted-foreground">
              ID: {betData.id.toString()}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Bet Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-4 w-4 mr-1" />
            </div>
            <div className="font-semibold">{betData.participants.toString()}</div>
            <div className="text-xs text-muted-foreground">Participants</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 mr-1" />
            </div>
            <div className="font-semibold">{totalPool.toFixed(2)} SOL</div>
            <div className="text-xs text-muted-foreground">Total Pool</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="h-4 w-4 mr-1" />
            </div>
            <div className="font-semibold">{(Number(betData.bettingAmount) / LAMPORTS_PER_SOL).toFixed(2)} SOL</div>
            <div className="text-xs text-muted-foreground">Bet Amount</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <CalendarDays className="h-4 w-4 mr-1" />
            </div>
            <div className="font-semibold">
              {new Date(betData.endTime.toNumber() * 1000).toLocaleDateString()}
            </div>
            <div className="text-xs text-muted-foreground">End Date</div>
          </div>
        </div>

        {/* Side Distribution */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Side A: {(Number(betData.sideAAmount) / LAMPORTS_PER_SOL).toFixed(2)} SOL</span>
            <span>Side B: {(Number(betData.sideBAmount) / LAMPORTS_PER_SOL).toFixed(2)} SOL</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-l-full" 
              style={{ 
                width: totalPool > 0 ? `${(Number(betData.sideAAmount) / Number(betData.totalAmount)) * 100}%` : '50%' 
              }}
            ></div>
          </div>
        </div>

        {isResolved && (
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-sm font-medium text-green-800">
              Winner: {getWinnerText()}
            </div>
          </div>
        )}

        {/* User's Bet Info */}
        {userBet.data && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-sm">
              <div>Your bet: {(Number(userBet.data.amount) / LAMPORTS_PER_SOL).toFixed(2)} SOL on Side {userBet.data.side.a ? 'A' : 'B'}</div>
              {isResolved && (
                <div className="text-green-600 font-medium">
                  Potential winnings: {(getUserWinnings() / LAMPORTS_PER_SOL).toFixed(2)} SOL
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {/* Place Bet */}
          {isActive && !isExpired && !userBet.data && publicKey && !publicKey.equals(betData.resolver) && (
            <div className="flex gap-2 w-full">
              <select 
                value={selectedSide} 
                onChange={(e) => setSelectedSide(e.target.value as 'A' | 'B')}
                className="px-3 py-2 border rounded-md"
              >
                <option value="A">Side A</option>
                <option value="B">Side B</option>
              </select>
              <Button 
                onClick={handlePlaceBet} 
                disabled={placeBet.isPending}
                className="flex-1"
              >
                {placeBet.isPending ? 'Placing...' : `Bet ${(Number(betData.bettingAmount) / LAMPORTS_PER_SOL).toFixed(2)} SOL`}
              </Button>
            </div>
          )}

          {/* Resolve Bet */}
          {canResolve && (
            <div className="flex gap-2 w-full">
              <Button 
                onClick={() => handleResolve('A')} 
                disabled={resolveBet.isPending}
                variant="outline"
                className="flex-1"
              >
                Resolve: Side A Wins
              </Button>
              <Button 
                onClick={() => handleResolve('B')} 
                disabled={resolveBet.isPending}
                variant="outline"
                className="flex-1"
              >
                Resolve: Side B Wins
              </Button>
            </div>
          )}

          {/* Claim Winnings */}
          {canClaim && getUserWinnings() > 0 && (
            <Button 
              onClick={handleClaimWinnings} 
              disabled={claimWinnings.isPending}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {claimWinnings.isPending ? 'Claiming...' : `Claim Winnings (${(getUserWinnings() / LAMPORTS_PER_SOL).toFixed(2)} SOL)`}
            </Button>
          )}

          {/* Claim Refund */}
          {canRefund && (
            <Button 
              onClick={handleClaimRefund} 
              disabled={claimRefund.isPending}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              {claimRefund.isPending ? 'Claiming...' : 'Claim Refund'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// All Bets List Component
export function BetsList() {
  const { getAllBets } = useBettingProgram()

  if (getAllBets.isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <RefreshCw className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (!getAllBets.data || getAllBets.data.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-muted-foreground">No bets found. Create the first bet!</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6">
      {getAllBets.data.map((bet) => (
        <BetCard key={bet.account.id.toString()} bet={bet} betData={bet.account} />
      ))}
    </div>
  )
}

// Main Betting Component
export function BettingProgram() {
  const { getPlatform } = useBettingProgram()

  return (
    <div className="space-y-6">
      <InitializePlatform />
      
      {getPlatform.data && (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Betting Platform</h2>
            <CreateBetForm />
          </div>
          <BetsList />
        </>
      )}
    </div>
  )
}
