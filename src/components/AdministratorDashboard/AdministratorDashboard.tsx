import React, { Component } from 'react';
import { Card, Container, } from 'react-bootstrap';
import { faMedal } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CategoryType from '../../types/CategoryType';
import { Link, Redirect } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

interface AdministratorDashboardState {
    isAdministratorLoggedIn: boolean;
    categories: CategoryType[];
}

interface ApiCategoryDto {
    categoryId: number;
    name: string;
}

class AdministratorDashboard extends Component {
    state: AdministratorDashboardState;

    constructor(props: Readonly<{}>) {
        super(props)
    
        this.state = {
            isAdministratorLoggedIn: true,
            categories: [],
        };
    }
    
    componentWillMount() {
        this.getMyData(); 
    }

    componentWillUpdate() {
        this.getMyData(); 
    }

    private getMyData() {
        api('api/administrator', 'get', {}, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === "error" || res.status === "login") {
                this.setLoginState(false);
                return;
            }
        });
    }

    private setLoginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isAdministratorLoggedIn: isLoggedIn,
        });

        this.setState(newState);
    }

    render() {
        if (this.state.isAdministratorLoggedIn === false) {
            return (
                <Redirect to="/administrator/login" />
            );
        }
        return (
            <Container>
                <RoledMainMenu role="administrator" /> 
                
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faMedal } /> Administrator dashboard
                        </Card.Title>

                        <ul>
                            <li><Link to="/administrator/dashboard/category/">Categories</Link></li>
                            <li><Link to="/administrator/dashboard/feature/">Features</Link></li>
                            <li><Link to="/administrator/dashboard/article/">Articles</Link></li>
                        </ul>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    
}

export default AdministratorDashboard;

