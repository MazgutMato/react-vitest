import { render, screen } from '@testing-library/react'
import App from '../App'
import userEvent from '@testing-library/user-event'

describe('App', () => {
    const renderApp = (name?: string) => {
        render(<App name={name} />)

        const heading = screen.queryByRole('heading')

        const button = screen.queryByRole('button', { name: /count is/i })

        return { heading, button }
    }


    it('should render the App component without heading', () => {
        const { heading } = renderApp()

        expect(heading).toBeInTheDocument()
    })

    it('should render the App component with heading Hello World', () => {
        const { heading } = renderApp()

        expect(heading).toBeInTheDocument()
        expect(heading).toHaveTextContent(/Hello World/i)
    })

    it('should render the App component with button if name is defined', () => {
        const { button } = renderApp("Mato")

        expect(button).toBeInTheDocument()
    })

    it('should render the App component without button if name is not defined', () => {
        const { button } = renderApp()

        expect(button).not.toBeInTheDocument()
    })

    it('should increase count after click on button', async () => {
        const { button } = renderApp("Mato")

        expect(button).toBeInTheDocument()

        const user = userEvent.setup()

        if (button) {
            await user.click(button)

            expect(screen.queryByText("count is 0")).not.toBeInTheDocument()
            expect(screen.getByText("count is 1")).toBeInTheDocument()
        } else {
            expect(button).toBeInTheDocument()
        }
    })

    it('should fetch categories from mock server', async () => {
        const response = await fetch('categories')
        const data = await response.json()

        expect(data).toHaveLength(3)
    })
})