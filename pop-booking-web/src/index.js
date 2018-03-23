import React from 'react';
import ReactDOM from 'react-dom';
import RestClient from './shared/RestClient';
import './stylesheets/css/index.css';

import App from "./App";
import LanguageStore from "./controllers/LanguageStore";
import ErrorPage from "./shared/ErrorPage";

LanguageStore.init()
    .then(() => {
        ReactDOM.render(
            <App />,
            document.getElementById('main-content')
        );
    })
    .catch(() => {
        ReactDOM.render(
            <ErrorPage />,
            document.getElementById('main-content')
        )
    });


