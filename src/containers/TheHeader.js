import React from 'react'
import {
  CHeader,
  CHeaderNav,
} from '@coreui/react'
import {
  TheHeaderDropdown,
} from './index'


const TheHeader = () => {
  return <CHeader withSubheader>

    <CHeaderNav className="px-3">
      <TheHeaderDropdown/>
    </CHeaderNav>
  </CHeader>
}

export default TheHeader
