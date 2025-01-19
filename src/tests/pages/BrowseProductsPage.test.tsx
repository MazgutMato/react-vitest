import { Theme } from '@radix-ui/themes'
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Category, Product } from '../../entities'
import BrowseProducts from '../../pages/BrowseProductsPage'
import { CartProvider } from '../../providers/CartProvider'
import { db } from '../mocks/db'
import { simulateDelay, simulateError } from '../utils'

describe('BrowseProductPage', () => {
    const categories: Category[] = []
    const products: Product[] = []

    beforeAll(() => {
        [1, 2].forEach((item) => {
            const category = db.category.create({ name: "Category " + item });
            categories.push(category);

            [1, 2].forEach(() => {
                products.push(db.product.create({ categoryId: category.id }))
            });
        })
    })

    afterAll(() => {
        db.category.deleteMany({ where: { id: { in: categories.map(category => category.id) } } })
        db.product.deleteMany({ where: { id: { in: products.map(product => product.id) } } })
    })

    function renderComponent() {
        render(<Theme><CartProvider><BrowseProducts /></CartProvider></Theme>)

        return {
            categoriesProgress: () => screen.getByRole('progressbar', { name: /categories/i }),
            productsProgress: () => screen.getByRole('progressbar', { name: /products/i }),
            combobox: () => screen.queryByRole("combobox"),
        }
    }

    it('should show the loading skaleton before categories are fetched', () => {
        simulateDelay("/categories")

        const { categoriesProgress } = renderComponent()

        expect(categoriesProgress()).toBeInTheDocument()
    })

    it('should hide the loading skaleton after categories are fetched', async () => {
        const { productsProgress } = renderComponent()

        await waitForElementToBeRemoved(productsProgress)
    })

    it('should show the loading skaleton before products are fetched', () => {
        simulateDelay("/categories")

        const { categoriesProgress } = renderComponent()

        expect(categoriesProgress()).toBeInTheDocument()
    })

    it('should hide the loading skaleton after products are fetched', async () => {
        const { productsProgress } = renderComponent()

        await waitForElementToBeRemoved(productsProgress)
    })

    it('should not render error if categories not fetched', async () => {
        simulateError("categories")

        const { categoriesProgress, combobox } = renderComponent()

        await waitForElementToBeRemoved(categoriesProgress)

        expect(screen.queryByText(/error/i)).not.toBeInTheDocument()

        expect(combobox()).not.toBeInTheDocument()
    })

    it('should render error if products cannot be fetched', async () => {
        simulateError("/products")

        renderComponent()

        expect(await screen.findByText(/error/i)).toBeInTheDocument()
    })

    it('should render categories', async () => {
        const { categoriesProgress, combobox } = renderComponent()

        await waitForElementToBeRemoved(categoriesProgress)

        expect(combobox()).toBeInTheDocument()

        const user = userEvent.setup()
        await user.click(combobox()!)

        expect(screen.getByRole('option', { name: /all/i })).toBeInTheDocument()

        categories.forEach(category => {
            expect(screen.getByRole('option', { name: category.name })).toBeInTheDocument()
        })
    })

    it('should render products', async () => {
        const { productsProgress } = renderComponent()

        await waitForElementToBeRemoved(productsProgress)

        products.forEach(product => {
            expect(screen.getByText(product.name)).toBeInTheDocument()
        })
    })

    it('should filter products by category', async () => {
        const { categoriesProgress, combobox: getCategoriesCombobox } = renderComponent()

        await waitForElementToBeRemoved(categoriesProgress)
        const combobox = getCategoriesCombobox()
        const user = userEvent.setup()
        await user.click(combobox!)

        const selectedCategory = categories[0]
        const option = screen.getByRole('option', { name: selectedCategory.name })
        await user.click(option)

        const products = db.product.findMany({ where: { categoryId: { equals: selectedCategory.id } } })
        const rows = screen.getAllByRole('row')
        expect(rows).toHaveLength(products.length + 1)

        products.forEach(product => {
            expect(screen.getByText(product.name)).toBeInTheDocument()
        })
    })

    it('should view all pruducts when select all', async () => {
        const { categoriesProgress, combobox: getCategoriesCombobox } = renderComponent()

        await waitForElementToBeRemoved(categoriesProgress)
        const combobox = getCategoriesCombobox()
        const user = userEvent.setup()
        await user.click(combobox!)

        const option = screen.getByRole('option', { name: /all/i })
        await user.click(option)

        const products = db.product.getAll()
        const rows = screen.getAllByRole('row')
        expect(rows).toHaveLength(products.length + 1)

        products.forEach(product => {
            expect(screen.getByText(product.name)).toBeInTheDocument()
        })
    })
})