import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react'
import { Container, Card } from 'react-bootstrap';
import { faUser } from '@fortawesome/free-solid-svg-icons';

export class UserLoginPage extends Component {
    render() {
        return (
            <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faUser} />
                            User Login
                        </Card.Title>
                        <Card.Text>
                            User form
                        </Card.Text>
                    </Card.Body>
                </Card>
                
            </Container>
            
        );
    }
}

export default UserLoginPage;
