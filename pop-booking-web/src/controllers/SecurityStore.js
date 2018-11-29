import {action, computed, decorate, observable, reaction} from 'mobx';

import {toast} from 'react-toastify';

/*
created: 17-02-2018
created by: Runi
*/

export default class SecurityStore {

    client;
    context;
    path = "/v1/authentication/login";

    timer;
    resetPasswordLink = null;

    constructor(client, context) {
        this.client = client;
        this.context = context;

        this.client.GET("/v1/authentication/resetpasswordlink")
            .then(res => this.resetPasswordLink = res.link);
        // save token to localstorage if set - if token is removed, remove it from storage as well
        reaction(() => this.context.token, token => {
            if (this.timer) clearTimeout(this.timer);
            if (token) {
                localStorage.setItem('token', token);
                const claims = this.decodeClaims(token);
                let expDate = new Date(claims.exp * 1000);
                let now = new Date();
                let timeout = (expDate - now) - 2000; //logout 2 seconds before token expiration.
                if (timeout < 0) {
                    this.logout(true); //clear token if already expired
                }
                else {
                    this.timer = setTimeout(() =>this.logout(true), timeout);
                }
            } else {
                localStorage.removeItem('token');
            }
        });
    }



    get claims() {
        return this.decodeClaims(this.context.token);
    }

    get user() {
        return this.claims && this.claims.user;
    }

    get isLoggedIn() {
        return !!this.context.token;
    }

    get isAdmin() {
        if (this.user) {
            if (this.user.roles.filter(function (role) {
                    return role === "Administrator"
                }).length > 0) {
                return true;
            }
        }
        return false;
    }

    login = (credentials) => {
        return this.client.POST(this.path, credentials)
            .then(action((user) => user && (this.context.token = user.token)));
    };

    logout = (expired) => {
        this.context.token = null;
        if (expired) toast.info(("Login has expired"));
    }

    decodeClaims = (token) => {
        if (!token) return null;
        const claims = token.split(".")[1];
        //const decodedClams = decodeURIComponent(encodeURI(window.atob(claims)));
        const decodedClams = decodeURIComponent(escape(window.atob(claims))); //FIXME temp fix with encoding issue

        const jsonClaims = JSON.parse(decodedClams);
        return jsonClaims;
    }


}

decorate(SecurityStore, {
    token: observable,
    resetPasswordLink: observable,
    claims: computed,
    user: computed,
    isLoggedIn: computed,
    isAdmin: computed,
    logout: action
});
