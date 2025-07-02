import { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from '../../icons'
import Label from '../form/Label'
import Input from '../form/input/InputField'
// import Button from '../ui/button/Button'
import "./auth.css"

import useForm from './useForm'

export default function SignInForm() {

  const navigate = useNavigate()

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(e, () => {
      navigate('/')
    })
  }
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const { value, handleChange, handleSubmit, errors } = useForm(
    
  )

  return (
    <div className='flex flex-col flex-1'>
      <div className='w-full max-w-md pt-10 mx-auto'>
        <Link
          to='/'
          className='inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
        >
          <ChevronLeftIcon className='size-5' />
          Back to dashboard
        </Link>
      </div>
      <div className='flex flex-col justify-center flex-1 w-full max-w-md mx-auto'>
        <div>
          <div className='mb-5 sm:mb-8'>
            <h1 className='mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md'>
              Sign In
            </h1>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <form onSubmit={onSubmit}>
              <div className='space-y-6'>
                <div>
                  <Label>
                    Email <span className='text-error-500'>*</span>
                  </Label>
                  {errors.email && <p className='error'>{errors.email}</p>}
                  <Input
                    placeholder='info@gmail.com'
                    type='email'
                    name='email'
                    value={value.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label>
                    Password <span className='text-error-500'>*</span>
                  </Label>
                  {errors.password && (
                    <p className='error'>{errors.password}</p>
                  )}
                  <div className='relative'>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Enter your password'
                      name='password'
                      value={value.password}
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
                <div className='flex items-center justify-between'>
                  <Link
                    to='/reset-password'
                    className='text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400'
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <button
                    className='flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600'
                    type='submit'
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </form>

            <div className='mt-5'>
              <p className='text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start'>
                Don&apos;t have an account?{' '}
                <Link
                  to='/signup'
                  className='text-brand-500 hover:text-brand-600 dark:text-brand-400'
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
