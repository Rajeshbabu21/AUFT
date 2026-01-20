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
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const { value, handleChange, handleSubmit, errors } = useFormSignup()

  // Team mapping for slug conversion
  const teamMap: Record<string, string> = {
    'NetBusters': 'netbusters',
    'Jugling Giants': 'jugling-giants',
    'Soccer Hooligans': 'soccer-hooligans',
    'Mit': 'mit',
    'Faking Phantoms': 'faking-phantoms',
    'Drbling Demons': 'drbling-demons',
  }

  // Handle form submission
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(e, async () => {
      try {
        setLoading(true)
        const payload = {
          name: value.name,
          email: value.email,
          password: value.password,
          team: value.team ? teamMap[value.team as keyof typeof teamMap] || value.team : '',
          position: value.position || '',
          owner: value.owner || false,
          icon: value.icon || false,
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
                    <select
                      id='team'
                      name='team'
                      value={value.team}
                      onChange={handleChange}
                      className='w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400'
                    >
                      <option value=''>Select your team</option>
                      <option value='NetBusters'>NetBusters</option>
                      <option value='Jugling Giants'>Jugling Giants</option>
                      <option value='Soccer Hooligans'>Soccer Hooligans</option>
                      <option value='Mit'>Mit</option>
                      <option value='Faking Phantoms'>Faking Phantoms</option>
                      <option value='Drbling Demons'>Drbling Demons</option>
                    </select>
                  </div>
                  <div className='sm:col-span-1'>
                    <Label>
                      Position<span className='text-error-500'>*</span>
                    </Label>
                    {errors.position && <p className='error'>{errors.position}</p>}
                    <select
                      id='position'
                      name='position'
                      value={value.position || ''}
                      onChange={handleChange}
                      className='w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400'
                    >
                      <option value=''>Select position</option>
                      <option value='GK'>Goalkeeper</option>
                      <option value='Striker'>Striker</option>
                      <option value='Defence'>Defence</option>
                      <option value='Midfielder'>Midfielder</option>
                      {/* <option value='Fielder'>Fielder</option> */}
                    </select>
                  </div>
                </div>
                <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
                  <div className='flex items-center'>
                    <input
                      type='checkbox'
                      id='owner'
                      name='owner'
                      checked={value.owner || false}
                      onChange={(e) => handleChange({ target: { name: 'owner', value: e.target.checked } } as any)}
                      className='w-4 h-4 border-2 border-gray-300 rounded cursor-pointer appearance-none bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-brand-500 checked:bg-brand-500 checked:border-brand-500'
                      style={
                        value.owner
                          ? {
                              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='white'%3E%3Cpath d='M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z'/%3E%3C/svg%3E")`,
                              backgroundPosition: 'center',
                              backgroundRepeat: 'no-repeat',
                              backgroundSize: '16px',
                            }
                          : {}
                      }
                    />
                    <Label htmlFor='owner' className='ml-2 cursor-pointer'>
                      Owner
                    </Label>
                  </div>
                  <div className='flex items-center'>
                    <input
                      type='checkbox'
                      id='icon'
                      name='icon'
                      checked={value.icon || false}
                      onChange={(e) => handleChange({ target: { name: 'icon', value: e.target.checked } } as any)}
                      className='w-4 h-4 border-2 border-gray-300 rounded cursor-pointer appearance-none bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-brand-500 checked:bg-brand-500 checked:border-brand-500'
                      style={
                        value.icon
                          ? {
                              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='white'%3E%3Cpath d='M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z'/%3E%3C/svg%3E")`,
                              backgroundPosition: 'center',
                              backgroundRepeat: 'no-repeat',
                              backgroundSize: '16px',
                            }
                          : {}
                      }
                    />
                    <Label htmlFor='icon' className='ml-2 cursor-pointer'>
                      Icon
                    </Label>
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
                    disabled={loading}
                    className='flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600'
                  >
                    {loading ? "Signing up..." : "Sign Up"}
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
