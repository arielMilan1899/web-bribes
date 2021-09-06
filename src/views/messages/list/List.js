import React, {useState} from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CPagination,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
} from '@coreui/react'
import gql from 'graphql-tag'
import {useMutation, useQuery, useLazyQuery} from "@apollo/react-hooks";
import DeleteConfirmation from "../../helpers/deleteConfirmation";
import {itemsPerPage} from "../../../config";
import CIcon from "@coreui/icons-react";

export const MESSAGE_QUERY = gql`
    query Message($id: Int!) {
       message(id: $id) {
        name
        email
        topic
        status
        message
    }
   }
`

export const MESSAGES_QUERY = gql`
    {
      messages {
        id
        createdOn
        name
        email
        topic
        status
      }
    }
`

export const DELETE_MESSAGE_MUTATION = gql`
  mutation(
    $ids: [ID]!
  ) {
    deleteMessage(
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

const Messages = () => {
  const [page, setPage] = useState(1)
  const {loading, error, data} = useQuery(MESSAGES_QUERY);
  const [deleteMessage] = useMutation(DELETE_MESSAGE_MUTATION);
  const [getMessage, {data: messageData}] = useLazyQuery(MESSAGE_QUERY);
  const [openModal, setOpenModal] = useState(false)
  const [readMessages, setReadMessages] = useState([])

  const pageChange = newPage => {
    page !== newPage && setPage(newPage)
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
              Mensajes
            </b>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              items={data.messages}
              fields={[
                {key: 'Estado', _classes: 'font-weight-bold'}, 'Usuario', 'Email', 'Asunto', 'Fecha', 'Acciones'
              ]}
              hover
              striped
              itemsPerPage={itemsPerPage}
              activePage={page}
              scopedSlots={{
                'Estado':
                  ({id, status}) => (
                    <td>
                      {
                        (status === 'READ' || readMessages.find((item) => item === id))
                          ? <CIcon name="cil-envelope-open" className="mfe-2"/>
                          : <CIcon name="cil-envelope-closed" className="mfe-2"/>}
                    </td>
                  ),
                'Usuario':
                  ({id, name, status}) => (
                    <td>
                      {
                        (status === 'READ' || readMessages.find((item) => item === id))
                          ? name
                          : <b>{name}</b>
                      }
                    </td>
                  ),
                'Email':
                  ({id, email, status}) => (
                    <td>
                      {
                        (status === 'READ' || readMessages.find((item) => item === id))
                          ? <a href={"mailto:" + email}>{email}</a>
                          : <b><a href={"mailto:" + email}>{email}</a></b>
                      }
                    </td>
                  ),
                'Asunto':
                  ({id, topic, status}) => (
                    <td>
                      {
                        (status === 'READ' || readMessages.find((item) => item === id))
                          ? topic
                          : <b>{topic}</b>
                      }
                    </td>
                  ),
                'Fecha':
                  ({id, createdOn, status}) => (
                    <td>
                      {
                        (status === 'READ' || readMessages.find((item) => item === id))
                          ? createdOn.split('T')[0]
                          : <b>{createdOn.split('T')[0]}</b>
                      }
                    </td>
                  ),
                'Acciones':
                  ({id, topic}) => (
                    <td>
                      <CButton color="success"
                               onClick={() => {
                                 getMessage({variables: {id: id}})
                                 setOpenModal(!openModal)
                                 setReadMessages(!readMessages.find((item) => item === id)
                                   ? readMessages.concat([id])
                                   : readMessages)
                               }}>
                        Leer
                      </CButton>
                      <DeleteConfirmation mutation={deleteMessage} variables={{ids: [id]}} label={topic}/>
                    </td>
                  )
              }}
            />
            <CPagination
              activePage={page}
              onActivePageChange={pageChange}
              pages={Math.ceil(data.messages.length / itemsPerPage)}
              doubleArrows={false}
              arrows={Math.ceil(data.messages.length / itemsPerPage) > 1}
              align="center"
            />
          </CCardBody>
          {messageData &&
          <CModal
            show={openModal}
            onClose={() => setOpenModal(!openModal)}
          >
            <CModalHeader closeButton>
              <CModalTitle>
                <p><b>De:</b> {messageData.message.name}</p>
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <p><b>Asunto:</b> {messageData.message.topic}</p>
              <p>
                {messageData.message.message}
              </p>
            </CModalBody>
          </CModal>}
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Messages
