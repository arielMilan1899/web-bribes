import React, {useState} from 'react'
import {
  CButton,
  CCardBody,
  CCardFooter,
  CCol,
  CFormGroup,
  CInput, CInvalidFeedback,
  CLabel,
  CTextarea,
} from '@coreui/react'
import {uploadImageWithCloudinary} from "../../../images/utils/CloudinaryService";
import DeleteConfirmation from "../../helpers/deleteConfirmation";
import {useMutation} from "@apollo/react-hooks";
import {DELETE_IMAGE} from "../../../images/ImageContainer";
import {Link} from "react-router-dom";


const ContactInfo = ({
                       contactInfo: initialContactInfo,
                       contactInfoSave,
                       setUnSavedPdf,
                       setIsOriginalPdf,
                       isOriginalPdf,
                       errors
                     }) => {
  const [contactInfo, setContactInfo] = useState(initialContactInfo)
  const [deletePdf] = useMutation(DELETE_IMAGE, {
    onCompleted({deleteImage: {errors}}) {
      if (!errors) {
        onDeletePdf()
      }
    }
  });
  const onUploadPdf = (photos) => {
    setContactInfo(
      {...contactInfo, ...{pdfUrl: photos[0].url, pdfPublicId: photos[0].public_id}})
    setUnSavedPdf(photos[0].public_id)
    setIsOriginalPdf(false)
  }

  const onDeletePdf = () => {
    setContactInfo(
      {...contactInfo, ...{pdfUrl: null, pdfPublicId: null}})
    setIsOriginalPdf(false)
  }

  const {
    email,
    phone,
    address,
    twitter,
    facebook,
    linkedIn,
    about,
    pdfUrl,
    pdfPublicId
  } = contactInfo

  const pdfUrlParts = pdfUrl && pdfUrl.split('/')
  const pdfNameParts = pdfUrl && pdfUrlParts[pdfUrlParts.length - 1].split('_')
  const pdfName = pdfUrl && pdfNameParts.reduce((accumulator, currentValue, currentIndex, array) => {
    let value = accumulator
    if (currentIndex !== array.length - 1) {
      value += '_' + currentValue
    } else {
      value += '.pdf'
    }
    return value
  })

  return (
    <CCardBody>
      <CFormGroup row>
        <CCol md="3">
          <CLabel htmlFor="email-input">Email</CLabel>
        </CCol>
        <CCol xs="12" md="9">
          <CInput
            id="text-input"
            name="text-input"
            value={email || ''}
            onChange={(event) => {
              setContactInfo({...contactInfo, ...{email: event.target.value}})
            }}
            invalid={errors && errors.find((error) => error.field === 'email')}
          />
          <CInvalidFeedback>Ingrese un email válido</CInvalidFeedback>
        </CCol>
      </CFormGroup>
      <CFormGroup row>
        <CCol md="3">
          <CLabel htmlFor="email-input">Teléfono</CLabel>
        </CCol>
        <CCol xs="12" md="9">
          <CInput
            id="text-input"
            name="text-input"
            value={phone || ''}
            onChange={(event) => setContactInfo({...contactInfo, ...{phone: event.target.value}})}
          />
        </CCol>
      </CFormGroup>
      <CFormGroup row>
        <CCol md="3">
          <CLabel htmlFor="email-input">Dirección</CLabel>
        </CCol>
        <CCol xs="12" md="9">
          <CInput
            id="text-input"
            name="text-input"
            value={address || ''}
            onChange={(event) => setContactInfo({...contactInfo, ...{address: event.target.value}})}
          />
        </CCol>
      </CFormGroup>
      <CFormGroup row>
        <CCol md="3">
          <CLabel htmlFor="email-input">Twitter</CLabel>
        </CCol>
        <CCol xs="12" md="9">
          <CInput
            id="text-input"
            name="text-input"
            value={twitter || ''}
            onChange={(event) => setContactInfo({...contactInfo, ...{twitter: event.target.value}})}
          />
        </CCol>
      </CFormGroup>
      <CFormGroup row>
        <CCol md="3">
          <CLabel htmlFor="email-input">Facebook</CLabel>
        </CCol>
        <CCol xs="12" md="9">
          <CInput
            id="text-input"
            name="text-input"
            value={facebook || ''}
            onChange={(event) => setContactInfo({...contactInfo, ...{facebook: event.target.value}})}
          />
        </CCol>
      </CFormGroup>
      <CFormGroup row>
        <CCol md="3">
          <CLabel htmlFor="email-input">LinkedIn</CLabel>
        </CCol>
        <CCol xs="12" md="9">
          <CInput
            id="text-input"
            name="text-input"
            value={linkedIn || ''}
            onChange={(event) => setContactInfo({...contactInfo, ...{linkedIn: event.target.value}})}
          />
        </CCol>
      </CFormGroup>
      <CFormGroup row>
        <CCol md="3">
          <CLabel htmlFor="textarea-input">Sobre nosotros</CLabel>
        </CCol>
        <CCol xs="12" md="9">
          <CTextarea
            name="textarea-input"
            id="textarea-input"
            rows="9"
            value={about || ''}
            onChange={(event) => setContactInfo({...contactInfo, ...{about: event.target.value}})}
          />
        </CCol>
      </CFormGroup>
      <CFormGroup>
        <CCol xs="12" md="9">
          {
            !pdfUrl
              ? <CButton color="primary" className="px-4"
                         onClick={() => uploadImageWithCloudinary(onUploadPdf)}>
                Agregar catálogo
              </CButton>
              : <div>
                <Link to={pdfUrl} target="_blank" download>{pdfName}</Link>
                <div>
                  <DeleteConfirmation mutation={isOriginalPdf ? onDeletePdf : deletePdf}
                                      variables={{publicId: pdfPublicId}}
                                      label='el catálogo'/>
                </div>
              </div>
          }
        </CCol>
      </CFormGroup>
      <CCardFooter>
        <CButton color="success" className="px-4"
                 onClick={() => contactInfoSave(contactInfo)}>Salvar</CButton>
      </CCardFooter>
    </CCardBody>
  )
}

export default ContactInfo
