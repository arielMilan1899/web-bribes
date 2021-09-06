import React, {useState} from 'react'
import {apiUrl} from "../../config";
import Form from "./Form";


const BribeContainer = () => {
  const [errors, setErrors] = useState();
  const [result, setResult] = useState();

  const bribe = (queue) => {

    fetch(`${apiUrl}/bribes/`, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({queue}),
    })
      .then(response => response.json())
      .then(({data, errors: postErrors}) => {
        if (postErrors) {
          setErrors(postErrors);
          setResult([]);
        } else {
          setResult(data);
          setErrors([]);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <Form
      runBribe={queue => bribe(queue)}
      errors={errors}
      result={result}
    />
  );
};

export default BribeContainer;
