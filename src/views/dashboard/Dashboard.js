import React from 'react'
import {
  CCard,
  CCardHeader,
  CCol,
  CRow,
} from '@coreui/react'


const Dashboard = () => {
  return (
    <>
      <CRow className="align-items-center mt-3">
        <CCol>
          <CCard>
            <CCardHeader>
              <h1>Welcome to Basic Demo Web!!!</h1>
            </CCardHeader>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
