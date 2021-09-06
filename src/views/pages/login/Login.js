import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {apiUrl, localStorageAuthKey, userLogged} from "../../../config";

const LOGIN_USER = `
    mutation LoginUser($username: String!, $password: String!) {
        login(input: {username: $username, password: $password}) {
            user{
              id
              email
              fullname
            }
            token
            errors {
                field
                messages
            }
        }
    }
`;

const Login = () => {
  const history = useHistory()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const fetchUser = (username, password) => {
    fetch(apiUrl, {
      method: 'post',
      failOnStatusCode: false,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify(
        [{
          operationName: null,
          query: LOGIN_USER,
          variables: {
            username: username,
            password: password,
          }
        }]
      ),
    })
      .then(response => response.json())
      .then(data => {
        const token = data[0].data.login.token;
        const user = data[0].data.login.user;
        if (token) {
          localStorage.setItem(localStorageAuthKey, token);
          localStorage.setItem(userLogged, JSON.stringify(user));
          history.push('/');
          window.location.reload();
        } else {
          alert(data[0].data.login.errors[0].messages[0])
        }
      })
  }

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user"/>
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" placeholder="Username" autoComplete="username"
                              onChange={(event) => setUsername(event.target.value)}/>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked"/>
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="password" placeholder="Password" autoComplete="current-password"
                              onChange={(event) => setPassword(event.target.value)}/>
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        <CButton color="primary" className="px-4"
                                 onClick={() => fetchUser(username, password)}>Login</CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
