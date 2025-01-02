import { render, screen } from '@testing-library/react'
import Search from '../components/Search'
import userEvent from '@testing-library/user-event'

describe('Search', () => {
    const renderSearchBox = () => {
        const onChange = vi.fn()
        render(<Search onChange={onChange} />)

        const input = screen.getByPlaceholderText(/search/i)

        return { input, onChange, user: userEvent.setup() }
    }

    it('should render an input field for searching', () => {
        const { input } = renderSearchBox()

        expect(input).toBeInTheDocument()
    })

    it('should call onChange when Enter is pressed', async () => {
        const { input, onChange, user } = renderSearchBox()

        const searchTerm = "SearchTerm"
        await user.type(input, searchTerm + '{enter}')

        expect(onChange).toHaveBeenCalledWith(searchTerm)
    })

    it('should not call onChange if input field is empty', async () => {
        const { input, onChange, user } = renderSearchBox()

        await user.type(input, '{enter}')

        expect(onChange).not.toHaveBeenCalledWith()
    })
})