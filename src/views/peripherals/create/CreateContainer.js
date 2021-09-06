import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
import {apiUrl} from "../../../config";
import PeripheralForm from "../form/Form";


const PeripheralCreateContainer = (props) => {
  const {gateway} = props.match.params;
  const history = useHistory();
  const [errors, setErrors] = useState();

  const createPeripheral = (peripheral) => {
    fetch(`${apiUrl}/peripherals/add`, {
      method: 'POST', // or 'PUT'
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
          history.push(`/gateways/detail/${gateway}`);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <PeripheralForm
      gatewaySerialNumber={gateway}
      peripheralSave={peripheral => createPeripheral(peripheral)}
      errors={errors}
    />
  );
};

export default PeripheralCreateContainer;
