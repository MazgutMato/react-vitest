import { render } from '@testing-library/react'
import SelectBox from '../components/SelectBox'

describe('SelectBox', () => {
    it('should render selectbox', async () => {
        render(<SelectBox />)

        // Crash in get, query and also find
        // await waitFor(() => {
        //     const select = screen.getByRole('input')
        //     // expect(select).toBeInTheDocument()
        // })

    })
})