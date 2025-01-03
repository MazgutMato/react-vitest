import React from 'react'
import { Product } from './Products'
import { Spin } from 'antd'

interface ProductWithDetail extends Product {
    price: number
}

export default function ProductDetail({ id }: { id: number }) {
    const [product, setProduct] = React.useState<ProductWithDetail | null>(null)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string>("")

    React.useEffect(() => {
        if (!id) {
            setError("Invalid product id")
            return
        }

        setLoading(true)

        //fetch product by id
        fetch(`products/${id}`)
            .then(response => response.json())
            .then((data: ProductWithDetail) => {
                setProduct(data)
                setLoading(false)
            })
            .catch(error => {
                setError(error.message)
                setLoading(false)
            })
    }, [id])

    if (loading) {
        return <Spin />
    }

    if (error) {
        return <p>Error: {error}</p>
    }

    if (!product) {
        return <p>No product found</p>
    }

    return (
        <div>
            <h1>Name: {product.name}</h1>
            <p>Price: {`${product.price}$`}</p>
        </div>
    )
}
