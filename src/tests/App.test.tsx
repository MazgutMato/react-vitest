import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App', () => {
    it('should render the App component with heading', () => {
        render(<App />)

        const heading = screen.getByRole('heading')

        expect(heading).toBeInTheDocument()
        expect(heading).toHaveTextContent(/Hello World/i)
    })

    it('should render the App component with heading Hello World', () => {
        render(<App />)

        const heading = screen.getByText("Hello World")

        expect(heading).toBeInTheDocument()
    })

    it('should render the App component with button if name is defined', () => {
        render(<App name='Mato' />)

        const button = screen.getByRole("button")

        expect(button).toBeInTheDocument()
    })

    it('should render the App component without button if name is not defined', () => {
        render(<App />)

        const button = screen.queryByRole("button")

        expect(button).not.toBeInTheDocument()
    })
})