import { render, screen } from '@testing-library/react'
import Taglist from '../components/Taglist'

describe('Taglist', () => {
    it('should render a list of tags', async () => {
        render(<Taglist />)

        // await waitFor(() => {
        //     const tags = screen.getAllByRole('listitem')
        //     expect(tags.length).toBeGreaterThan(0)
        // })        

        const tags = await screen.findAllByRole('listitem')
        expect(tags.length).toBeGreaterThan(0)
    })
})