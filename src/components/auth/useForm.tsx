import { useState } from 'react'
import Validate from './validate'

type FormValues = {
  email: string
  password: string
}

type Errors = Partial<FormValues>

const useForm = () => {
  const [value, setValue] = useState<FormValues>({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState<Errors>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: inputValue } = e.target
    setValue((prevValue) => ({
      ...prevValue,
      [name]: inputValue,
    }))
  }

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    onSuccess?: () => void
  ) => {
    e.preventDefault()

    const validationErrors = Validate(value)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      console.log('Form submitted successfully:', value)

      // Call success callback
      if (onSuccess) onSuccess()
    }
  }

  return {
    value,
    handleChange,
    handleSubmit,
    errors,
  }
}

export default useForm
