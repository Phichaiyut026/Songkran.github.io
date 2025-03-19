import type { Metadata } from 'next'
import './globals.css'
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: 'SongKran Featival',
  description: 'Created with v0',
  generator: 'v0.dev',
}
const dancingScript = Inter({
  subsets: ["latin"],
  variable: "--font-dancing-script",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={dancingScript.className}>{children}</body>
    </html>
  )
}
