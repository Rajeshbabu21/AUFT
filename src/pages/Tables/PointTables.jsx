import React from 'react'
// import ComponentCard from '../../components/common/ComponentCard'
import PageBreadcrumb from '../../components/common/PageBreadCrumb'
import ComponentCard from '../../components/common/ComponentCard'
import BasicTableOne from '../../components/tables/BasicTables/BasicTableOne'
const PointTables = () => {
  return (
    <>
      <PageBreadcrumb pageTitle='Points table' />
      <div className='space-y-6'>
        <ComponentCard title='Basic Table 1'>
          <BasicTableOne />
        </ComponentCard>
      </div>
    </>
  )
}

export default PointTables