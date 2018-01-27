import React from 'react';
import ReactDOM from 'react-dom';
import Login from '../components/shared/Login';
import '../stylesheets/css/App.css';
import Api from '../shared/RestApi';
import cookie from 'react-cookie';
import Guid from '../shared/Guid';
//import 'jquery';

//controllers
import ModalController from './ModalController';
import MessageController from './MessageController';
import BasicController from './BasicController';

class LoginController extends BasicController {

    loginComponent;
    loginStateChangedListeners = [];
    formId = "loginform";
    loginModalId = Guid.create();
    userToken = 'userToken';
    authToken = 'authToken';
    timeoutToken = 'tokentimeout';
    popBookingCookie = 'pop-booking';
    captchaToken = undefined;
    captcha = undefined;

    //determine what state application is in. If timeout has expired this might still be true
    stateLoggedIn = false;

    login = () => {
        if (!this.captchaToken) {
            MessageController.addInfoMessage("Are you a robot");
            return;
        }
        var serialize = require('form-serialize');
        var form = document.querySelector('#' + this.formId);
        var data = serialize(form, { hash: true });
        data.captchaToken = this.captchaToken;
        delete data["g-recaptcha-response"];
        debugger;
        Api.login(data)
            .then(response => {
                this.saveToken(this.userToken, response);
                this.notifyListeners();
                this.closeLogin();
                this.stateLoggedIn = true;
                MessageController.addSuccessMessage("Login successfull");

            })
            .catch(err => {
                MessageController.addWarningMessage("Login failed. Make sure you used the right credentials");
                if(this.captcha)this.captcha.reset();
            });
    }

    onLoginClick = (event) => {
        event.preventDefault();
        this.login();
    }

    /**
     * should be called before loading page to update state of user.
     */
    initialize = () => {

        if (this.isLoggedIn()) {

        } else {
            this.logout();
        }
        this.notifyListeners();
    }

    updateAuthToken = (token, timeout) => {
        //force value to bool
        if (!!(token && timeout)) {
            this.saveToken(this.authToken, token);
            this.saveToken(this.timeoutToken, timeout);
        }
    }

    saveToken = (name, token) => {
        if (token && name) {
            var c = cookie.load(this.popBookingCookie);
            if (!c) {
                c = {};
            }
            c[name] = token;
            cookie.save(this.popBookingCookie, c, { path: '/' });
        }
    }

    getAuthToken = () => {
        return this.getToken(this.authToken);
    }

    getToken = (name) => {
        var c = cookie.load(this.popBookingCookie);

        if (c) {
            return c[name];
        }
        return null;
    }

    removeToken = (name) => {
        var c = cookie.load(this.popBookingCookie);
        if (c) {
            c[name] = null;
            cookie.save(this.popBookingCookie, c, { path: '/' });
        }
    }

    getUsername = () => {
        let c = this.getToken(this.userToken);
        if (c && c.username) return c.username;
        return undefined;
    }

    getUserId = () => {
        let c = this.getToken(this.userToken);
        if (c) return c.id;
        return null;
    }

    getUser = () => {
        return this.getToken(this.userToken);
    }

    isLoggedIn = () => {
        var timeout = this.getToken(this.timeoutToken);

        //!!timeout converts possible undefined or null to bool
        var isLoggedIn = !!timeout && new Date(timeout).getTime() > Date.now();
        if (!isLoggedIn && this.stateLoggedIn) this.logout();
        return isLoggedIn;

    }

    logout = () => {
        this.removeToken(this.authToken);
        this.removeToken(this.timeoutToken);
        this.removeToken(this.userToken);
        this.stateLoggedIn = false;
        //TODO remove token on server
        this.notifyListeners();
    }

    notifyListeners = () => {
        var self = this;
        this.loginStateChangedListeners.forEach(function (element) {
            if (self.isLoggedIn()) {
                if (element.loggedIn) {
                    element.loggedIn();
                }
            } else {
                if (element.loggedOut) {
                    element.loggedOut();
                }
            }
        }, this);
    }

    isAdmin = () => {
        if (!this.isLoggedIn()) return false;
        let user = this.getToken(this.userToken);
        if (user) {
            if (user.assignedRoles.filter(function (role) {
                return role === "Administrator"
            }).length > 0) {
                return true;
            }
        }
        return false;
    }

    addLoginStateChangedListener = (listener) => {
        this.loginStateChangedListeners.push(listener);
    }

    removeLoginStateChangedListener = (listener) => {
        this.loginStateChangedListeners = this.loginStateChangedListeners.filter(el => el !== listener);

    }

    onVerifyCaptcha = (token) => {
        this.captchaToken = token;
        this.login();
    }

    onLoadCaptcha = () => {
    }

    /* Open */
    openLogin = (proxy, event) => {
        ModalController.showModal(
            this.loginModalId,
            "Login",
            <Login
                onLoadCaptcha={this.onLoadCaptcha}
                ref={r => this.captcha = r}
                onVerifyCaptcha={this.onVerifyCaptcha} />,
            [<input key={Guid.create()} type="button" className="btn btn-primary" onClick={this.onLoginClick} value="Log in" />],
            false, //show buttons
            true, //make modal a form for submition
            this.formId);
    }

    /* Close */
    closeLogin = (event) => {
        ModalController.hideModal(this.loginModalId);
    }
}

export default (new LoginController());