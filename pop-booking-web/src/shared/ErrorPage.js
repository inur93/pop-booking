import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {extendObservable} from 'mobx';

class ErrorPage extends Component {

    constructor(props) {
        super(props);
        extendObservable(this, {});
    }


    render() {
        return (
            <div>
                ErrorPage
            </div>
        )
    }
}

export default observer(ErrorPage)

ErrorPage.propTypes = {
    message: PropTypes.string
}

ErrorPage.defaultProps = {}