import React, {Component} from 'react';
import {Col, Grid, MenuItem, Nav, Navbar, NavDropdown, NavItem, Row} from "react-bootstrap";
import {observer} from 'mobx-react';
import {computed, decorate, action, observable} from "mobx";

import Home from "./components/home/Home";

import Login from "./components/login/Login";
import BookingCalendar from "./components/booking/BookingCalendar";
import {D} from './D';
import {ToastContainer} from "react-toastify";
import {BrowserRouter as Router, Route, Switch, withRouter} from 'react-router-dom';
import {IndexLinkContainer} from 'react-router-bootstrap';
import MyProfile from "./components/login/MyProfile";
import AdminPage from "./components/admin/AdminPage";
import PropTypes from 'prop-types';
import {stores} from "./controllers/Context";
import SecurityStore from "./controllers/SecurityStore";

class App extends Component {

    pages = {
        HOME: '/',
        LOGIN: '/login',
        CALENDAR: '/calendar',
        ADMIN: '/admin'
    }

    showLogin = false;
    showMyProfile = false;

    constructor(props) {
        super(props);
    }


    selectLanguage = (key) => {
        let value = key.split('.')[1];
        this.props.stores.language.language = value;
    }

    editProfile = () => {
        const res = this.props.stores.user.fetchCurrentUser();
        if (res) {
            res.then(user => {
                this.showMyProfile = true;
                return user;
            })
        }
    };

    onLogin = (credentials) => {
        return this.props.stores.security.login(credentials)
            .then(res => {
                this.showLogin = false;
            })
    };

    render() {
        const {pages} = this;
        const {stores} = this.props;
        const {language, languages} = stores.language;
        const {user, isLoggedIn, isAdmin} = stores.security;

        return (
            <div>
                <Navbar collapseOnSelect inverse>
                    <Navbar.Header>
                        <Navbar.Brand>
                            POP Booking
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
                            {isAdmin &&
                            <IndexLinkContainer to={pages.ADMIN}>
                                <NavItem eventKey={pages.ADMIN}>{D('Administration')}</NavItem>
                            </IndexLinkContainer>
                            }
                        </Nav>
                        <Nav pullRight>
                            {isLoggedIn &&
                            <NavItem eventKey={pages.PROFILE} onSelect={this.editProfile}>
                                {user.username}
                            </NavItem>
                            }
                            {!isLoggedIn ?
                                <NavItem eventKey={pages.LOGIN} onSelect={() => this.showLogin = true}>
                                    {D('Login')}
                                </NavItem> :
                                <NavItem eventKey={pages.LOGIN}
                                         onSelect={() => stores.security.logout(false)}>{D('Log out')}</NavItem>
                            }
                            <NavDropdown eventKey={'language'} title={language} id="language-dropdown">
                                {languages.map(l => <MenuItem key={l.name}
                                                              eventKey={'language.' + l.name}
                                                              onSelect={this.selectLanguage}>{l.displayName}</MenuItem>)}
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Grid>
                    <Row>
                        <Col xs={12} md={10} mdOffset={1}>
                            <Route exact path="/" render={() => <Home stores={stores}/>}/>
                            <Route path={pages.CALENDAR} render={() => <BookingCalendar stores={stores}/>}/>
                            {isAdmin && <Route path={`${pages.ADMIN}`} render={() => <AdminPage stores={stores}/>}/>}
                        </Col>
                        {this.showLogin &&
                        <Login history={history} onExit={() => this.showLogin = false}
                               onLogin={this.onLogin} resetPasswordLink={this.props.stores.security.resetPasswordLink}/>
                        }
                        {this.showMyProfile &&
                        <MyProfile onExit={() => this.showMyProfile = false}
                                   user={stores.user.currentUser}
                                   store={stores.user}/>
                        }
                    </Row>
                </Grid>
                <ToastContainer position='bottom-right' autoClose={8000}/>
            </div>
        )
    }

}

export default withRouter(observer(App));

decorate(App, {
    selectLanguage: action,
    showMyProfile: observable,
    showLogin: observable
});

App.propTypes = {
    stores: PropTypes.objectOf(PropTypes.shape({
        security: PropTypes.instanceOf(SecurityStore)
    }))
}