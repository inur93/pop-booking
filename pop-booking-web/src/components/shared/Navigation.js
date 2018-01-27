import React, { Component } from 'react';
//modules and styles
import '../../stylesheets/css/App.css';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import $ from 'jquery';

//controllers
import LoginController from '../../controllers/LoginController';
import BookingController from '../../controllers/BookingController';
import HomeController from '../../controllers/HomeController';
import AdminPageController from '../../controllers/AdminPageController';
import MainController from '../../controllers/MainController';


export default class Navigation extends Component {

    //tabs = [{id:"#home", init: true}, {id: "#kanooAndKajak", init: false}, {id: "#meetingroom", init: false}];

    constructor() {
        super();

        this.state = {
            isLoggedIn: LoginController.isLoggedIn(),
            username: LoginController.getUsername(),
            navItems: [],
            views: []
        }

    }

    viewChanged = (views) => {
        var navItems = views.map(el =>
            <NavItem style={!el.isVisible() ? { display: 'none' } : {}} active={el.isActive} key={el.getOrder()} eventKey={el.getId()} href={"#" + el.getTitle()}>{el.getTitle()} </NavItem>);
        this.setState({
            navItems: navItems,
            views: views
        })
    }

    componentDidMount = () => {
        LoginController.addLoginStateChangedListener(this);
        MainController.addViewListener(this);
        MainController.registerView(1, "Home", HomeController, true);
        MainController.registerView(2, "Kanoo and kayak", BookingController);
        MainController.registerView(3, "Meetingroom", BookingController);
        MainController.registerView(4, "Administration", AdminPageController);

    }

    loggedIn = () => {
        this.setState({
            isLoggedIn: true,
            username: LoginController.getUsername()
        });
    }

    loggedOut = () => {
        this.setState({
            isLoggedIn: false,
            username: undefined
        });
        this.viewChanged(this.state.views);
    }

    gotoProfile = () => {

    }

    handleSelect = (eventKey, var1) => {
        event.preventDefault();
        MainController.showView(eventKey);
        this.viewChanged(this.state.views);
    }

    handleLoginAndLogout = (e) => {
        event.preventDefault();
        if (this.state.isLoggedIn) {
            LoginController.logout();
        } else {
            //log in
            LoginController.openLogin();
        }
    }

    render() {
        return (
            <Navbar collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="#">
                            POP Booking
                        </a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav bsStyle="tabs" activeKey={this.state.currentView} onSelect={this.handleSelect}>
                        {this.state.navItems}
                    </Nav>
                    <Nav pullRight>
                        {this.state.isLoggedIn &&
                            <NavItem eventKey={0} href="#" onClick={this.gotoProfile}>
                                {this.state.username}
                            </NavItem>
                        }
                        <NavItem eventKey={1} href="#" onClick={this.handleLoginAndLogout}>
                            {this.state.isLoggedIn ? "Log out" : "Log in"}                            
                        </NavItem>

                    </Nav>
                </Navbar.Collapse>
            </Navbar >
        );
    }
}
