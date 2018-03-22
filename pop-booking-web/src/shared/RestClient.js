import SecurityStore from "../controllers/SecurityStore";
import LanguageStore from "../controllers/LanguageStore";


class RestClient {


    constructor(baseUrl = '', {headers = {}, devMode = false, simulatedDelay = 0} = {}) {
        baseUrl = process.env.REACT_APP_API_HOST;
        if (!baseUrl) throw new Error('missing baseUrl');
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'charset': 'utf-8',
            /* 'pragma': 'no-cache',
             'cache-control': 'no-cache'*/
        };
        Object.assign(this.headers, headers);
        this.baseUrl = baseUrl;
        this.simulatedDelay = simulatedDelay;
        this.devMode = devMode;
    }

    _simulateDelay() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, this.simulatedDelay);
        });
    }

    _fullRoute(url) {
        return `${this.baseUrl}${url}`;
    }

    _fetch(route, method, body, isQuery = false, contentType, noCache = false) {

        if (!route) throw new Error('Route is undefined');
        if (contentType) this.headers.contentType = contentType;
        var fullRoute = this._fullRoute(route);
        if (isQuery && body) {
            var qs = require('qs');
            const query = qs.stringify(body);
            fullRoute = `${fullRoute}?${query}`;
            body = undefined;
        }
        var authToken = SecurityStore.token;
        if (authToken) {
            Object.assign(this.headers, {'Authorization': 'Bearer ' + authToken});
        }
        let opts = {
            method,
            headers: this.headers
        };
        if (body) {
            Object.assign(opts, {body: JSON.stringify(body)});
        }


        const fetchPromise = () => fetch(fullRoute, opts);

        if (this.devMode && this.simulatedDelay > 0) {
            // Simulate an n-second delay in every request
            return this._simulateDelay()
                .then(() => fetchPromise())
                .then(response => response.json());
        } else {
            return fetchPromise()
                .then(response => {
                        let auth = response.headers.get("Authorization");
                        if (auth) {
                            auth = auth.replace("Bearer2 ", "");
                            SecurityStore.token = auth;
                        }

                        //empty response
                        if(response.status === 204) return;
                        if(response.status === 200) return response.json();
                        switch(response.status){
                            case 204: return; //empty response
                            case 200:
                            case 201: return response.json();
                            case 403:
                            default:
                                return response.json().then(json => {
                                    throw new Error(LanguageStore[json.message] || json.msg);
                                })
                        }
                    }
                );
        }

    }

    GET(route, query, noCache) {
        return this._fetch(route, 'GET', query, true, noCache);
    }

    POST(route, body, noCache) {
        return this._fetch(route, 'POST', body, noCache);
    }

    PUT(route, body, contentType, noCache) {
        return this._fetch(route, 'PUT', body, contentType, noCache);
    }

    DELETE(route, query, noCache) {
        return this._fetch(route, 'DELETE', query, true, noCache);
    }
}

export default new RestClient();