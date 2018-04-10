import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, observable} from 'mobx';
import {Editor, EditorState} from 'draft-js';
import 'draft-js/dist/Draft.css';
class Welcome extends Component {

    editorState = EditorState.createEmpty();
    editMode = false;
    constructor(props) {
        super(props);

    }


    onChange = (editorState) => {
        this.editorState = editorState;
    }

    render() {
        return (
            <div>
                <Editor placeholder={"A welcome message for the users"} editorState={this.editorState} onChange={this.onChange}/>
            </div>

        )
    }
}

export default observer(Welcome)

Welcome.propTypes = {}

Welcome.defaultProps = {}

decorate(Welcome, {
    editorState: observable,
    editMode: observable
})