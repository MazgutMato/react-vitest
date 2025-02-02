import React from 'react'
import ReactQueryProvider from './ReactQueryProvider'
import { CartProvider } from './CartProvider'
import { LanguageProvider } from './language/LanguageProvider'
import { Theme } from '@radix-ui/themes'

export default function TestProviders({ children }: { children: React.ReactNode }) {
    return (
        <ReactQueryProvider>
            <CartProvider>
                <LanguageProvider language="en">
                    <Theme>{children}</Theme>
                </LanguageProvider>
            </CartProvider>
        </ReactQueryProvider>
    )
}
