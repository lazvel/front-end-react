import React from 'react';
import './App.css';
import { Card, Container } from 'react-bootstrap';
import { faHome, faIceCream } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function App() {
  return (
    <Container>
      {/*<Card bg="dark" text="white">
        <Card.Header>Pocetna stranica</Card.Header>
         <Card.Body>
          <Card.Text>Ovde ide sadrzaj</Card.Text>
        </Card.Body>
      </Card> */}
      <FontAwesomeIcon icon={ faIceCream} />
      <FontAwesomeIcon icon={ faHome} />
      Home
    </Container>
  );
}

export default App;
