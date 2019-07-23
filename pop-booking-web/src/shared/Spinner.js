import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {D} from "../D";

class Spinner extends Component {

    retry = (evt) => {
        evt.preventDefault();
        this.props.retryFunc();
    };

    render() {
        const {show, error, retryFunc} = this.props;
        return (
            <div>
                { show ?
                    error ? <p>{D('Content could not be loaded.')}{retryFunc && <a href="#" onClick={this.retry}>{D('Retry')}</a>} </p> : <p>{D('Loading...')}</p>
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
};

Spinner.defaultProps = {
    show: true,
    error: false
};