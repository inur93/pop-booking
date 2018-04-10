import React from 'react';
import ReactDOM from 'react-dom';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import './stylesheets/css/App.css'

import './stylesheets/css/index.css';
import './stylesheets/css/select.css'

import App from "./App";
import {stores} from "./controllers/Context";
import {HashRouter} from "react-router-dom";


ReactDOM.render(
    <HashRouter>
    <App stores={stores}/>
    </HashRouter>,
    document.getElementById('main-content')
)

