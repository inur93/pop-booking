import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, extendObservable, observable} from 'mobx';
import {D} from "../../D";
import {Button, ControlLabel, FormControl, FormGroup, Modal} from "react-bootstrap";
import User from "../../models/User";
import UserStore from "../../controllers/UserStore";
import {Typeahead} from "react-bootstrap-typeahead";
import {toast} from 'react-toastify';

class EditUser extends Component {

    user;

    constructor(props) {
        super(props);
        this.user = JSON.parse(JSON.stringify(props.user));
    }

    givePermissions = (permissions) => {
        this.user.roles = permissions;
    }

    save = () => {
        const self = this;
        this.props.user.roles = this.user.roles;
        this.props.store.updateUser(this.props.user)
            .then(saved => {
                if (saved) {
                    toast.success(D('User has been updated'));
                    this.props.onExit();
                }
            })
    }

    render() {
        const {onExit, user, store} = this.props;
        const {username, name, roomNo} = user;
        const {roles} = this.user;
        const {permissions} = store;
        return (
            <Modal show onHide={onExit}>
                <Modal.Header closeButton>
                    <Modal.Title>{`${D('Administrate user')}: ${name}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <form>
                        <FormGroup>
                            <ControlLabel>{D('Username')}</ControlLabel>
                            <FormControl.Static>{username}</FormControl.Static>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>{D('Permissions')}</ControlLabel>
                            <Typeahead selected={roles.toJSON()} required multiple clearButton labelKey={(value) => {
                                return value && D(value);
                            }}
                                       placeholder={D('Give user permissions')}
                                       options={permissions.toJSON() || []}
                                       onChange={this.givePermissions}/>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>{D('Name')}</ControlLabel>
                            <FormControl.Static>{name}</FormControl.Static>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>{D('Room number')}</ControlLabel>
                            <FormControl.Static>{roomNo}</FormControl.Static>
                        </FormGroup>

                    </form>

                </Modal.Body>
                <Modal.Footer>

                    <Button bsStyle="primary" onClick={this.save} disabled={this.isLoading}>{D('Save')}</Button>
                    <Button onClick={onExit}>{D('Close')}</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default observer(EditUser)

decorate(EditUser, {
    user: observable
})
EditUser.propTypes = {
    onExit: PropTypes.func,
    user: PropTypes.instanceOf(User),
    store: PropTypes.instanceOf(UserStore)
}

EditUser.defaultProps = {}