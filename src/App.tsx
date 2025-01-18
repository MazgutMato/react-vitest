import React from 'react'
import BrowseProducts from './pages/BrowseProductsPage'
import Providers from './providers'

export default function App() {
    return (
        <Providers>
            <BrowseProducts />
        </Providers>
    )
}
