import React from 'react';

//components
import { Message } from '../components/shared/MessageList';

class MessageController {

    constructor() {
        this.currentKey = 0;
        this.timeout = 5000;
        this.messages = [];
        this.listener = null;
    }

    addSuccessMessage = (message) => {
        this.addMessage("success", message);
    }

    addInfoMessage = (message) => {
        this.addMessage("info", message);
    }

    addWarningMessage = (message) => {
        this.addMessage("warning", message);
    }

    addDangerMessage = (message) => {
        this.addMessage("danger", message);
    }

    addMessage = (type, message) => {
        const msg = <Message key={this.currentKey++} type={type} message={message} />;
        this.messages.push(msg);

        this.update();

        var self = this;
        setTimeout(function () {
            self.messages.shift();
            self.update();
        }, this.timeout);
    }

    update = () =>{
        if (this.listener) this.listener.update(this.messages);
    }

    setListener = (listener) => {
        this.listener = listener;
    }


}
export default (new MessageController());



