import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {Glyphicon} from "react-bootstrap";

class FloatingBtn extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className="floating-btn" onClick={this.props.onClick}>
                <div className="floating-btn-item">
                    <div className="floating-btn-icon"><Glyphicon glyph='plus' /></div>
                </div>
            </div>
        )
    }
}

export default observer(FloatingBtn)

FloatingBtn.propTypes = {
    onClick: PropTypes.func
}

FloatingBtn.defaultProps = {}