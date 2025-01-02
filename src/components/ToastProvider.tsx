import { App, ConfigProvider } from 'antd'
import React from 'react'

export default function ToastProvider({ children }: { children: React.ReactNode }) {
    return (
        <ConfigProvider
            theme={{
                token: {
                    borderRadius: 2,
                    colorText: 'white',
                },
                components: {
                    Notification: {
                        colorText: 'black',
                        colorTextHeading: 'black',
                    }
                }
            }}
        >
            <App>
                {children}
            </App>
        </ConfigProvider>
    )
}
