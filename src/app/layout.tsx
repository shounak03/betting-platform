import type { Metadata } from 'next'
import './globals.css'
import { AppProviders } from '@/components/app-providers'
import React from 'react'


export const metadata: Metadata = {
  title: 'Betting Platform',
  description: 'Decentralized betting platform built on Solana',
}

const links: { label: string; path: string }[] = [
  // More links...
  { label: 'Home', path: '/' },
  { label: 'Account', path: '/account' },
  { label: 'Betting', path: '/betting' },
  { label: 'Basic Program', path: '/basic' },
]

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased mx-20 bg-black` }>
        <AppProviders>
          {/* <AppLayout links={links}>{children}</AppLayout>
          {} */}
          {children}
        </AppProviders>

      </body>
    </html>
  )
}
// Patch BigInt so we can log it using JSON.stringify without any errors
declare global {
  interface BigInt {
    toJSON(): string
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString()
}
