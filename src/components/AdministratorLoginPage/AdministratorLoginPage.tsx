import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react'
import { Container, Card, Form, Button, Col, Alert } from 'react-bootstrap';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import api, { ApiResponse, saveToken, saveRefreshToken, saveIdentity } from '../../api/api';
import { Redirect } from 'react-router-dom';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

interface AdministratorLoginPageState {
    formData: {
        username: string,
        password: string,
    }
    
    errorMessage: string;
    isLoggedIn: boolean;
}


export default class AdministratorLoginPage extends Component {
    state: AdministratorLoginPageState;

    constructor(props: Readonly<{}>) {
        super(props)
    
        this.state = {
            formData: {
                username: '',
                password: '',
            },
            errorMessage: '',
            isLoggedIn: false,
        }
    }
    
    private formInputChanged(event: React.ChangeEvent<HTMLInputElement>) {
        const newFormData = Object.assign(this.state.formData, {
            [ event.target.id ]: event.target.value,
        })

        this.setState(Object.assign(this.state, {
            formData: newFormData,
        }));
    }

    private setErrorMessage(message: string) {
        const newState = Object.assign(this.state, {
            errorMessage: message,
        });

        this.setState(newState);
    }

    private setLoginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isLoggedIn: isLoggedIn,
        });

        this.setState(newState);
    }

    private doLogin() {
        const data = {
            username: this.state.formData.username,
            password: this.state.formData.password,
        };

        api('auth/administrator/login', 'post', data)
            .then((res: ApiResponse) => {
                if (res.status === "error") {
                    this.setErrorMessage('System error... Try again!');
                    return;
                }

                if (res.status === 'ok') {
                    if (res.data.statusCode !== undefined) {
                        let message = '';

                        switch (res.data.statusCode) {
                            case -3001: message = 'Unkown username!'; break;
                            case -3002: message = 'Bad password!'; break;
                        }

                        this.setErrorMessage(message);

                        return;
                    }

                    saveToken('administrator', res.data.token);
                    saveRefreshToken('administrator', res.data.refreshToken);
                    saveIdentity('administrator', res.data.identity);

                    this.setLoginState(true);
                } 
            });
    }

    render() {
        if (this.state.isLoggedIn === true) {
            return (
                <Redirect to="/administrator/dashboard" />
            );
        }
        return (
            <Container>
                <RoledMainMenu role="visitor" /> 
                
                <Col md={ { span: 6, offset: 3 } }>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <FontAwesomeIcon icon={ faUser} />Administrator Login
                            </Card.Title>
                            <Form>
                                <Form.Group>
                                    <Form.Label htmlFor="username">Username:</Form.Label>
                                    <Form.Control type="username" id="username" 
                                        value={ this.state.formData.username }
                                        onChange={ event => this.formInputChanged(event as any) } />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label htmlFor="password">Password:</Form.Label>
                                    <Form.Control type="password" id="password" 
                                        value={ this.state.formData.password }
                                        onChange={ event => this.formInputChanged(event as any) } />
                                </Form.Group>
                                <Form.Group>
                                    <Button variant="primary"
                                        onClick={ () => this.doLogin() }>
                                    Log in</Button>
                                </Form.Group>
                            </Form>
                            <Alert variant="danger" 
                                className={ this.state.errorMessage ? '' : 'd-none'}>
                                { this.state.errorMessage }
                            </Alert>
                        </Card.Body>
                    </Card>
                </Col>
            </Container>
            
        );
    }
}

