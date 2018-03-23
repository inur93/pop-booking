import React, {Component} from 'react';
import {Col, Grid, MenuItem, Nav, Navbar, NavDropdown, NavItem, Row} from "react-bootstrap";
import {observer} from 'mobx-react';
import Home from "./components/home/Home";
import {computed, extendObservable} from "mobx";
import Login from "./components/login/Login";
import SecurityStore from "./controllers/SecurityStore";
import StoreRegistry from "./controllers/StoreRegistry";
import BookingCalendar from "./components/booking/BookingCalendar";
import LanguageStore, {D} from "./controllers/LanguageStore";
import {ToastContainer, toast} from "react-toastify";
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import {LinkContainer, IndexLinkContainer} from 'react-router-bootstrap';

class App extends Component {

    uiStore;

    constructor(props) {
        super(props);
        this.uiStore = new AppUiStore();
    }


    selectLanguage = (key) => {
        switch (key) {
            case 'language.da':
                LanguageStore.language = 'da';
                break;
            case 'language.en':
                LanguageStore.language = 'en';
                break;
        }
    }

    handleLoginAndLogout = (event) => {
        this.uiStore.login = true;
    }

    render() {
        const {activePage, pages, user, isLoggedIn, doLogin} = this.uiStore;
        let page = null;
        /*switch (activePage) {
            case pages.HOME:
                page = <Home postStore={StoreRegistry.getPostStore()}/>;
                break;
            case pages.CALENDAR:
                page = <BookingCalendar bookingStore={StoreRegistry.getBookingStore()}/>;
            case pages.PROFILE:

            default :
                console.log("page is under construction");

        }*/

        const {language} = LanguageStore;


        return (
            <Router>
                <div>
                    <Navbar collapseOnSelect>
                        <Navbar.Header>
                            <Navbar.Brand>
                                <a href="#">
                                    POP Booking
                                </a>
                            </Navbar.Brand>
                            <Navbar.Toggle/>
                        </Navbar.Header>
                        <Navbar.Collapse>
                            <Nav bsStyle="tabs">
                                <IndexLinkContainer to='/'>
                                    <NavItem eventKey={pages.HOME}>{D('Home')}</NavItem>
                                </IndexLinkContainer>
                                <IndexLinkContainer to={pages.CALENDAR}>
                                    <NavItem eventKey={pages.CALENDAR}>{D('Calendar')}</NavItem>
                                </IndexLinkContainer>
                            </Nav>
                            <Nav pullRight>
                                {isLoggedIn &&
                                <NavItem eventKey={pages.PROFILE}>
                                    {user.username}
                                </NavItem>
                                }
                                {!isLoggedIn ?
                                    <NavItem eventKey={pages.LOGIN} onSelect={() => this.uiStore.doLogin = true}>
                                        {D('Login')}
                                    </NavItem> :
                                    <NavItem eventKey={pages.LOGIN} onSelect={SecurityStore.logout}>{D('Log out')}</NavItem>
                                }
                                <NavDropdown eventKey={'language'} title={language} id="language-dropdown">
                                    <MenuItem eventKey={'language.da'} onSelect={this.selectLanguage}>DA</MenuItem>
                                    <MenuItem eventKey={'language.en'} onSelect={this.selectLanguage}>EN</MenuItem>
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                    <Grid>
                        <Row>
                            <Col xs={12} md={10} mdOffset={1} lg={8} lgOffset={2}>
                                <Route exact path="/" render={() =>
                                    <Home postStore={StoreRegistry.getPostStore()}/>
                                }/>
                                <Route path={pages.CALENDAR} render={() =>
                                    <BookingCalendar bookingStore={StoreRegistry.getBookingStore()}/>
                                }/>


                            </Col>
                            {this.uiStore.doLogin &&
                            <Login history={history} onExit={() => this.uiStore.doLogin = false}
                                   onLogin={this.uiStore.onLogin}/>
                            }
                        </Row>
                    </Grid>
                    <ToastContainer position='bottom-right' autoClose={8000}/>
                </div>
            </Router>
        )
    }

}

export default observer(App);

export class AppUiStore {

    pages = {
        HOME: '/',
        PROFILE: '/profile',
        LOGIN: '/login',
        CALENDAR: '/calendar'
    }
    isLoggedIn;
    user;
    doLogin;
    //login;

    constructor() {
        extendObservable(this, {
            isLoggedIn: computed(() => {
                return !!SecurityStore.user
            }),
            user: computed(() => SecurityStore.user),
            doLogin: false
        });
    }

    onLogin = (credentials) => {
        return SecurityStore.login(credentials);
    }
}