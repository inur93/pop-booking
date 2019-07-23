//modules
import React from 'react';
import {Badge, Col, Nav, NavItem, Row, Tab} from "react-bootstrap";
import {D} from "../../D";
import PropTypes from 'prop-types';
import AdminUsers from "./AdminUsers";
import {observer} from "mobx-react";
import AdminUnits from "./AdminUnits";
import {decorate} from "mobx";
import AdminDictionary from "./AdminDictionary";


class AdminPage extends React.Component {


    tabs = {
        USERS: 'users',
        UNITS: 'units',
        DICTIONARY: 'dictionary'
    };

    render() {
        const {UNITS, USERS, DICTIONARY} = this.tabs;
        const {stores} = this.props;
        return (
            <Tab.Container id="left-tabs-example" defaultActiveKey={this.tabs.USERS}>
                <Row className="clearfix">
                    <Col sm={3} md={2}>
                        <Nav bsStyle="pills" stacked>
                            <NavItem eventKey={USERS}>{D('Users')}          <Badge pullRight>{stores.user.total}</Badge></NavItem>
                            <NavItem eventKey={UNITS}>{D('Units')}          <Badge pullRight>{stores.bookableItem.total}</Badge></NavItem>
                            <NavItem eventKey={DICTIONARY}>{D('Dictionary')} <Badge pullRight>{stores.language.total}</Badge></NavItem>
                        </Nav>
                    </Col>
                    <Col sm={9} md={10}>
                        <Tab.Content animation>
                            <Tab.Pane eventKey={USERS}>
                                <AdminUsers store={stores.user}/>
                            </Tab.Pane>
                            <Tab.Pane eventKey={UNITS}>
                                <AdminUnits store={stores.bookableItem}/>
                            </Tab.Pane>
                            <Tab.Pane eventKey={DICTIONARY}>
                                <AdminDictionary store={stores.language}/>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        );
    }
}

export default observer(AdminPage);

decorate(AdminPage, {});

AdminPage.propTypes = {
    stores: PropTypes.object,
    tab: PropTypes.string,
    history: PropTypes.object
};
