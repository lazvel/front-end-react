import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react'
import { Container, Card } from 'react-bootstrap';
import { faIceCream } from '@fortawesome/free-solid-svg-icons';

export class ContactPage extends Component {
    render() {
        return (
            <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faIceCream} />
                            Contact details
                        </Card.Title>
                        <Card.Text>
                            Contact details will be shown here
                        </Card.Text>
                    </Card.Body>
                </Card>
                
            </Container>
            
        );
    }
}

export default ContactPage;
