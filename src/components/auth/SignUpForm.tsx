import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {  EyeCloseIcon, EyeIcon } from '../../icons'
import Label from '../form/Label'
import Input from '../form/input/InputField'
import './auth.css'
import useFormSignup from './userFormSignup'
import { signupUser, signinUser } from '../../api/auth'
import type { AuthSignin, SignupPayload } from '../../@types/Auth'
import { getTeamscode } from '../../api/matches'
import type { Team } from '../../@types/Team'

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [teams, setTeams] = useState<Team[]>([])
  const navigate = useNavigate()

  const { value, setValue, handleChange, handleSubmit, errors } = useFormSignup()

  // Fetch teams on component mount
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamsData = await getTeamscode()
        setTeams(teamsData)
      } catch (error) {
        console.error('Failed to fetch teams:', error)
      }
    }
    fetchTeams()
  }, [])

  const handleRoleSelect = (role: 'owner' | 'icon' | 'is_alumni' | 'none') => {
    setValue((prev) => ({
      ...prev,
      owner: role === 'owner',
      icon: role === 'icon',
      is_alumni: role === 'is_alumni',
    }))
  }

  // Team mapping for slug conversion
  const teamMap: Record<string, string> = {
    'Netbusters': 'netbusters',
    'Juggling Giants': 'juggling-giants',
    'Soccer Hooligans': 'soccer-hooligans',
    'Tackling Titans': 'tackling-titans',
    'Faking Phantoms': 'faking-phantoms',
    'Dribbling Demons': 'dribbling-demons',
  }

  // Handle form submission
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(e, async () => {
      // Validate password length before submission
      if (value.password.length < 6) {
        alert('Password must be at least 6 characters long!')
        return
      }

      try {
        setLoading(true)
        
        // Find the selected team's ID
        const selectedTeam = teams.find(
          (team) => team.team_name === value.team || 
                    teamMap[value.team as keyof typeof teamMap] === team.team_code
        )
        const teamId = selectedTeam ? selectedTeam.id : null

        const payload: SignupPayload = {
          user: {
            name: value.name,
            email: value.email,
            password: value.password,
            team: value.team ? teamMap[value.team as keyof typeof teamMap] || value.team : '',
            position: value.position || '',
            owner: value.owner || false,
            icon: value.icon || false,
            is_alumni: value.is_alumni || false,
            is_active: true,
          },
          player: {
            player_name: value.name,
            position: value.position || '',
            team_id: teamId,
          },
        }

        console.log('Sending signup payload:', JSON.stringify(payload, null, 2))
        const res = await signupUser(payload)
        console.log('Signup successful:', res.data)

        // Show success message
        

        // Auto-login after signup to update navbar/auth state
        const loginPayload: AuthSignin = { email: value.email, password: value.password }
        const loginRes = await signinUser(loginPayload)
        const { access_token, token_type } = loginRes.data
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('token_type', token_type)

        // Redirect to landing page after signup
        navigate('/')
      } catch (error: any) {
        console.error('Signup failed:', error)
        
        // Check if user already exists
        if (error.response?.status === 400 || error.response?.status === 409) {
          const errorMessage = error.response?.data?.detail || error.response?.data?.message
          if (errorMessage && (errorMessage.includes('already') || errorMessage.includes('exists'))) {
            alert('This email is already registered! Please sign in instead.')
          } else {
            alert(errorMessage || 'Signup failed. Please check your information.')
          }
        } else if (error.response?.data) {
          const errorDetail = error.response.data.detail || error.response.data.message || 'Signup failed'
          alert(errorDetail)
          console.error('Backend error detail:', JSON.stringify(error.response.data, null, 2))
        } else {
          alert('Signup failed. Please try again.')
        }
      } finally {
        setLoading(false)
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
                      <option value='Netbusters'>Netbusters</option>
                      <option value='Juggling Giants'>Juggling Giants</option>
                      <option value='Soccer Hooligans'>Soccer Hooligans</option>
                      <option value='Tackling Titans'>Tackling Titans</option>
                      <option value='Faking Phantoms'>Faking Phantoms</option>
                      <option value='Dribbling Demons'>Dribbling Demons</option>
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
                {/* <span className='text-red-500 mb-1 text-xs mt-0'> *please select one </span> */}
                <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
                  <label className='flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-brand-500 transition'>
                    <input
                      type='radio'
                      name='role_flag'
                      value='owner'
                      checked={value.owner === true}
                      onChange={() => handleRoleSelect('owner')}
                      className='w-4 h-4 text-brand-500 focus:ring-brand-500'
                    />
                    <span className='text-sm text-gray-800 dark:text-gray-200'>Owner</span>
                  </label>
                  <label className='flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-brand-500 transition'>
                    <input
                      type='radio'
                      name='role_flag'
                      value='icon'
                      checked={value.icon === true}
                      onChange={() => handleRoleSelect('icon')}
                      className='w-4 h-4 text-brand-500 focus:ring-brand-500'
                    />
                    <span className='text-sm text-gray-800 dark:text-gray-200'>Icon</span>
                  </label>
                  <label className='flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-brand-500 transition'>
                    <input
                      type='radio'
                      name='role_flag'
                      value='is_alumni'
                      checked={value.is_alumni === true}
                      onChange={() => handleRoleSelect('is_alumni')}
                      className='w-4 h-4 text-brand-500 focus:ring-brand-500'
                    />
                    <span className='text-sm text-gray-800 dark:text-gray-200'>Alumni</span>
                  </label>
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
