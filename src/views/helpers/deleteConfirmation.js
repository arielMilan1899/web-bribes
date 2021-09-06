import React, {useState} from 'react'
import {
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CButton,
  CModal,
  CCol,
} from '@coreui/react'

const DeleteConfirmation = ({label, mutation, variables}) => {
  const [confirm, setConfirm] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const onConfirm = (value) => {
    setConfirm(value);
    setOpenModal(!openModal)
  };

  return (
    <>
      <CButton color="danger" className="px-4"
               onClick={() => setOpenModal(!openModal)}>
        Remove
      </CButton>
      <CModal
        show={openModal}
        onClosed={() => confirm && mutation(variables)}
        onClose={() => setOpenModal(!openModal)}
      >
        <CModalHeader closeButton>
          <CModalTitle>
            You will remove a <b>{label}</b>, this action cannot be undone.
          </CModalTitle>
        </CModalHeader>
        <CModalFooter>
          <CCol>
            <CButton color="danger" onClick={() => onConfirm(true)}>
              Remove
            </CButton>
            <CButton color="secondary" onClick={() => onConfirm(false)}>
              Cancel
            </CButton>
          </CCol>
        </CModalFooter>
      </CModal>
    </>)
}

export default DeleteConfirmation
