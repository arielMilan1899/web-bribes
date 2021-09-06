import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CForm,
  CFormGroup,
  CInput,
  CLabel,
  CRow,
} from "@coreui/react";

/**
 * Initial values to AdForm
 */
const initialValues = ({gatewaySerialNumber, peripheral, updateMode}) => {
  const initial = {
    gatewaySerialNumber: gatewaySerialNumber,
    vendor: '',
    status: 'online',
  };

  if (updateMode) {
    return {
      ...initial,
      ...peripheral,
    }
  } else {
    return initial
  }
};

const PeripheralForm = (props) => {
  const history = useHistory();
  const {
    updateMode,
    peripheralSave,
    errors
  } = props;

  const [fields, setFields] = useState(initialValues(props));

  /**
   * @description
   * Updating before send to parent.
   * @returns {*} No returns.
   */
  const handleOnSave = () => {
    peripheralSave(fields);
  };

  const {gatewaySerialNumber, vendor, status} = fields;

  return (
    <React.Fragment>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              {(updateMode ? "Update" : "Create") + ' peripheral'}
            </CCardHeader>
            <CCardBody>
              <CForm action="" method="post" encType="multipart/form-data" className="form-horizontal">
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="text-input">Gateway Serial number</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      type="text"
                      id="serial-number-input"
                      name="serial-number-input"
                      value={gatewaySerialNumber}
                      onChange={(event) => setFields({...fields, ...{gatewaySerialNumber: event.target.value}})}
                      invalid={errors && errors.filter(error => error.param === 'gatewaySerialNumber').length > 0}
                    />
                    {errors && errors.find(error => error.param === 'gatewaySerialNumber') &&
                    <small>{errors.find(error => error.param === 'gatewaySerialNumber').msg}</small>}
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="text-input">Vendor</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      type="text"
                      id="vendor-input"
                      name="vendor-input"
                      value={vendor}
                      onChange={(event) => setFields({...fields, ...{vendor: event.target.value}})}
                      invalid={errors && errors.filter(error => error.param === 'vendor').length > 0}
                    />
                    {errors && errors.find(error => error.param === 'vendor') &&
                    <small>{errors.find(error => error.param === 'vendor').msg}</small>}
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="text-input">Status</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <select
                      className="form-control"
                      value={status}
                      onChange={(event) => setFields({...fields, ...{status: event.target.value}})}
                    >
                      <option key='online' value='online'>Online</option>
                      <option key='offline' value='offline'>Offline</option>
                    </select>

                  </CCol>
                </CFormGroup>
              </CForm>
            </CCardBody>
            <CCardFooter>
              <CButton color="success" className="px-4"
                       onClick={handleOnSave}>{updateMode ? "Update" : "Create"}</CButton>
              <CButton color="danger" className="px-4"
                       onClick={history.goBack}>Cancel</CButton>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </React.Fragment>
  );
};

PeripheralForm.defaultProps = {
  peripheral: {},
  updateMode: false,
};


export default PeripheralForm;
