import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { PublicShell } from '@/components/public-shell'

export const metadata: Metadata = {
  title: 'Flex Living App',
  description: 'Created by kelue',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <PublicShell>
          {children}
        </PublicShell>
      </body>
    </html>
  )
}
