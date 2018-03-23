import {extendObservable, autorun, observe, reaction, computed} from 'mobx';
import RestClient from "../shared/RestClient";
import {D} from "./LanguageStore";
import {toast} from 'react-toastify';

/*
created: 17-02-2018
created by: Runi
*/

class SecurityStore {

    path = "/v1/authentication/login";
    token;
    claims;
    user;
    isAdmin;
    isLoggedIn;

    constructor() {
        extendObservable(this, {
            token: localStorage.getItem("token"),
            claims: computed(() => this.decodeClaims(this.token)),
            user: computed(() => this.claims && this.claims.user),
            isLoggedIn: computed(() => !!this.token),
            isAdmin: computed(this.isAdmin)
        });

        observe(this, (change) => {
            console.log(change.newValue);
        });

        this.tokenHandler = reaction(() => this.token, token => {
            if (token) {
                localStorage.setItem('token', token);
                const claims = this.decodeClaims(token);
                let expDate = new Date(claims.exp * 1000);
                let now = new Date();
                let timeout = (expDate - now) - 2000; //logout 2 seconds before token expiration.
                if (timeout < 0) this.logout(true); //clear token if already expired
                //remove token when expired
               // setTimeout(() => logout(), timeout);
            } else {
                localStorage.removeItem('token');
            }
        })
    }


    isAdmin = () => {
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
        return RestClient.POST(this.path, credentials)
            .then(user => user && (this.token = user.token));
    }

    logout = (expired) => {
        this.token = null;
        if(expired) toast.info(D("Login has expired"));
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

export default new SecurityStore();