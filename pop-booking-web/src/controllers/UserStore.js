import {decorate, observable} from 'mobx';
import User from "../models/User";
import {toast} from 'react-toastify';
import {D} from "../D";

/*
created: 24-03-2018
created by: Runi
*/

export default class UserStore {

    path = '/v1/users';
    client;
    users = observable.array([]);
    total = 0;
    currentUser;
    isLoading = false;
    permissions = [];

    constructor(client){
        this.client = client;
        this.client.GET(`${this.path}/permissions`).then(permissions => this.permissions = permissions);
    }

    queryUser = (page, sizePerPage, query = null) => {
        return this.client.GET(`/v1/users/?page=${page}&size=${sizePerPage}&query=${query || ""}`)
            .then(listWithTotal => {
                this.users = listWithTotal.list.map(user => new User(user));
                this.total = listWithTotal.total;
                return this.users;
            })
    }



    updateUser = (user) => {
        return this.client.PUT(`/v1/users/${user.id}`, user);
    }

    updateSelf = (user) => {
        return this.client.PUT(`/v1/users/self`, user)
            .then(user => {
                toast.success(D('Your information has been updated'));
                return user;
            });
    }

    fetchCurrentUser = () => {
        return this.client.GET(`/v1/users/self`)
            .then(user => {
                this.currentUser = new User(user);
                return user;
            })
    }

}

decorate(UserStore, {
    users: observable,
    total: observable,
    currentUser: observable,
    permissions: observable
});
