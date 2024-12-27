import { it, expect, describe } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App', () => {
    it('should renders the App component', () => {
        render(<App />)

        screen.debug(); // prints out the jsx in the App component unto the command line
    })
})