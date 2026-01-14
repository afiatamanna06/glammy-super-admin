import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Glammy Admin Console",
    template: "%s | Glammy Admin",
  },
  description: "Command center for managing Glammy's AI travel experiences.",
  keywords: ["Glammy", "admin", "travel", "AI platform", "dashboard"],
  authors: [{ name: "Glammy" }],
  creator: "Glammy",
  metadataBase: new URL("https://glammy.travel"),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        <div className="relative min-h-screen">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute top-1/2 right-[-20%] h-[28rem] w-[28rem] -translate-y-1/2 rounded-full bg-accent/10 blur-[140px]" />
          </div>
          <div className="relative z-10 flex min-h-screen flex-col">
            {children}
            <Analytics />
          </div>
        </div>
      </body>
    </html>
  )
}
