import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router'

const AdminLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const adminToken = localStorage.getItem('admin_access_token')
      const isLoginPage = location.pathname === '/admin'
      
      if (!adminToken && !isLoginPage) {
        // Not logged in and trying to access protected route - redirect to login
        navigate('/admin', { replace: true })
      } else if (adminToken && isLoginPage) {
        // Logged in but on login page - redirect to dashboard
        navigate('/admin/dashboard', { replace: true })
      }
      
      setIsChecking(false)
    }

    checkAuth()
  }, [navigate, location.pathname])

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    )
  }

  return (
    <div className='landing-page'>
      <Outlet />
    </div>
  )
}

export default AdminLayout
