import { render, screen } from '@testing-library/react'
import { delay, http, HttpResponse } from 'msw'
import ProductDetail from '../components/products/ProductDetail'
import { db } from './mocks/db'
import { server } from './mocks/server'

describe('ProductDetails', () => {
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

    it('should render product details', async () => {
        const id = productIds[0]

        render(<ProductDetail id={id} />)

        const product = db.product.findFirst({ where: { id: { equals: id } } })

        expect(await screen.findByText(new RegExp(product?.name as string))).toBeInTheDocument()
        expect(await screen.findByText(new RegExp(product?.price.toString() as string))).toBeInTheDocument()
    })

    it('should render message if product not found', async () => {
        server.use(
            http.get('products/1', () => {
                return HttpResponse.json(null)
            }
            )
        )

        render(<ProductDetail id={1} />)

        const message = await screen.findByText(/No product found/)

        expect(message).toBeInTheDocument()
    })

    it('should render error for invalid product id ', async () => {
        render(<ProductDetail id={0} />)

        const message = await screen.findByText(/invalid/i)

        expect(message).toBeInTheDocument()
    })

    it('should render an error if there is error message', async () => {
        server.use(
            http.get("products/1", () => {
                return HttpResponse.error()
            })
        )

        render(<ProductDetail id={1} />)

        expect(await screen.findByText(/error/i)).toBeInTheDocument()
    })    
})