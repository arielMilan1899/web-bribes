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
const initialValues = ({gateway, updateMode}) => {
  const initial = {
    serialNumber: '',
    name: '',
    ipv4: '',
  };

  if (updateMode) {
    return {
      ...initial,
      ...gateway,
    }
  } else {
    return initial
  }
};

const GatewayForm = (props) => {
  const history = useHistory();
  const {
    updateMode,
    gatewaySave,
    errors
  } = props;

  const [fields, setFields] = useState(initialValues(props));

  /**
   * @description
   * Updating before send to parent.
   * @returns {*} No returns.
   */
  const handleOnSave = () => {
    gatewaySave(fields);
  };

  const {name, ipv4, serialNumber} = fields;

  return (
    <React.Fragment>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              {(updateMode ? "Update" : "Create") + ' gateway'}
            </CCardHeader>
            <CCardBody>
              <CForm action="" method="post" encType="multipart/form-data" className="form-horizontal">
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="text-input">Serial number</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      type="text"
                      id="serial-number-input"
                      name="serial-number-input"
                      value={serialNumber}
                      onChange={(event) => setFields({...fields, ...{serialNumber: event.target.value}})}
                      invalid={errors && errors.filter(error => error.param === 'serialNumber').length > 0}
                      disabled={updateMode}
                    />
                    {errors && errors.find(error => error.param === 'serialNumber') &&
                    <small>{errors.find(error => error.param === 'serialNumber').msg}</small>}
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="text-input">Name</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      type="text"
                      id="name-input"
                      name="name-input"
                      value={name}
                      onChange={(event) => setFields({...fields, ...{name: event.target.value}})}
                      invalid={errors && errors.filter(error => error.param === 'name').length > 0}
                    />
                    {errors && errors.find(error => error.param === 'name') &&
                    <small>{errors.find(error => error.param === 'name').msg}</small>}
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="text-input">IPv4</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      type="text"
                      id="ipv4-input"
                      name="ipv4-input"
                      value={ipv4}
                      onChange={(event) => setFields({...fields, ...{ipv4: event.target.value}})}
                      invalid={errors && errors.filter(error => error.param === 'ipv4').length > 0}
                    />
                    {errors && errors.find(error => error.param === 'ipv4') &&
                    <small>{errors.find(error => error.param === 'ipv4').msg}</small>}
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

GatewayForm.defaultProps = {
  gateway: {},
  updateMode: false,
};


export default GatewayForm;
