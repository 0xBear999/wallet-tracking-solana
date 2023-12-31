'use client'
import './globals.css'
import { Inter } from 'next/font/google'
import { ChakraProvider, extendBaseTheme } from '@chakra-ui/react'
import chakraTheme from '@chakra-ui/theme'
import { CacheProvider } from '@chakra-ui/next-js'

const { Button, Input } = chakraTheme.components

const theme = extendBaseTheme({
  components: {
    Button,
    Input
  },
})

const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <CacheProvider>
          <ChakraProvider >
            {children}
          </ChakraProvider>
        </CacheProvider>
      </body>
    </html>
  )
}
