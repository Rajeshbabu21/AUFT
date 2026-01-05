const ValidateSignup = (value: {name:string, email: string; password: string,team:string }) => {

 
  const errors: { email?: string; password?: string; name?:string;team?:string } = {}

  if (!value.name.trim()) {
    errors.name = 'Name is required'
  }

  if (!value.team.trim()) {
    errors.team = 'Team is required'
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
