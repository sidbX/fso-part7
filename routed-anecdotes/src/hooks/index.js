import { useState } from 'react'
//   <input
//     name="author"
//     value={author}
//     onChange={(e) => setAuthor(e.target.value)}
//   />
export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (e) => {
    setValue(e.target.value)
  }
  const reset = () => {
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    reset,
  }
}
