import React from 'react';
import ReactDOM from 'react-dom';
import Login from '../components/shared/Login';
import '../stylesheets/css/App.css';
import Api from '../shared/RestApi';
import cookie from 'react-cookie';
//import 'jquery';

//misc
import View from '../shared/View';

//controllers
import ModalController from './ModalController';
import MessageController from './MessageController';
import BasicController from './BasicController';


class MainController extends BasicController {

    viewListeners = [];
    views = [];
    registerView = (id, title, controller, isVisible = false) => {
        var view = new View(id, title, controller, isVisible);
        this.views.push(view);
        this.views.sort((a, b) => a.getOrder() > b.getOrder());
        if(isVisible){
            this.showView(view.getId());
        }
        this.notifyListeners();
    }

    unRegisterView = (id) =>{
        this.views = this.views.filter(el => el.getId() !== id);
        this.notifyListeners();
    }

    addViewListener = (listener) => {
        this.viewListeners.push(listener);
        listener.viewChanged(this.views);

    }

    removeViewListener = (listener) => {
        this.viewListeners = this.viewListeners.filter(el => el !== listener);
    }

    notifyListeners = () => {
        this.viewListeners.forEach(el => el.viewChanged(this.views));
    }

    showView = (id) => {
        this.views.forEach(el => el.hide());
        this.views.filter(el => el.getId() === id)[0].show();
    }


}

export default new MainController();
