import React, {useState} from 'react'
import {
  CCard,
  CCardHeader,
  CCol,
  CRow,
} from '@coreui/react'
import gql from 'graphql-tag'
import {useMutation, useQuery} from "@apollo/react-hooks";
import ContactInfo from "./Details";
import {Prompt} from "react-router-dom";
import {DELETE_IMAGE} from "../../../images/ImageContainer";
import {CONTACTS} from "../../../routes";

export const CONTACT_INFO_QUERY = gql`
        {
          contactInfo{
            id
            email
            phone
            address
            twitter
            facebook
            linkedIn
            about
            pdfUrl
            pdfPublicId
          }
        }
`

export const UPDATE_CONTACT_INFO_MUTATION = gql`
  mutation(
    $id: ID
    $email: String
    $phone: String
    $address: String
    $twitter: String
    $facebook: String
    $linkedIn: String
    $about: String
    $pdfUrl: String
    $pdfPublicId: String
  ) {
    updateContactInfo(
      input: {
        id: $id
        email: $email
        phone: $phone
        address: $address
        twitter: $twitter
        facebook: $facebook
        linkedIn: $linkedIn
        about: $about
        pdfUrl: $pdfUrl
        pdfPublicId: $pdfPublicId
      }
    ) {
      contactInfo {
        id
      }
      errors {
        field
        messages
      }
      clientMutationId
    }
  }
`;


const ContactInfoContainer = () => {
  const {loading, error, data} = useQuery(CONTACT_INFO_QUERY);
  const [errors, setErrors] = useState()
  const [unSavedPdf, setUnSavedPdf] = useState(null)
  const [isOriginalPdf, setIsOriginalPdf] = useState(true)
  const [deletePdf] = useMutation(DELETE_IMAGE);
  const [updateContactInfo] = useMutation(UPDATE_CONTACT_INFO_MUTATION, {
    onCompleted({updateContactInfo: {errors}}) {
      if (errors) {
        setErrors(errors)
      } else {
        setUnSavedPdf(null)
        setIsOriginalPdf(true)
        alert("Los contactos se han salvado correctamente")
      }
    }
  });

  if (error)
    return <p>Oops, algo salio mal!</p>

  if (loading)
    return <p>Cargando...</p>

  const {contactInfo} = data

  return (
    <CRow>
      <Prompt
        message={({pathname}) => {
          if (unSavedPdf && pathname !== CONTACTS)
            deletePdf({variables: {publicId: unSavedPdf}})
          return true
        }}
      />
      <CCol>
        <CCard>
          <CCardHeader>
            <b>
              Información de contacto
            </b>
          </CCardHeader>
          <ContactInfo
            contactInfo={contactInfo}
            contactInfoSave={contactInfo => updateContactInfo({variables: contactInfo})}
            setUnSavedPdf={setUnSavedPdf}
            setIsOriginalPdf={setIsOriginalPdf}
            isOriginalPdf={isOriginalPdf}
            errors={errors}/>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ContactInfoContainer
