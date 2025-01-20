import { Theme } from '@radix-ui/themes'
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Category, Product } from '../../entities'
import BrowseProducts from '../../pages/BrowseProductsPage'
import { CartProvider } from '../../providers/CartProvider'
import { db, getProductsByCategory } from '../mocks/db'
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
        const { openCombobox } = renderComponent()

        await openCombobox()

        categories.forEach(category => {
            expect(screen.getByRole('option', { name: category.name })).toBeInTheDocument()
        })
    })

    it('should render products', async () => {
        const { productsProgress, expectProductsToBeInDocument } = renderComponent()

        await waitForElementToBeRemoved(productsProgress)

        expectProductsToBeInDocument(products)
    })

    it('should filter products by category', async () => {
        const { selectCategory, expectProductsToBeInDocument } = renderComponent()

        const selectedCategory = categories[0]
        await selectCategory(new RegExp(selectedCategory.name))

        const products = getProductsByCategory(selectedCategory.id)
        expectProductsToBeInDocument(products)
    })

    it('should view all pruducts when select all', async () => {
        const { selectCategory, expectProductsToBeInDocument } = renderComponent()

        await selectCategory(/all/i)

        const products = db.product.getAll()
        expectProductsToBeInDocument(products)
    })

    function renderComponent() {
        render(<Theme><CartProvider><BrowseProducts /></CartProvider></Theme>)

        const getCategoriesProgress = () => screen.getByRole('progressbar', { name: /categories/i })
        const getCategoriesCombobox = () => screen.queryByRole("combobox")
        const openCombobox = async () => {
            await waitForElementToBeRemoved(getCategoriesProgress)
            const combobox = getCategoriesCombobox()
            const user = userEvent.setup()
            await user.click(combobox!)
        }

        const expectProductsToBeInDocument = (products: Product[]) => {
            const rows = screen.getAllByRole('row')
            expect(rows).toHaveLength(products.length + 1)

            products.forEach(product => {
                expect(screen.getByText(product.name)).toBeInTheDocument()
            })
        }


        return {
            expectProductsToBeInDocument,
            categoriesProgress: getCategoriesProgress,
            productsProgress: () => screen.getByRole('progressbar', { name: /products/i }),
            combobox: getCategoriesCombobox,
            openCombobox: openCombobox,
            selectCategory: async (category: RegExp = /all/i) => {
                await openCombobox()

                const user = userEvent.setup()

                const option = screen.getByRole('option', { name: category })
                await user.click(option)
            }
        }
    }
})