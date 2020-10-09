import React, { Component } from 'react';
import { MainMenu, MainMenuItem } from '../MainMenu/MainMenu';

interface RoledMainMenuProperties {
    role: 'user' | 'administrator' | 'visitor';
}

export default class RoledMainMenu extends Component<RoledMainMenuProperties> {
    render() {
        let items: MainMenuItem[] = [];

        switch (this.props.role) {
            case 'visitor'       : items = this.getVisitorMenuItems(); break;
            case 'user'          : items = this.getUserMenuItems(); break;
            case 'administrator' : items = this.getAdministratorMenuItems(); break;
        }

        let showCart = false;

        if (this.props.role === 'user') {
            showCart = true;
        }

        return <MainMenu items={ items } showCart={ showCart } />
    }

    getUserMenuItems(): MainMenuItem[] {
        return [
            new MainMenuItem("Home", "/"),
            new MainMenuItem("Contact", "/contact/"),
            new MainMenuItem("Register", "/user/register/"),
            new MainMenuItem("My orders", "/user/orders/"),
            new MainMenuItem("Log out", "/user/logout/"),
        ];
    }

    
    getAdministratorMenuItems(): MainMenuItem[] {
        return [
            new MainMenuItem("Dashboard", "/administrator/dashboard"),
            new MainMenuItem("Log out", "/administrator/logout/"),
        ];
    }

    getVisitorMenuItems(): MainMenuItem[] {
        return [
            new MainMenuItem("Log in", "/user/login/"),
            new MainMenuItem("Register", "/user/register/"),
            new MainMenuItem("Administrator Log in", "/administrator/login/"),
        ];
    }
}