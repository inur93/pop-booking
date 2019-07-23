import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {decorate, action, observable, autorun} from 'mobx';
import UserStore from "../../controllers/UserStore";
import {BootstrapTable, SearchField, TableHeaderColumn} from 'react-bootstrap-table';
import {D} from "../../D";
import {Button, ButtonGroup, Glyphicon} from "react-bootstrap";
import EditUser from "./EditUser";

class AdminUsers extends Component {

    currentPage = 1;
    sizePerPage = 10;
    query = "";

    selected = null;
    editMode = false;

    constructor(props) {
        super(props);

        autorun(() => {
            this.props.store.queryUser(this.currentPage - 1, this.sizePerPage, this.query);
        })
    }

    onPageChange = (page, sizePerPage) => {
        this.currentPage = page;
        this.sizePerPage = sizePerPage;
    };

    onSizePerPageList = (sizePerPage) => {
        this.sizePerPage = sizePerPage;
        return sizePerPage;
    };

    onSearchChange = (query) => {
        this.query = query;
    };

    editRow = (row) => {
        this.selected = row;
        this.editMode = true;
    };

    expandComponent = (row) => {
        return (
            <div>
                <div className="row-spacing">
                    <BootstrapTable data={[row]} className="table-word-wrap"
                                    key={"table-row"}>
                        <TableHeaderColumn isKey={true} dataField={"id"} hidden/>
                        <TableHeaderColumn dataField={"roles"} dataFormat={this.formatRoles}>{D('Permissions')}</TableHeaderColumn>
                    </BootstrapTable>
                </div>
                <ButtonGroup style={{float: 'right'}}>
                    <Button bsStyle="primary" onClick={() => this.editRow(row)}>{D('Edit')}</Button>
                </ButtonGroup>
            </div>);
    };

    expandColumnComponent(var1) {
        const {isExpandableRow, isExpanded} = var1;
        let content = '';


        if (isExpandableRow) {
            content = <Glyphicon glyph={isExpanded ? "triangle-bottom" : "triangle-right"}/>;
        } else {
            content = ' ';
        }
        return (
            <div> {content} </div>
        );
    }

    formatRoles = (val, row) => {
        let str = "";
        (val || []).forEach(role => str += `${D(role)}, ` );
        return str.substr(0, str.length-2);
    };

    customSearchField = () => {
        return (<SearchField placeholder={D('Search')}/>);
    };

    render() {
        const {users, total} = this.props.store;
        const {editMode, selected} = this;

        return (
            <div>
                {editMode &&
                <EditUser user={selected} store={this.props.store} onExit={() => this.editMode = false}/>
                }
                <BootstrapTable data={users}
                                remote={true}
                                pagination={total > 10}
                                search={true}
                                multiColumnSearch={true}
                                fetchInfo={{dataTotalSize: total}}
                                hover
                                expandableRow={() => true}
                                expandComponent={this.expandComponent}
                                expandColumnOptions={{
                                    expandColumnVisible: true,
                                    expandColumnComponent: this.expandColumnComponent,
                                    columnWidth: 50,
                                    expandedColumnHeaderComponent: this.expandedColumnHeaderComponent
                                }}
                                selectRow={{
                                    mode: 'checkbox',
                                    bgColor: '#89b7db',
                                    hideSelectColumn: true,
                                    clickToExpand: true,
                                    clickToSelect: true,
                                    selected:selected ? [selected.id] : []
                                }}
                                options={{
                                    expandRowBgColor: '#89b7db',
                                    sizePerPage: this.sizePerPage,
                                    searchField: this.customSearchField,
                                    pageStartIndex: 1,
                                    page: this.currentPage,
                                    onSizePerPageList: this.onSizePerPageList,
                                    onPageChange: this.onPageChange,
                                    onSortChange: this.onSortChange,
                                    onFilterChange: this.onFilterChange,
                                    onSearchChange: this.onSearchChange,
                                    expanding: selected ? [selected.id] : []
                                }}>
                    <TableHeaderColumn isKey dataField={"id"} hidden/>
                    <TableHeaderColumn dataField={"username"}>{D('Username')}</TableHeaderColumn>
                    <TableHeaderColumn dataField={"name"}>{D('Name')}</TableHeaderColumn>
                    <TableHeaderColumn dataField={"roomNo"}>{D('Room #')}</TableHeaderColumn>
                    <TableHeaderColumn dataField={"isUserActive"}
                                       dataFormat={(value) => value ? D('Yes') : D('No')}>{D('Active')}</TableHeaderColumn>
                </BootstrapTable>
            </div>
        )
    }
}

export default observer(AdminUsers)

decorate(AdminUsers, {
    onPageChange: action,
    onSizePerPageList: action,
    editRow: action,

    currentPage: observable,
    sizePerPage: observable,
    query: observable,
    editMode: observable,
    selected: observable
});

AdminUsers.propTypes = {
    store: PropTypes.instanceOf(UserStore)
};

AdminUsers.defaultProps = {};