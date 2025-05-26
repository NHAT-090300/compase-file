"use client"

import { useAccount, useBalance, useEnsName } from "wagmi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Coins, Network } from "lucide-react"

export function WalletInfo() {
  const { address, isConnected, chain } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const { data: balance } = useBalance({ address })

  if (!isConnected || !address) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Information
          </CardTitle>
          <CardDescription>Connect your wallet to view information</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No wallet connected</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet Information
        </CardTitle>
        <CardDescription>Your connected wallet details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Address:</span>
            <code className="text-xs bg-muted px-2 py-1 rounded">
              {address.slice(0, 6)}...{address.slice(-4)}
            </code>
          </div>

          {ensName && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">ENS Name:</span>
              <Badge variant="secondary">{ensName}</Badge>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-1">
              <Network className="h-4 w-4" />
              Network:
            </span>
            <Badge variant="outline">{chain?.name}</Badge>
          </div>

          {balance && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-1">
                <Coins className="h-4 w-4" />
                Balance:
              </span>
              <span className="text-sm font-mono">
                {Number.parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
