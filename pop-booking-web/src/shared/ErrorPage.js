import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';

class ErrorPage extends Component {

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