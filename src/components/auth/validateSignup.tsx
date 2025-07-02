const ValidateSignup = (value: {firstName:string,lastName:string, email: string; password: string }) => {

 
  const errors: { email?: string; password?: string; firstName?:string;lastName?:string } = {}

  if (!value.firstName.trim()) {
    errors.firstName = 'First name is required'
  }

  if (!value.lastName.trim()) {
    errors.lastName = 'Last name is required'
  }

  if (!value.email.trim()) {
    errors.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(value.email)) {
    errors.email = 'Email is invalid'
  }

  if (!value.password.trim()) {
    errors.password = 'Password is required'
  } else if (value.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
  }

  return errors
}

export default ValidateSignup
