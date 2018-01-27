import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './stylesheets/css/index.css';

//components
import Navigation from './components/shared/Navigation';
import Home from './components/home/Home';
import MessageList from './components/shared/MessageList';

//controllers
import LoginController from './controllers/LoginController';

LoginController.initialize();

ReactDOM.render(
  <Navigation />,
  document.getElementById('navigation')
);

// ReactDOM.render(
//   <Home />,
//   document.getElementById('home')
// );

ReactDOM.render(
  <MessageList />,
  document.getElementById('messages')
);


