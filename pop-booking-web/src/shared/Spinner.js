import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import LanguageStore from "../controllers/LanguageStore";

class Spinner extends Component {

    constructor(props) {
        super(props);
    }

    retry = (evt) => {
        evt.preventDefault();
        this.props.retryFunc();
    }

    render() {
        const {show, error, retryFunc} = this.props;
        const {SPINNER_LOADING, SPINNER_ERROR, SPINNER_RETRY} = LanguageStore;
        return (
            <div>
                { show ?
                    error ? <p>{SPINNER_ERROR}{retryFunc && <a href="#" onClick={this.retry}>{SPINNER_RETRY}</a>} </p> : <p>{SPINNER_LOADING}</p>
                    : <div/>
                }
            </div>
        )
    }
}

export default observer(Spinner)

Spinner.propTypes = {
    show: PropTypes.bool,
    error: PropTypes.bool,
    retryFunc: PropTypes.func
}

Spinner.defaultProps = {
    show: true,
    error: false
}