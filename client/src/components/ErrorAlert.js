import React from 'react';
import { Alert } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';

const ErrorAlert = ({ message }) => {
  return (
    <Alert variant="danger" className="d-flex align-items-center my-4">
      <FaExclamationTriangle className="me-2" />
      <div>{message}</div>
    </Alert>
  );
};

export default ErrorAlert;