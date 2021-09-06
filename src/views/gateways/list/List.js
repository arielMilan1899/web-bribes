import React, {Component} from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CHeaderNavLink, CButton
} from '@coreui/react'
import {apiUrl} from "../../../config";
import {formatRoute} from "react-router-named-routes";
import {GATEWAYS_CREATE, GATEWAYS_DETAIL, GATEWAYS_UPDATE} from "../../../routes";
import DeleteConfirmation from "../../helpers/deleteConfirmation";

class GatewaysListContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      gateways: [],
    };
  }

  componentDidMount() {
    fetch(`${apiUrl}/gateways`, {
      method: 'GET', // or 'PUT'
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(({data}) => {
        this.setState({gateways: data})
      })
      .catch(console.log)
  }

  render() {

    const removeGateway = (serialNumber) => {
      fetch(`${apiUrl}/gateways/remove`, {
        method: 'DELETE', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({serialNumber}),
      })
        .then(response => response.json())
        .then(() => {
          this.setState({
            gateways: this.state.gateways.filter(gateway => gateway.serialNumber !== serialNumber)
          })
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    };

    return (
      <Gateways gateways={this.state.gateways} removeGateway={removeGateway}/>
    )
  }
}

const Gateways = ({gateways, removeGateway}) => {

  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>
            <b>
              Gateways
            </b>
            <div className="card-header-actions">
              <CButton color='success' to={GATEWAYS_CREATE}>Create</CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              items={gateways}
              fields={[
                {key: 'Serial number', _classes: 'font-weight-bold'},
                'Name', "Ipv4", "Peripherals", "Acciones"
              ]}
              hover
              striped
              scopedSlots={{
                'Serial number':
                  ({serialNumber}) => (
                    <td>
                      <CHeaderNavLink color='primary' to={formatRoute(GATEWAYS_DETAIL, {gateway: serialNumber})}>
                        <div>
                          {`${serialNumber}`}
                        </div>
                      </CHeaderNavLink>
                    </td>
                  ),
                'Name':
                  ({name}) => (
                    <td>
                      <p>{name}</p>
                    </td>
                  ),
                'Ipv4':
                  ({ipv4}) => (
                    <td>
                      <p>{ipv4}</p>
                    </td>
                  ),
                'Peripherals':
                  ({peripherals}) => (
                    <td>
                      <p>{peripherals.length}</p>
                    </td>
                  ),
                'Acciones':
                  ({serialNumber}) => (
                    <td>
                      <CButton color='primary'
                               to={formatRoute(GATEWAYS_UPDATE, {gateway: serialNumber})}>Update</CButton>
                      <DeleteConfirmation mutation={removeGateway} variables={serialNumber} label={'Gateway'}/>
                    </td>
                  )
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
};

export default GatewaysListContainer
