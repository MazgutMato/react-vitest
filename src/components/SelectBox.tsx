import { Select } from 'antd'
import React from 'react'

export default function SelectBox() {
  return (
    <Select
      options={[
        {
          label: 'Option 1',
          value: 'option1'
        },
        {
          label: 'Option 2',
          value: 'option2'
        },
        {
          label: 'Option 3',
          value: 'option3'
        }
      ]} />
  )
}
