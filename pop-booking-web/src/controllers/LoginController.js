import React from 'react';
import '../stylesheets/css/App.css';
import cookie from 'react-cookie';
import {computed, extendObservable} from 'mobx';
//import 'jquery';
//controllers
import BasicController from './BasicController';

class LoginController extends BasicController {

    formId = "loginform";
    userToken = 'userToken';
    authToken = 'authToken';
    timeoutToken = 'tokentimeout';
    popBookingCookie = 'pop-booking';
    captchaToken = undefined;
    captcha = undefined;

    //determine what state application is in. If timeout has expired this might still be true
    stateLoggedIn = false;


    //
    user;
    isLoggedIn;
    authToken;

    constructor() {
        super();
        extendObservable(this, {
            user: () => {

                let c = cookie.load(this.popBookingCookie);
                if(c) return c['userToken'];
                return null;
            },
            isLoggedIn: computed(() => {
                return true;
            }),
            isAdmin: computed(() => {
                if (!this.user) return false;
                if (this.user.assignedRoles.filter(function (role) {
                        return role === "Administrator"
                    }).length > 0) {
                    return true;
                }
                return false;
            })
        });
    }


    login = () => {
        /*  if (!this.captchaToken) {
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
              });*/
    }


    updateAuthToken = (token, timeout) => {
        //force value to bool
        if (!!(token && timeout)) {
            this.saveToken(this.authToken, token);
            this.authToken = token;
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
            cookie.save(this.popBookingCookie, c, {path: '/'});
        }
    }

    logout = () => {
        this.removeToken(this.authToken);
        this.removeToken(this.timeoutToken);
        this.removeToken(this.userToken);
        this.stateLoggedIn = false;
    }

    removeToken = (name) => {
        var c = cookie.load(this.popBookingCookie);
        if (c) {
            c[name] = null;
            cookie.save(this.popBookingCookie, c, {path: '/'});
        }
    }

    onVerifyCaptcha = (token) => {
        this.captchaToken = token;
        this.login();
    }

    onLoadCaptcha = () => {
    }
}

export default new LoginController();