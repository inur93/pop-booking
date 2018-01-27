import React from 'react';
import ReactDOM from 'react-dom';

import Home from '../components/home/Home';
//controllers
import BasicController from './BasicController';
import MainController from './MainController';
import LoginController from './LoginController';

class HomeController extends BasicController {
    homeRef;
    showBookings = false;
    constructor() {
        super();
        LoginController.addLoginStateChangedListener(this);
        this.showBookings = LoginController.isLoggedIn();
    }
    isNavItemVisible = (id) => {
        return true;
    }
    
    show = (id) => {
        ReactDOM.render(
            <Home ref={r => this.homeRef = r} showBookings={this.showBookings}/>,
            document.getElementById('main-content')
        );
    }

    hide = (id) => {
        return;
    }

    loggedOut = () => {
        this.showBookings = false;
    }

    loggedIn = () => {
        this.showBookings = true;
    }

}
export default new HomeController();