import {context} from "../controllers/Context";
import {D} from '../D';
import {toast} from 'react-toastify';

import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);
const BASE_URL = process.env.REACT_APP_API_HOST;


const token = req => context.token && req.set('Authorization', `Bearer ${context.token}`);
const getResponseBody = res => res.body;

const handleErrors = err => {
    if(err && !err.status){
        toast.error(D("No internet connection"));
    }

    if(err && err.response && err.response.body){
        toast.error(D(err.response.body.message));
    }
    return err;
}


export class RestClient {

    getUrl(route) {
        return `${BASE_URL}${route}`;
    }

    _fetch(agent) {
        return agent
            .use(token)
            .end(handleErrors)
            .then(getResponseBody);
    }

    GET (route){
        return this._fetch(superagent.get(this.getUrl(route)));
    }

    POST(route, body) {
        return this._fetch(superagent.post(this.getUrl(route), body));
    }

    PUT(route, body) {
        return this._fetch(superagent.put(this.getUrl(route), body));
    }

    DELETE(route) {
        return this._fetch(superagent.del(this.getUrl(route)));
    }
}

