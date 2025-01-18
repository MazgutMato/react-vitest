import React from 'react'
import { Product } from './Products'
import { Spin } from 'antd'
import { useQuery } from 'react-query'
import axios from 'axios'

interface ProductWithDetail extends Product {
    price: number
}

export default function ProductDetail({ id }: { id: number }) {
    const { data: product, isLoading: loading, error } = useQuery<ProductWithDetail, Error>({
        queryKey: ["products", id],
        queryFn: () => axios.get<ProductWithDetail>(`/products/${id}`).then((response) => response.data),
    })


    if (!id) {
        return <p>Invalid product if</p>
    }

    if (error) {
        return <p>Error: {error.message}</p>
    }

    if (loading) {
        return <Spin />
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
