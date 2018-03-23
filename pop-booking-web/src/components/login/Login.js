import React, {Component} from 'react';
import Recaptcha from 'react-recaptcha';
import {Button, ControlLabel, FormControl, FormGroup, Modal} from "react-bootstrap";
import PropTypes from 'prop-types';
import {extendObservable} from 'mobx';
import {observer} from "mobx-react";
import LanguageStore, {D} from "../../controllers/LanguageStore";
import {toast} from 'react-toastify';

class Login extends Component {
    captcha_site_key = process.env.REACT_APP_CAPTCHA_SITE_KEY || "6LeQhC8UAAAAAPw_2k4_sZtE3w1y6VgIuCB-DMOx";

    ref = undefined;

    username;
    password;
    captchaToken;

    isLoading;

    constructor() {
        super();
        extendObservable(this, {
            username: "",
            password: "",
            isLoading: false
        })
    }

    reset = () => {
        this.ref.reset();
    }

    login = () => {
        this.isLoading = true;
        this.props.onLogin({
            username: this.username,
            password: this.password,
            captchaToken: this.captchaToken
        }).then(() => {
            this.isLoading = false;
            this.props.onExit();
        }).catch((reason) => {
            this.isLoading = false;
            toast.warn(reason.message);
        });
    }

    onVerifyCaptcha = (token) => {
        this.captchaToken = token;
    }

    loadCaptcha = () => {

    }

    render() {

        const {onExit} = this.props;
        return (
            <Modal show onHide={onExit}>
                <Modal.Header closeButton>
                    <Modal.Title>{D('Login')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <FormGroup>
                            <ControlLabel>{D('Username')}</ControlLabel>
                            <FormControl type="text" value={this.username} placeholder={D('Username')}
                                         onChange={(evt) => this.username = evt.target.value}/>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>{D('Password')}</ControlLabel>
                            <FormControl type="password" value={this.password} placeholder={D('Password')}
                                         onChange={(evt) => this.password = evt.target.value}/>
                        </FormGroup>
                        <Recaptcha key="0"
                                   sitekey={this.captcha_site_key}
                                   render="explicit"
                                   ref={r => this.ref = r}
                                   verifyCallback={this.onVerifyCaptcha}
                                   onloadCallback={this.loadCaptcha}
                                   className="btn btn-default btn-primary"
                                   value="Log in"/>
                    </form>
                </Modal.Body>
                <Modal.Footer>

                    <Button bsStyle="primary" onClick={this.login} disabled={this.isLoading}>{D('Login')}</Button>
                    <Button onClick={onExit}>{D('Close')}</Button>
                </Modal.Footer>
            </Modal>
        );
    }
};

export default observer(Login);

Login.propTypes = {
    onExit: PropTypes.func,
    onLogin: PropTypes.func.isRequired
}