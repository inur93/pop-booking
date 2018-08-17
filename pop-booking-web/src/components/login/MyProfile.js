import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, observable} from 'mobx';
import {D} from "../../D";
import {Button, ControlLabel, FormControl, FormGroup, Modal} from "react-bootstrap";
import UserStore from "../../controllers/UserStore";
import User from "../../models/User";
import SecurityStore from "../../controllers/SecurityStore";

class MyProfile extends Component {

    isSaving;
    user;
    constructor(props) {
        super(props);
        this.user = JSON.parse(JSON.stringify(props.user || {}));
    }

    /*componentWillReceiveProps(newProps){

    }*/
    save = () => {
        this.isSaving = true;
        if(this.props.isSelf){
            this.props.store.updateSelf(this.user);
        }else {
            this.props.store.updateUser(this.user);
        }
    }

    render() {
        const {onExit} = this.props;
        const {name, username, roomNo} = this.user;
        const {isLoading} = this.props.store;
        return (
            <Modal show onHide={onExit}>
                <Modal.Header closeButton>
                    <Modal.Title>{D('My profile')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!isLoading &&
                    <form>
                        <FormGroup>
                            <ControlLabel>{D('Username')}</ControlLabel>
                            <FormControl.Static>{username}</FormControl.Static>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>{D('Name')}</ControlLabel>
                            <FormControl type="text" value={name} placeholder={D('Name')}
                                         onChange={(evt) => this.user.name = evt.target.value}/>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>{D('Room number')}</ControlLabel>
                            <FormControl.Static>{roomNo}</FormControl.Static>
                           {/* <FormControl type="text" value={roomNo} placeholder={D('Room number')}
                                         onChange={(evt) => this.user.roomNo = evt.target.value}/>*/}
                        </FormGroup>
                    </form>
                    }
                </Modal.Body>
                <Modal.Footer>

                    <Button bsStyle="primary" onClick={this.save} disabled={this.isLoading}>{D('Save')}</Button>
                    <Button onClick={onExit}>{D('Close')}</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default observer(MyProfile)

MyProfile.propTypes = {
    onExit: PropTypes.func,
    user: PropTypes.instanceOf(User),
    store: PropTypes.instanceOf(UserStore),
    isSelf: PropTypes.bool
}

MyProfile.defaultProps = {
    isSelf: true
}

decorate(MyProfile, {
    isSaving: observable,
    user: observable

})