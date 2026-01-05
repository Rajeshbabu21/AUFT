import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  
  // useEffect(() => {
  //   const user = localStorage.getItem('user')
  //   setIsLoggedIn(!!user)
  // }, [location]) 

   useEffect(() => {
    const token = localStorage.getItem('access_token')
    setIsLoggedIn(!!token)
  }, [location]) 

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    navigate('/') 
  }

  return (
    <div>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-900/95 backdrop-blur-lg shadow-2xl border-b border-slate-800'
          : 'bg-slate-900/80 backdrop-blur-md border-b border-slate-800/50'
      }`}>
        <div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 md:p-6'>
          <a href='/' className='flex items-center space-x-3 rtl:space-x-reverse group'>
            <div className='relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300'></div>
              <img
                src='https://flowbite.com/docs/images/logo.svg'
                className='h-10 relative z-10'
                alt='AUFT Logo'
              />
            </div>
            <span className='self-center text-2xl md:text-3xl font-black whitespace-nowrap text-white tracking-tight'>
              AUFT
            </span>
          </a>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            type='button'
            className='inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-blue-200 rounded-lg md:hidden hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
            aria-controls='navbar-default'
            aria-expanded={isMobileMenuOpen}
          >
            <span className='sr-only'>Open main menu</span>
            <svg className='w-5 h-5' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 17 14'>
              <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M1 1h15M1 7h15M1 13h15' />
            </svg>
          </button>

          <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} w-full md:block md:w-auto transition-all duration-300`} id='navbar-default'>
            <ul className='font-medium flex flex-col p-4 md:p-0 mt-4 border border-slate-700 rounded-lg bg-slate-800/95 backdrop-blur-md md:flex-row md:space-x-2 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-transparent'>
              
              <li>
                <a
                  href='/'
                  className={`block py-2.5 px-4 rounded-lg transition-all font-semibold relative ${
                    location.pathname === '/' 
                      ? 'text-white md:text-blue-400 md:border-b-2 md:border-blue-400' 
                      : 'text-blue-200 hover:bg-slate-700 md:hover:bg-slate-800 md:hover:text-white'
                  }`}
                  aria-current={location.pathname === '/' ? 'page' : undefined}
                >
                  Home
                </a>
              </li>

              {!isLoggedIn ? (
                <>
                  <li>
                    <a
                      href='/signin'
                      className={`block py-2.5 px-4 rounded-lg transition-all font-semibold relative ${
                        location.pathname === '/signin' 
                          ? 'text-white md:text-blue-400 md:border-b-2 md:border-blue-400' 
                          : 'text-blue-200 hover:bg-slate-700 md:hover:bg-slate-800 md:hover:text-white'
                      }`}
                    >
                      Login
                    </a>
                  </li>
                  <li>
                    <a
                      href='/signup'
                      className='block py-2.5 px-5 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-bold'
                    >
                      Register
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <a
                      href='/point-tables'
                      className={`block py-2.5 px-4 rounded-lg transition-all font-semibold relative ${
                        location.pathname === '/dashboard' 
                          ? 'text-white md:text-blue-400 md:border-b-2 md:border-blue-400' 
                          : 'text-blue-200 hover:bg-slate-700 md:hover:bg-slate-800 md:hover:text-white'
                      }`}
                    >
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className='block py-2.5 px-4 rounded-lg transition-all font-semibold text-red-500 hover:text-white hover:bg-slate-700 md:hover:bg-slate-800'
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}

            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
