import React, {useState} from 'react'
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

const Form = (props) => {
  const {
    runBribe,
    result,
    errors
  } = props;

  const [queue, setQueue] = useState('');

  /**
   * @description
   * Updating before send to parent.
   * @returns {*} No returns.
   */
  const handleRunBribe = (e) => {
    e.preventDefault();
    runBribe(queue);
  };

  return (
    <React.Fragment>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Run Bribe algorithm</CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleRunBribe} className="form-horizontal">
                <CFormGroup row>
                  <CCol xs="12" md="9">
                    <CInput
                      type="text"
                      id="queue-input"
                      name="queue-input"
                      value={queue}
                      onChange={(event) => setQueue(event.target.value)}
                      invalid={errors && errors.filter(error => error.param === 'queue').length > 0}
                    />
                    {errors && errors.find(error => error.param === 'queue') &&
                    <small>{errors.find(error => error.param === 'queue').msg}</small>}
                  </CCol>
                </CFormGroup>
                <CCol xs="12" md="9">
                  <CLabel htmlFor="text-input">{isNaN(result) ? result : `Bribes: ${result}`}</CLabel>
                </CCol>
                <CCardFooter>
                  <CButton type="submit" color="success" className="px-4">Run</CButton>
                </CCardFooter>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </React.Fragment>
  );
};

export default Form;
