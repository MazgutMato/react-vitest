import { App as AntdApp, Button, ConfigProvider, Flex } from 'antd'
import { useState } from 'react'
import './App.css'
import reactLogo from './assets/react.svg'
import Search from './components/Search'
import Taglist from './components/Taglist'
import viteLogo from '/vite.svg'
import Toast from './components/Toast'
import ToastProvider from './components/ToastProvider'
import SelectBox from './components/SelectBox'

interface AppProps {
  name?: string
}

function App({ name = "World" }: AppProps) {
  const [count, setCount] = useState(0)

  return (
    <ConfigProvider
      theme={{
        token: {
          colorText: '#000',
        }
      }}
    >
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
        {name !== "World" && <Button type='primary' onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>}
        <Search onChange={(value) => console.log(value)} />


        <Taglist />

        <ToastProvider>
          <Toast />
        </ToastProvider>

        {/* <SelectBox /> */}

      </Flex>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </ConfigProvider>
  )
}

export default App
