import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { delay, http, HttpResponse } from 'msw'
import Products from '../components/products/Products'
import { db } from './mocks/db'
import { server } from './mocks/server'
import { QueryClient, QueryClientProvider } from 'react-query'

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

    const renderComponent = () => {
        const client = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        })

        render(
            <QueryClientProvider client={client}>
                <Products />
            </QueryClientProvider>
        )
    }

    it('should render list of products', async () => {
        renderComponent()

        const items = await screen.findAllByRole('listitem')

        expect(items.length).toBeGreaterThan(0)
    })

    it('should render no products found', async () => {
        server.use(
            http.get('products', () => {
                return HttpResponse.json([])
            })
        )

        renderComponent()

        const message = await screen.findByText(/no products found/i)
        expect(message).toBeInTheDocument()
    })

    it('should an error message when there is error', async () => {
        server.use(
            http.get("products", () => {
                return HttpResponse.error()
            })
        )

        renderComponent()

        expect(await screen.findByText(/error/i)).toBeInTheDocument()
    })

    it('should render loading indicator when loading data', async () => {
        server.use(
            http.get("products", async () => {
                await delay();

                return HttpResponse.json([])
            })
        )

        renderComponent()

        expect(await screen.findByText(/loading/i)).toBeInTheDocument()
    })

    it('should remove loading indicator after data is fetched', async () => {
        renderComponent()

        await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))
    })

    it('should remove loading indicator if data fetchinf failed', async () => {
        server.use(
            http.get("products", () => {
                return HttpResponse.error()
            })
        )

        renderComponent()

        await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))
    })
})