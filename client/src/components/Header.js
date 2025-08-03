import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { FaUserSecret } from 'react-icons/fa';

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="#home" className="d-flex align-items-center">
          <FaUserSecret className="me-2" size={24} />
          Fake Account Detector
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Header;