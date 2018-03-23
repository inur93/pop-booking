import SecurityStore from "../controllers/SecurityStore";
import LanguageStore, {D} from "../controllers/LanguageStore";
import {toast} from 'react-toastify';

import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);
const BASE_URL = process.env.REACT_APP_API_HOST;


const token = req => SecurityStore.token && req.set('Authorization', `Bearer ${SecurityStore.token}`);
const getResponseBody = res => res.body;

const handleErrors = err => {
    if(err && !err.status){
        toast.error(D("No internet connection"));
    }
    if (err && err.response && (err.response.status === 401 || err.response.status === 403)) {
        SecurityStore.logout();
    }

    return err;
}


class RestClient {

    static getUrl(route) {
        return `${BASE_URL}${route}`;
    }

    static _fetch(agent) {
        return agent
            .use(token)
            .end(handleErrors)
            .then(getResponseBody);
    }

    GET (route){
        return RestClient._fetch(superagent.get(RestClient.getUrl(route)));
    }

    POST(route, body) {
        return RestClient._fetch(superagent.post(RestClient.getUrl(route), body));
    }

    PUT(route, body) {
        return RestClient._fetch(superagent.put(RestClient.getUrl(route), body));
    }

    DELETE(route) {
        return RestClient._fetch(superagent.del(RestClient.getUrl(route)));
    }
}

export default new RestClient();
