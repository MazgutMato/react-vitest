/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import ProductForm from '../../components/ProductForm'
import Providers from '../../providers'
import { Category, Product } from '../../entities'
import { db } from '../mocks/db'
import userEvent from '@testing-library/user-event'
import { Toaster } from 'react-hot-toast'

describe('ProductForm', () => {
    const categories: Array<Category> = []

    beforeAll(() => {
        categories.push(db.category.create())
    })

    afterAll(() => {
        categories.forEach((category) => {
            db.category.delete({ where: { id: { equals: category.id } } })
        })
    })

    function renderComponent(product?: Product) {
        const onSubmit = vi.fn()

        render(
            <>
                <ProductForm product={product} onSubmit={onSubmit} />
                <Toaster />
            </>, { wrapper: Providers })

        return {
            onSubmit: onSubmit,
            expectError: (message: RegExp) => {
                const error = screen.getByRole('alert')
                expect(error).toBeInTheDocument()
                expect(error).toHaveTextContent(message)
            },
            waitForFormToLoad: async () => {
                await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))

                const nameInput = screen.getByPlaceholderText(/name/i)
                const priceInput = screen.getByPlaceholderText(/price/i)
                const categoyInput = screen.getByRole('combobox', { name: /category/i })
                const submitButton = screen.getByRole('button')

                type FormData = {
                    [K in keyof Product]: any
                }

                const validData: FormData = {
                    id: 1,
                    name: "Name",
                    price: 10,
                    categoryId: categories[0].id,
                }

                return {
                    nameInput: nameInput,
                    priceInput: priceInput,
                    categoyInput: categoyInput,
                    submitButton: submitButton,
                    fill: async (product: FormData) => {
                        const user = userEvent.setup()

                        if (product.name !== undefined) {
                            await user.type(nameInput, product.name)
                        }

                        if (product.price !== undefined) {
                            await user.type(priceInput, product.price.toString())
                        }

                        await user.tab()
                        await user.click(categoyInput)
                        const options = screen.getAllByRole('option')
                        await user.click(options[0])
                        await user.click(submitButton)
                    },
                    validData: validData,
                }
            },
        }
    }

    it('should render form fileds', async () => {
        const { waitForFormToLoad } = renderComponent()

        const inputs = await waitForFormToLoad()

        expect(inputs.nameInput).toBeInTheDocument()

        expect(inputs.priceInput).toBeInTheDocument()

        expect(inputs.categoyInput).toBeInTheDocument()
    })

    it('should render fomr fileds with initial data', async () => {
        const product: Product = {
            id: 1,
            name: 'Product 1',
            price: 10,
            categoryId: categories[0].id,
        }

        const { waitForFormToLoad } = renderComponent(product)

        const inputs = await waitForFormToLoad()

        expect(inputs.nameInput).toHaveValue(product.name)

        expect(inputs.priceInput).toHaveValue(product.price.toString())

        expect(inputs.categoyInput).toHaveTextContent(categories[0].name)
    })

    it('should focus on the name input when the form is rendered', async () => {
        const { waitForFormToLoad } = renderComponent()

        const inputs = await waitForFormToLoad()

        expect(inputs.nameInput).toHaveFocus()
    })

    it.each([
        {
            scenario: 'missing',
            errorMessage: /required/i
        },
        {
            scenario: 'longer than 255',
            name: 'a'.repeat(256),
            errorMessage: /255/i
        },
    ])('should display an error if name is $scenario', async ({ name, errorMessage }) => {
        const { waitForFormToLoad, expectError } = renderComponent()

        const { fill, validData } = await waitForFormToLoad()

        validData.name = name
        await fill(validData)

        expectError(errorMessage)
    })

    it.each([
        {
            scenario: 'missing',
            errorMessage: /required/i
        },
        {
            scenario: '0',
            price: 0,
            errorMessage: /1/i
        },
        {
            scenario: 'negative',
            price: -1,
            errorMessage: /1/i
        },
        {
            scenario: 'greather then 1000',
            price: 1001,
            errorMessage: /1000/i
        },
        {
            scenario: 'not a number',
            price: 'a',
            errorMessage: /required/i
        },
    ])('should display an error if price is $scenario', async ({ price, errorMessage }) => {
        const { waitForFormToLoad, expectError } = renderComponent()

        const { fill, validData } = await waitForFormToLoad()

        validData.price = price
        await fill(validData)

        expectError(errorMessage)
    })

    it('should call onSubmit with the form data when the form is submitted', async () => {
        const { waitForFormToLoad, onSubmit } = renderComponent()

        const { fill, validData } = await waitForFormToLoad()
        await fill(validData)

        const { id, ...FormData } = validData
        expect(onSubmit).toHaveBeenCalledWith(FormData)
    })

    it('should show toast message if submit failed', async () => {
        const { waitForFormToLoad, onSubmit } = renderComponent()
        onSubmit.mockRejectedValue({})

        const { fill, validData } = await waitForFormToLoad()
        await fill(validData)

        const toast = await screen.findByRole('status')
        expect(toast).toBeInTheDocument()
        expect(toast).toHaveTextContent(/error/i)
    })

    it('should disable submit button upon submission', async () => {
        const { waitForFormToLoad, onSubmit } = renderComponent()
        onSubmit.mockReturnValue(new Promise(() => { }))

        const { fill, validData, submitButton } = await waitForFormToLoad()
        await fill(validData)

        expect(submitButton).toBeDisabled()
    })

    it('should re-enable submit button after succes submission', async () => {
        const { waitForFormToLoad, onSubmit } = renderComponent()
        onSubmit.mockResolvedValue({})

        const { fill, validData, submitButton } = await waitForFormToLoad()
        await fill(validData)

        expect(submitButton).not.toBeDisabled()
    })

    it('should re-enable submit button after faild submission', async () => {
        const { waitForFormToLoad, onSubmit } = renderComponent()
        onSubmit.mockRejectedValue('error')

        const { fill, validData, submitButton } = await waitForFormToLoad()
        await fill(validData)

        expect(submitButton).not.toBeDisabled()
    })
})