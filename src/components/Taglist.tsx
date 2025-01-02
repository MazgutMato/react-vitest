import { Spin } from 'antd'
import React from 'react'

export default function Taglist() {
    const [tags, setTags] = React.useState<string[]>([])

    async function fetchTags() {
        setTimeout(() => {
            setTags(["tag1", "tag2", "tag3"])
        }, 500)
    }

    React.useEffect(() => {
        setTags([])

        fetchTags()
    }, [])

    if (tags.length === 0) {
        return <Spin />
    }

    return (
        <ul>
            {tags.map((tag) => (
                <li key={tag}>{tag}</li>
            ))}
        </ul>
    )
}
