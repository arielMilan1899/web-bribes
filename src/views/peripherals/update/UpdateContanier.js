import React, {Component, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {apiUrl} from "../../../config";
import PeripheralForm from "../form/Form";

class PeripheralUpdateContainer extends Component {

  constructor(props) {
    super(props);
    const {peripheral} = props.match.params;

    this.state = {id: peripheral};
  }

  componentDidMount() {
    const {id} = this.state;
    fetch(`${apiUrl}/peripherals/${id}`)
      .then(res => res.json())
      .then(({data}) => {
        this.setState({peripheral: data})
      })
      .catch(console.log)
  }

  render() {
    return (
      <PeripheralUpdate peripheral={this.state.peripheral}/>
    )
  }
}

const PeripheralUpdate = ({peripheral}) => {

  const history = useHistory();
  const [errors, setErrors] = useState();


  const createPeripheral = (peripheral) => {
    console.log(peripheral)
    fetch(`${apiUrl}/peripherals/update`, {
      method: 'PUT', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(peripheral),
    })
      .then(response => response.json())
      .then(({data, errors: postErrors}) => {
        if (postErrors) {
          setErrors(postErrors)
        } else {
          history.push(`/gateways/detail/${data.gatewaySerialNumber}`);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  if (!peripheral) {
    return null;
  }

  return (
    <PeripheralForm
      gatewaySerialNumber={peripheral.gatewaySerialNumber}
      peripheral={peripheral}
      peripheralSave={peripheral => createPeripheral(peripheral)}
      errors={errors}
      updateMode
    />
  );
};

export default PeripheralUpdateContainer;
