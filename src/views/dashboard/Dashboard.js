import React from 'react'
import {
  CCard,
  CCardHeader,
  CCol,
  CRow,
} from '@coreui/react'
import BribeContainer from "../bribes/BribeContainer";


const Dashboard = () => {
  return (
    <>
      <CRow className="align-items-center mt-3">
        <CCol>
          <CCard>
            <CCardHeader>
              <BribeContainer/>
            </CCardHeader>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
