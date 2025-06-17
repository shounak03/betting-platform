import React from 'react'
import { Highlight } from './ui/hero-highlight'

export function AppHero({
  children,
  subtitle,
  title,
}: {
  children?: React.ReactNode
  subtitle?: React.ReactNode
  title?: React.ReactNode
}) {
  return (
    <div className="flex flex-row justify-center py-[16px] md:py-[64px]">
      <div className="text-center">
        <div className="max-w-2xl">
        <h1 className="md:text-4xl lg:text-6xl font-bold mb-6">
              Wager
              <Highlight>
                <span className="text-white">
                Verse
                </span>
              </Highlight>
              
            </h1>
          {typeof subtitle === 'string' ? <p className="pt-4 md:py-6">{subtitle}</p> : subtitle}
          {children}
        </div>
      </div>
    </div>
  )
}
