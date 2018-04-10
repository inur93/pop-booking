import {decorate, observable} from 'mobx';

export default class User {

    id;

    name;
    username;
    roomNo;
    isUserActive;
    roles;
    constructor(json) {
        Object.assign(this, json);
        this.name = json.name || "";
        this.username = json.username;
        this.roomNo = json.roomNo || "";
        this.isUserActive = !!json.isUserActive;
        this.roles = json.roles || [];
    }
}

decorate(User, {
    name: observable,
    username: observable,
    roomNo: observable,
    isUserActive: observable,
    roles: observable
})