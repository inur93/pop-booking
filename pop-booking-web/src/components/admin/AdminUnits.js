import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {action, decorate, observable} from 'mobx';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import {D} from "../../D";
import {Button, ButtonGroup, Glyphicon} from "react-bootstrap";
import BookableObjectsStore from "../../controllers/BookableObjectsStore";
import EditUnit from "./EditUnit";
import {toast} from 'react-toastify';
import AddUnit from "./AddUnit";

class AdminUnits extends Component {

    selected = null;
    editMode = false;
    showAddModal = false;

    constructor(props) {
        super(props);

    }

    editRow = (row) => {
        this.selected = row;
        this.editMode = true;
    }

    deleteRow = (row) => {
        this.props.store.deleteUnit(row)
            .then(() => {
                toast.success(D('The unit has been deleted'));
            })
    }

    expandComponent = (row) => {
        return (
            <div>
                <div className="row-spacing">
                    <BootstrapTable data={[row]} className="table-word-wrap"
                                    key={"table-row"}>
                        <TableHeaderColumn isKey={true} dataField={"id"} hidden/>
                        <TableHeaderColumn dataField={"statusMessage"}>{D('Status message')}</TableHeaderColumn>
                    </BootstrapTable>
                </div>
                <ButtonGroup style={{float: 'right'}}>
                    <Button bsStyle="danger" onClick={() => this.deleteRow(row)}>{D('Delete')}</Button>
                    <Button bsStyle="primary" onClick={() => this.editRow(row)}>{D('Edit')}</Button>
                </ButtonGroup>
            </div>);
    }

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

    formatColor = (val) => {
        return <div style={{width: '100%', background: val}}>{val}</div>;
    }

    createAddBtn = (props) => {
        return (<Button bsStyle="primary" onClick={() => this.showAddModal = true}>{D('Add unit')}</Button>);
    }

    render() {
        const {bookableItems} = this.props.store;
        const {editMode, showAddModal, selected} = this;
        console.log(selected && selected.roles);
        return (
            <div>
                {editMode &&
                <EditUnit unit={selected} store={this.props.store} onExit={() => this.editMode = false}/>
                }
                {showAddModal &&
                    <AddUnit store={this.props.store} onExit={() => this.showAddModal = false}/>
                }
                <BootstrapTable data={bookableItems}
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
                                    selected: selected ? [selected.id] : []
                                }}
                                insertRow
                                options={{
                                    insertBtn: this.createAddBtn,
                                    expandRowBgColor: '#89b7db',
                                    expanding: selected ? [selected.id] : []
                                }}>
                    <TableHeaderColumn isKey dataField={"id"} hidden/>
                    <TableHeaderColumn dataField={"name"}>{D('Name')}</TableHeaderColumn>
                    <TableHeaderColumn dataField={"color"}
                                       dataFormat={this.formatColor}>{D('Color')}</TableHeaderColumn>
                    <TableHeaderColumn dataField={"maxBookableHours"}>{D('Max booking hours')}</TableHeaderColumn>
                    <TableHeaderColumn dataField={"status"}
                                       dataFormat={(val) => D(val)}>{D('Status')}</TableHeaderColumn>
                </BootstrapTable>
            </div>
        )
    }
}

export default observer(AdminUnits)

decorate(AdminUnits, {
    editRow: action,
    editMode: observable,
    showAddModal: observable,
    selected: observable
})

AdminUnits.propTypes = {
    store: PropTypes.instanceOf(BookableObjectsStore)
}

AdminUnits.defaultProps = {}