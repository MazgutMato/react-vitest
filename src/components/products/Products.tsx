/* eslint-disable @typescript-eslint/no-explicit-any */
import { Spin } from 'antd'
import React from 'react'

export interface Product {
    id: number
    name: string
}

export default function Products() {
    const [products, setProducts] = React.useState<Array<Product>>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string>("")

    async function fetchProducts() {
        setLoading(true)

        try {
            const response = await fetch('products')
            const data = await response.json()

            setProducts(data)
        } catch (error: any) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        fetchProducts()
    }, [])

    if (loading) {
        return <Spin />
    }

    if (error !== "") {
        return <p>Error: {error}</p>
    }

    if (!products.length) {
        return <p>No products found</p>
    }

    return (
        <ul>
            {products.map(product => (
                <li key={product.id}>{product.name}</li>
            ))}
        </ul>
    )
}
