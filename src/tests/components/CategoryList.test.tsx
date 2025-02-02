import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { Category } from '../../entities'
import { db } from '../mocks/db'
import ReactQueryProvider from '../../providers/ReactQueryProvider'
import CategoryList from '../../components/CategoryList'
import { simulateDelay, simulateError } from '../utils'

describe('CategoryList', () => {
    const categories: Category[] = []

    beforeAll(() => {
        [1, 2].forEach(() => {
            const category = db.category.create()

            categories.push(category)
        })
    })

    afterAll(() => {
        categories.forEach((category) => {
            db.category.delete({ where: { id: { equals: category.id } } })
        })
    })

    function renderComponent() {
        render(
            <ReactQueryProvider>
                <CategoryList></CategoryList>
            </ReactQueryProvider>
        )
    }

    it('should render list of categories', async () => {
        renderComponent()

        await waitForElementToBeRemoved(screen.getByText(/loading/i))

        categories.forEach((category) => {
            expect(screen.getByText(category.name)).toBeInTheDocument()
        })
    })

    it('should render loading message ', () => {
        simulateDelay('/categories')

        renderComponent()

        expect(screen.getByText(/loading/i))
    })

    it('should render error if fetching failed', async () => {
        simulateError("/categories");

        renderComponent()

        expect(await screen.findByText(/error/i))
    })



})