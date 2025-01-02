import { Input } from 'antd'
import React from 'react'

interface SearchProps {
    onChange?: (value: string) => void
}

export default function Search({ onChange }: SearchProps) {
    return (
        <div>
            <Input.Search placeholder="Search" onSearch={(value) => {
                if (value !== "") {
                    onChange?.(value)
                }
            }} />
        </div>
    )
}
