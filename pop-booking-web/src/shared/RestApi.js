//import React from 'react';
import RestClient from './RestClient';

 class RestApi extends RestClient {
  constructor () {
    // Initialize with your base URL 
    super(process.env.REACT_APP_API_HOST); //, {headers: {'Access-Control-Allow-Origin': '*'}}
    
  }

  login (data) {
    // Returns a Promise with the response. 
    var resp = this.POST('/v1.0/authentication/login', data);
    return resp; 
  }
  getCurrentUser () {
    // If the request is successful, you can return the expected object 
    // instead of the whole response. 
    return this.GET('/users/current')
      .then(response => response.user);
  }
  
};
export default (new RestApi());
