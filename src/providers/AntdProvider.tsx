import { ConfigProvider } from 'antd'
import React from 'react'

export default function AntdProvider({ children }: { children: React.ReactNode }) {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorText: '#000',
                }
            }}
        >
            {children}
        </ConfigProvider>
    )
}
