import React from 'react'
import PageBreadcrumb from '../../components/common/PageBreadCrumb'
import ComponentCard from '../../components/common/ComponentCard'
import MatchPage from '../../components/Pagination/MatchPage'
const PointTables:React.FC = () => {
  return (
    <>
      <PageBreadcrumb pageTitle='FIXTURES' />
      <div className='space-y-6'>
        <ComponentCard title=''>
        

          <MatchPage/>
          

          
          
        </ComponentCard>
      </div>
    </>
  )
}

export default PointTables