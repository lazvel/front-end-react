import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react'
import { Container, Card, Form, Button, Col, Alert } from 'react-bootstrap';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import api, { ApiResponse, saveToken, saveRefreshToken } from '../../api/api';
import { Redirect } from 'react-router-dom';


interface UserLoginPageState {
    formData: {
        email: string,
        password: string,
    }
    
    errorMessage: string;
    isLoggedIn: boolean;
}


export default class UserLoginPage extends Component {
    state: UserLoginPageState;

    constructor(props: Readonly<{}>) {
        super(props)
    
        this.state = {
            errorMessage: '',
            isLoggedIn: false,
            formData: {
                email: '',
                password: '',
            }
        }
    }
    
    private formInputChanged(event: React.ChangeEvent<HTMLInputElement>) {
        const newFormData = Object.assign(this.state.formData, {
            [ event.target.id ]: event.target.value,
        })
        
        const newState = Object.assign(this.state, {
            formData: newFormData,
        });

        this.setState(newState);
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
            email: this.state.formData.email,
            password: this.state.formData.password,
        };

        api('auth/user/login', 'post', data)
            .then((res: ApiResponse) => {
                console.log(res);
                if (res.status === "error") {
                    this.setErrorMessage('System error... Try again!');
                    return;
                }

                if (res.status === 'ok') {
                    if (res.data.statusCode !== undefined) {
                        let message = '';

                        switch (res.data.statusCode) {
                            case -3001: message = 'Unkown email!'; break;
                            case -3002: message = 'Bad password!'; break;
                        }

                        this.setErrorMessage(message);

                        return;
                    }

                    saveToken(res.data.token);
                    saveRefreshToken(res.data.refreshToken);

                    this.setLoginState(true);
                } 
            });
    }

    render() {
        if (this.state.isLoggedIn === true) {
            return (
                <Redirect to="/" />
            );
        }
        return (
            <Container>
                <Col md={ { span: 6, offset: 3 } }>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <FontAwesomeIcon icon={ faUser} />User Login
                            </Card.Title>
                            <Form>
                                <Form.Group>
                                    <Form.Label htmlFor="email">E-mail:</Form.Label>
                                    <Form.Control type="email" id="email" 
                                        value={ this.state.formData.email }
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

