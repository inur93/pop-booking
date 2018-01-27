import LoginController from '../controllers/LoginController';



export default class RestClient {
  localCache = [];
  constructor(baseUrl = '', { headers = {}, devMode = false, simulatedDelay = 0 } = {}) {
    if (!baseUrl) throw new Error('missing baseUrl');
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
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

  fetchFromCache = (route, method) => {
    if(true) return null;
    if (this.localCache[route]) {
      if(Date.now() - this.localCache[route].timestamp > 1000*10){ //caching for 10 secs
        return null;
      }
      var response = this.localCache[route].response;

      return new Promise(
        function (resolver, val2, val3) {
          return resolver(response);
        },
        function (val1, val2, val3) {
          return val1(response);
        });
    }
  }

  cacheResponse = (route, method, response) => {
    if (method !== "GET") return;

    this.localCache[route] = {
      timestamp: Date.now(),
      response: response
    }
  }

  _fetch(route, method, body, isQuery = false, contentType, noCache = false) {
    if (!noCache) {
      var cached = this.fetchFromCache(route, method);
      if (cached) return cached;
    }
    if (!route) throw new Error('Route is undefined');
    if (contentType) this.headers.contentType = contentType;
    var fullRoute = this._fullRoute(route);
    if (isQuery && body) {
      var qs = require('qs');
      const query = qs.stringify(body);
      fullRoute = `${fullRoute}?${query}`;
      body = undefined;
    }
    var authToken = LoginController.getAuthToken();
    if (authToken) {
      Object.assign(this.headers, { 'Authorization': 'Bearer ' + authToken });
    }
    let opts = {
      method,
      headers: this.headers
    };
    if (body) {
      Object.assign(opts, { body: JSON.stringify(body) });
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
          let auth = response.headers.get("authorization");
          if (auth) auth = auth.replace("Bearer2 ", "");
          let timeout = response.headers.get("tokentimeout");
          // this.cacheResponse(route, method, response);
          LoginController.updateAuthToken(auth, timeout);
          return response.ok ?
            response.json().then(json => {
              this.cacheResponse(route, method, json);
              return json;
            }) :
            response.json().then(json => { throw new Error(json.message) })
        }
        );
    }

  }

  GET(route, query, noCache) { return this._fetch(route, 'GET', query, true, noCache); }
  POST(route, body, noCache) { return this._fetch(route, 'POST', body, noCache); }
  PUT(route, body, contentType, noCache) { return this._fetch(route, 'PUT', body, contentType, noCache); }
  DELETE(route, query, noCache) { return this._fetch(route, 'DELETE', query, true, noCache); }
}