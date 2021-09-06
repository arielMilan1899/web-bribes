import React, {useState} from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CPagination,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CButton,
  CModal,
  CInput,
  CInvalidFeedback,
} from '@coreui/react'
import gql from 'graphql-tag'
import {useMutation, useQuery} from "@apollo/react-hooks";
import DeleteConfirmation from "../../helpers/deleteConfirmation";
import {itemsPerPage} from "../../../config";
import ImageContainer, {DELETE_IMAGE} from "../../../images/ImageContainer";
import {uploadImageWithCloudinary} from "../../../images/utils/CloudinaryService";

export const MANUFACTURES_QUERY = gql`
    {
      manufacturers {
        id
        name
        logoUrl
        logoPublicId
      }
    }
`

export const CREATE_MANUFACTURER_MUTATION = gql`
  mutation(
    $name: String
    $logoUrl: String
    $logoPublicId: String
  ) {
    createManufacturer(
      input: {
        name: $name
        logoUrl: $logoUrl
        logoPublicId: $logoPublicId
      }
    ) {
      manufacturer {
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

export const UPDATE_MANUFACTURER_MUTATION = gql`
  mutation(
    $id: ID
    $name: String
    $logoUrl: String
    $logoPublicId: String
  ) {
    updateManufacturer(
      input: {
        id: $id
        name: $name
        logoUrl: $logoUrl
        logoPublicId: $logoPublicId
      }
    ) {
      manufacturer {
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

export const DELETE_MANUFACTURER_MUTATION = gql`
  mutation(
    $ids: [ID]!
  ) {
    deleteManufacturer(
      input:{
        ids:$ids
        }
     ){
      successIds
      errors{
        field
        messages
      }
    }
  }
`;

const defaultManufacturer = {
  id: undefined,
  name: '',
  logoUrl: null,
  logoPublicId: null
}

const Manufacturers = () => {
  const [page, setPage] = useState(1)
  const [openModal, setOpenModal] = useState(false)
  const [currentManufacturer, setCurrentManufacturer] = useState(defaultManufacturer)
  const {loading, error, data} = useQuery(MANUFACTURES_QUERY);
  const [errors, setErrors] = useState()
  const [emptyName, setEmptyName] = useState(false)
  const [isOriginalLogo, setIsOriginalLogo] = useState(true)
  const [deleteImage] = useMutation(DELETE_IMAGE);

  const [createManufacturer] = useMutation(
    CREATE_MANUFACTURER_MUTATION,
    {
      onError(error) {
        setErrors({errors: [error]})
      },
      onCompleted({createManufacturer: {errors}}) {
        if (!errors) {
          onOpenModal()
        } else {
          setErrors(errors)
        }
      },
    }
  );

  const [deleteManufacturer] = useMutation(DELETE_MANUFACTURER_MUTATION);

  const [updateManufacturer] = useMutation(
    UPDATE_MANUFACTURER_MUTATION,
    {
      onError(error) {
        setErrors({errors: [error]})
      },
      onCompleted({updateManufacturer: {errors}}) {
        if (!errors) {
          onOpenModal()
        } else {
          setErrors(errors)
        }
      },
    }
  );

  const handleOnSave = () => {
    const {id, logoUrl, logoPublicId, name} = currentManufacturer

    if (!name) {
      setEmptyName(true)
      return
    }

    setEmptyName(false)

    id
      ? updateManufacturer({variables: {id, logoUrl, logoPublicId, name}})
      : createManufacturer({variables: {logoUrl, logoPublicId, name}})
  };

  const pageChange = newPage => {
    page !== newPage && setPage(newPage)
  }

  const onCancelModal = () => {
    setOpenModal(false)
    if (!isOriginalLogo && currentManufacturer.logoPublicId) {
      deleteImage({variables: {publicId: currentManufacturer.logoPublicId}})
    }
  }

  const onOpenModal = (manufacturer = defaultManufacturer) => {
    setOpenModal(!openModal)

    if (!openModal) {
      setCurrentManufacturer(manufacturer)
      setIsOriginalLogo(true)
    }
  }

  const onUploadLogo = (photos) => {
    setCurrentManufacturer(
      {...currentManufacturer, ...{logoUrl: photos[0].url, logoPublicId: photos[0].public_id}})
    setIsOriginalLogo(false)
  }

  const onDeleteLogo = () => {
    setCurrentManufacturer(
      {...currentManufacturer, ...{logoUrl: null, logoPublicId: null}})
    setIsOriginalLogo(false)
  }

  if (error)
    return <p>Oops, algo salio mal!</p>

  if (loading)
    return <p>Cargando...</p>

  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>
            <b>
              Fabricantes
            </b>
            <div className="card-header-actions">
              <CButton color='success' onClick={() => onOpenModal()}>Agregar</CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              items={data.manufacturers}
              fields={[
                {key: 'Logo', _classes: 'font-weight-bold'}, 'Dirección URL', 'Acciones'
              ]}
              hover
              striped
              itemsPerPage={itemsPerPage}
              activePage={page}
              scopedSlots={{
                'Logo':
                  ({logoUrl, logoPublicId}) => (
                    <td>
                      <ImageContainer images={[{url: logoUrl, publicId: logoPublicId}]} onlyImage={true}/>
                    </td>
                  ),
                'Dirección URL':
                  ({name}) => (
                    <td>
                      <p>{name}</p>
                    </td>
                  ),
                'Acciones':
                  (item) => (
                    <td>
                      <CButton color='secondary' onClick={() => onOpenModal(item)}>Editar</CButton>
                      <DeleteConfirmation mutation={deleteManufacturer} variables={{ids: [item.id]}} label={item.name}/>
                    </td>
                  )
              }}
            />
            <CPagination
              activePage={page}
              onActivePageChange={pageChange}
              pages={Math.ceil(data.manufacturers.length / itemsPerPage)}
              doubleArrows={false}
              arrows={Math.ceil(data.manufacturers.length / itemsPerPage) > 1}
              align="center"
            />
            <CModal
              show={openModal}
              onClosed={() => {
                setErrors()
                setEmptyName(false)
                setIsOriginalLogo(false)
                setCurrentManufacturer(defaultManufacturer)
              }}
              onClose={onCancelModal}
            >
              <CModalHeader closeButton>
                <CModalTitle>Fabricante</CModalTitle>
              </CModalHeader>
              <CCol xs="12" md="9">
                <CInput
                  id="text-input"
                  name="text-input"
                  value={currentManufacturer.name}
                  placeholder='url'
                  onChange={(event) =>
                    setCurrentManufacturer({...currentManufacturer, ...{name: event.target.value}})}
                  invalid={emptyName || errors}
                />
                <CInvalidFeedback>Ingrese una url válida</CInvalidFeedback>
              </CCol>
              <CCol>
                {
                  !currentManufacturer.logoUrl
                    ? <CButton color="primary" className="px-4"
                               onClick={() => uploadImageWithCloudinary(onUploadLogo)}>
                      Agregar logo
                    </CButton>
                    : <ImageContainer
                      images={[{publicId: currentManufacturer.logoPublicId, url: currentManufacturer.logoUrl}]}
                      onDeleteImage={onDeleteLogo}
                      customDeleteMutation={isOriginalLogo && onDeleteLogo}
                    />
                }
              </CCol>
              <CModalFooter>
                <CButton color="success" onClick={handleOnSave}>Aceptar</CButton>
              </CModalFooter>
            </CModal>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Manufacturers
