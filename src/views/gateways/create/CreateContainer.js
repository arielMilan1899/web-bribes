import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
import {apiUrl} from "../../../config";
import GatewayForm from "../form/Form";


const GatewayCreateContainer = () => {
  const history = useHistory();
  const [errors, setErrors] = useState();

  const createGateway = (gateway) => {
    fetch(`${apiUrl}/gateways/add`, {
      method: 'POST', // or 'PUT'
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

  return (
    <GatewayForm
      gatewaySave={gateway => createGateway(gateway)}
      errors={errors}
    />
  );
};

export default GatewayCreateContainer;
