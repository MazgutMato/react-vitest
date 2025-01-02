import { Flex } from 'antd'
import { useState } from 'react'
import './App.css'
import reactLogo from './assets/react.svg'
import Search from './components/Search'
import Taglist from './components/Taglist'
import viteLogo from '/vite.svg'

interface AppProps {
  name?: string
}

function App({ name = "World" }: AppProps) {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Hello {name}</h1>

      <Flex vertical gap={10}>
        {name !== "World" && <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>}
        <Search onChange={(value) => console.log(value)} />
      </Flex>

      <Taglist />

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
