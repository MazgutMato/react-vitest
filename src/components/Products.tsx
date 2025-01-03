import { Spin } from 'antd'
import React from 'react'

interface Product {
    id: number
    name: string
}

export default function Products() {
    const [products, setProducts] = React.useState<Array<Product>>([])
    const [loading, setLoading] = React.useState(true)

    async function fetchProducts() {
        setLoading(true)

        const response = await fetch('products')
        const data = await response.json()

        setProducts(data)
        setLoading(false)
    }

    React.useEffect(() => {
        fetchProducts()
    }, [])

    if (loading) {
        return <Spin />
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
