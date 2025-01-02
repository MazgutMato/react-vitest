import { render, screen } from '@testing-library/react'
import Toast from '../components/Toast'
import userEvent from '@testing-library/user-event'

describe('Toast', () => {
    it('should render toast after click on button', async () => {
        render(<Toast />)

        const button = screen.getByRole('button')

        const user = userEvent.setup()
        await user.click(button)

        const toast = await screen.findByText(/Notification/i)
        expect(toast).toBeInTheDocument()
    })
})