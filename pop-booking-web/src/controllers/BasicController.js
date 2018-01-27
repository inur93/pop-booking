import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

//controllers
import MessageController from './MessageController';

export default class BasicController {

    defaultCallback = (response, err, msg) => {
        if (err) {
            MessageController.addDangerMessage(err.message || msg);
        } else {
            MessageController.addSuccessMessage(response.message || msg);
        }
        return response || err;
    }
}

