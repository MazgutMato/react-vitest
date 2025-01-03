import { render, screen } from '@testing-library/react'
import Products from '../components/products/Products'
import { server } from './mocks/server'
import { http, HttpResponse } from 'msw'

describe('Products', () => {
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
})