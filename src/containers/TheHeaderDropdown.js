import React from 'react'
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
} from '@coreui/react'

const TheHeaderDropdown = () => {
  return (
    <CDropdown
      inNav
      className="c-header-nav-items mx-2"
      direction="down"
    >
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem
          header
          tag="div"
          color="light"
          className="text-center"
        >
          <strong>Account</strong>
        </CDropdownItem>
        <CDropdownItem divider/>
      </CDropdownMenu>
    </CDropdown>
  )
};

export default TheHeaderDropdown
