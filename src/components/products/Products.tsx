import { Spin } from 'antd'
import axios from 'axios'
import { useQuery } from 'react-query'

export interface Product {
    id: number
    name: string
}

export default function Products() {
    const { data, error, isLoading } = useQuery<Product[], Error>({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await axios.get<Product[]>('/products')

            return response.data
        }
    })
    


    if (isLoading) {
        return <Spin>Loading</Spin>
    }

    if (error) {
        return <p>Error: {error.message}</p>
    }

    if (data && !data.length) {
        return <p>No products found</p>
    }

    return (
        <ul>
            {data && data.map(product => (
                <li key={product.id}>{product.name}</li>
            ))}
        </ul>
    )
}
