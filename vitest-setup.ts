import '@testing-library/jest-dom/vitest'
import { server } from './src/tests/mocks/server'
import { afterAll, afterEach, beforeAll } from 'vitest'

//Mocks setup
beforeAll(() => {
    server.listen()
})
afterEach(() => {
    server.resetHandlers()
})
afterAll(() => {
    server.close()
})