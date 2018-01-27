import React, { Component } from 'react';
import '../../stylesheets/css/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import Recaptcha from 'react-recaptcha';
import LoginController from '../../controllers/LoginController';

class Login extends Component {
  captcha_site_key = process.env.REACT_APP_CAPTCHA_SITE_KEY || "6LeQhC8UAAAAAPw_2k4_sZtE3w1y6VgIuCB-DMOx";

  ref = undefined;

  constructor() {
    super();
  }

  reset = () =>{
    this.ref.reset();
  }

  render() {
    return (

      <div>
        <div className="form-group">
          <label htmlFor="username" className="control-label">Brugernavn:</label>
          <div>
            <input type="text" className="form-control" name="username" id="username" />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password" className="control-label">Kodeord:</label>
          <div>
            <input type="password" className="form-control" name="password" id="password" />
          </div>
        </div>
        <div >
          <Recaptcha key="0"
            sitekey={this.captcha_site_key}
            render="explicit"
            ref={r => this.ref = r}
            verifyCallback={this.props.onVerifyCaptcha}
            onloadCallback={this.props.onLoadCaptcha}
            className="btn btn-default btn-primary"
            value="Log in" />
        </div>
      </div>
    );
  }
};

export default Login;