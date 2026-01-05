import { useState } from 'react'
import ValidateSignup from './validateSignup';

type FormValues = {
  
 name: string,
  email: string
  password: string
  team: string | number | undefined;
}

type Errors = Partial<FormValues>

const useFormSignup = () => {
  const [value, setValue] = useState<FormValues>({
    name: '',
    email: '',
    password: '',
    team: '',
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

    const validationErrors = ValidateSignup(value)
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

export default useFormSignup
