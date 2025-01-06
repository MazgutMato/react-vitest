import { render, screen } from '@testing-library/react'
import Products from '../components/products/Products'
import { server } from './mocks/server'
import { http, HttpResponse } from 'msw'
import { db } from './mocks/db'
import ProductDetail from '../components/products/ProductDetail'

describe('Products', () => {
    const productIds: Array<number> = []

    beforeAll(() => {
        for (let i = 0; i < 3; i++) {
            const product = db.product.create()
            productIds.push(product.id)
        }
    })

    afterAll(() => {
        db.product.deleteMany({ where: { id: { in: productIds } } })
    })

    it('should render list of products', async () => {
        render(<Products />)

        const items = await screen.findAllByRole('listitem')

        expect(items.length).toBeGreaterThan(0)
    })

    it('should render no products found', async () => {
        server.use(
            http.get('products', () => {
                return HttpResponse.json([])
            })
        )

        render(<Products />)

        const message = await screen.findByText(/no products found/i)
        expect(message).toBeInTheDocument()
    })

    it('should an error message when there is error', async () => {
        server.use(
            http.get("products", () => {
                return HttpResponse.error()
            })
        )

        render(<Products />)

        expect(await screen.findByText(/error/i)).toBeInTheDocument()
    })
})