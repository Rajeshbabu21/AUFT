import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {  EyeCloseIcon, EyeIcon } from '../../icons'
import Label from '../form/Label'
import Input from '../form/input/InputField'
import './auth.css'
import useFormSignup from './userFormSignup'
import { signupUser } from '../../api/auth'

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const { value, handleChange, handleSubmit, errors } = useFormSignup()

  // Handle form submission
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(e, async () => {
      try {
        const payload = {
          name: value.name, // from your first input
          email: value.email,
          password: value.password,
          team: value.team, // from your second input
        }

        const res = await signupUser(payload)
        console.log('Signup successful:', res.data)

        // Redirect to login page after signup
        navigate('/signin')
      } catch (error) {
        console.error('Signup failed:', error)
      }
    })
  }

  return (
    <div className='flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar'>
      <div className='flex flex-col justify-center flex-1 w-full max-w-md mx-auto'>
        <div>
          <div className='mb-5 sm:mb-8'>
            <h1 className='mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md'>
              Sign Up
            </h1>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              Enter your email and password to sign up!
            </p>
          </div>
          <div>
            <form onSubmit={onSubmit}>
              <div className='space-y-5'>
                <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
                  <div className='sm:col-span-1'>
                    <Label>
                      Name<span className='text-error-500'>*</span>
                    </Label>
                    {errors.name && <p className='error'>{errors.name}</p>}
                    <Input
                      type='text'
                      id='fname'
                      name='name'
                      value={value.name}
                      placeholder='Enter your name'
                      onChange={handleChange}
                    />
                  </div>
                  <div className='sm:col-span-1'>
                    <Label>
                      Team<span className='text-error-500'>*</span>
                    </Label>
                    {errors.team && <p className='error'>{errors.team}</p>}
                    <Input
                      type='text'
                      id='lname'
                      name='team'
                      value={value.team}
                      placeholder='Enter your team name'
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <Label>
                    Email<span className='text-error-500'>*</span>
                  </Label>
                  {errors.email && <p className='error'>{errors.email}</p>}
                  <Input
                    type='email'
                    id='email'
                    name='email'
                    value={value.email}
                    placeholder='Enter your email'
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label>
                    Password<span className='text-error-500'>*</span>
                  </Label>
                  {errors.password && <p className='error'>{errors.password}</p>}
                  <div className='relative'>
                    <Input
                      placeholder='Enter your password'
                      name='password'
                      value={value.password}
                      type={showPassword ? 'text' : 'password'}
                      onChange={handleChange}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2'
                    >
                      {showPassword ? (
                        <EyeIcon className='fill-gray-500 dark:fill-gray-400 size-5' />
                      ) : (
                        <EyeCloseIcon className='fill-gray-500 dark:fill-gray-400 size-5' />
                      )}
                    </span>
                  </div>
                </div>

                {/* Important: type="submit" */}
                <div>
                  <button
                    type='submit'
                    className='flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600'
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </form>

            <div className='mt-5'>
              <p className='text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start'>
                Already have an account?{' '}
                <Link
                  to='/signin'
                  className='text-brand-500 hover:text-brand-600 dark:text-brand-400'
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
