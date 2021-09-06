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

export const MATERIALS_QUERY = gql`
    {
      materials {
        id
        title {
          es
          en
        }
      }
    }
`

export const CREATE_MATERIAL_MUTATION = gql`
  mutation(
    $title: LanguageInput!
  ) {
    createMaterial(
      input: {
        title: $title
      }
    ) {
      material {
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

export const UPDATE_MATERIAL_MUTATION = gql`
  mutation(
    $id: ID
    $title: LanguageInput!
  ) {
    updateMaterial(
      input: {
        id: $id
        title: $title
      }
    ) {
      material {
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

export const DELETE_MATERIAL_MUTATION = gql`
  mutation(
    $ids: [ID]!
  ) {
    deleteMaterial(
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

const defaultMaterial = {
  id: undefined,
  title: {es: '', en: ''}
}

const Materials = () => {
  const [page, setPage] = useState(1)
  const [openModal, setOpenModal] = useState(false)
  const [currentMaterial, setCurrentMaterial] = useState(defaultMaterial)
  const {title} = currentMaterial
  const {loading, error, data} = useQuery(MATERIALS_QUERY);
  const [errors, setErrors] = useState()
  const [emptyTitle, setEmptyTitle] = useState(false)

  const [createMaterial] = useMutation(
    CREATE_MATERIAL_MUTATION,
    {
      onError(error) {
        setErrors({errors: [error]})
      },
      onCompleted({createMaterial: {errors}}) {
        if (!errors) {
          onOpenModal()
        } else {
          setErrors(errors)
        }
      },
    }
  );

  const [deleteMaterial] = useMutation(DELETE_MATERIAL_MUTATION);

  const [updateMaterial] = useMutation(
    UPDATE_MATERIAL_MUTATION,
    {
      onError(error) {
        setErrors({errors: [error]})
      },
      onCompleted({updateMaterial: {errors}}) {
        if (!errors) {
          onOpenModal()
        } else {
          setErrors(errors)
        }
      },
    }
  );

  const handleOnSave = () => {
    const {id, title: {__typename: typename, ...title}} = currentMaterial

    if (!title.es || !title.en) {
      setEmptyTitle(true)
      return
    }

    setEmptyTitle(false)

    id
      ? updateMaterial({variables: {id: id, title: title}})
      : createMaterial({variables: {title: title}})
  };

  const pageChange = newPage => {
    page !== newPage && setPage(newPage)
  }

  const onOpenModal = (material = defaultMaterial) => {
    setOpenModal(!openModal)
    setCurrentMaterial(material)
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
              Materiales
            </b>
            <div className="card-header-actions">
              <CButton color='success' onClick={() => onOpenModal()}>Create</CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              items={data.materials}
              fields={[
                {key: 'Título', _classes: 'font-weight-bold'}, 'Acciones'
              ]}
              hover
              striped
              itemsPerPage={itemsPerPage}
              activePage={page}
              scopedSlots={{
                'Título':
                  (item) => (
                    <td>
                      <p>{`${item.title.es}`}</p>
                      <p>{`${item.title.en}`}</p>
                    </td>
                  ),
                'Acciones':
                  (item) => (
                    <td>
                      <CButton color='secondary' onClick={() => onOpenModal(item)}>Editar</CButton>
                      <DeleteConfirmation mutation={deleteMaterial} variables={{ids: [item.id]}} label={item.title.es}/>
                    </td>
                  )
              }}
            />
            <CPagination
              activePage={page}
              onActivePageChange={pageChange}
              pages={Math.ceil(data.materials.length / itemsPerPage)}
              doubleArrows={false}
              arrows={Math.ceil(data.materials.length / itemsPerPage) > 1}
              align="center"
            />
            <CModal
              show={openModal}
              onClosed={() => {
                setErrors()
                setEmptyTitle(false)
                setCurrentMaterial(defaultMaterial)
              }}
              onClose={() => setOpenModal(!openModal)}
            >
              <CModalHeader closeButton>
                <CModalTitle>Material</CModalTitle>
              </CModalHeader>
              <CCol xs="12" md="9">
                <CInput
                  id="text-input"
                  name="text-input"
                  placeholder={'español'}
                  value={title.es}
                  onChange={(event) =>
                    setCurrentMaterial({...currentMaterial, ...{title: {...title, ...{es: event.target.value}}}})}
                  invalid={emptyTitle || errors}
                />
                <CInput
                  id="text-input"
                  name="text-input"
                  placeholder={'inglés'}
                  value={title.en}
                  onChange={(event) =>
                    setCurrentMaterial({...currentMaterial, ...{title: {...title, ...{en: event.target.value}}}})}
                  invalid={emptyTitle || errors}
                />
                <CInvalidFeedback>Ingrese un título válido</CInvalidFeedback>
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

export default Materials
