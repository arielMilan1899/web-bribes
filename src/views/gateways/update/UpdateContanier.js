import React, {Component, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {apiUrl} from "../../../config";
import GatewayForm from "../form/Form";

class GatewayUpdateContainer extends Component {

  constructor(props) {
    super(props);
    const {gateway} = props.match.params;

    this.state = {serialNumber: gateway};
  }

  componentDidMount() {
    const {serialNumber} = this.state;
    fetch(`${apiUrl}/gateways/${serialNumber}`)
      .then(res => res.json())
      .then(({data}) => {
        this.setState({gateway: data})
      })
      .catch(console.log)
  }

  render() {
    return (
      <GatewayUpdate gateway={this.state.gateway}/>
    )
  }
}

const GatewayUpdate = ({gateway}) => {

  const history = useHistory();
  const [errors, setErrors] = useState();

  const updateGateway = (gateway) => {
    fetch(`${apiUrl}/gateways/update`, {
      method: 'PUT', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gateway),
    })
      .then(response => response.json())
      .then(({data, errors: postErrors}) => {
        if (postErrors) {
          setErrors(postErrors)
        } else {
          history.push(`/gateways/detail/${data.serialNumber}`);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  if (!gateway) {
    return null;
  }

  return (
    <GatewayForm
      gateway={gateway}
      gatewaySave={gateway => updateGateway(gateway)}
      errors={errors}
      updateMode
    />
  );
};

export default GatewayUpdateContainer;
