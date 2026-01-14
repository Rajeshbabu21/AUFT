import React from 'react'
import { Outlet } from 'react-router'



const AdminLayout: React.FC = () => {
  

  return (
    <div className='landing-page'>

      <Outlet />
      

    </div>
  )
}

export default AdminLayout
