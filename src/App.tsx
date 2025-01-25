import React from 'react'
import BrowseProducts from './pages/BrowseProductsPage'
import Providers from './providers'
import { Layout } from 'antd'
import ProductForm from './components/ProductForm'

export default function App() {
    return (
        <Providers>
            <Layout
                style={{
                    width: "100%",
                    padding: "20px",
                }}
            >
                <ProductForm onSubmit={async () => { console.log("Submit") }} />
            </Layout>
        </Providers>
    )
}
