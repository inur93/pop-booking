import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {action, decorate, observable} from 'mobx';
import {BootstrapTable, SearchField, TableHeaderColumn} from 'react-bootstrap-table';
import {D} from "../../D";
import LanguageStore from "../../controllers/LanguageStore";
import {toast} from 'react-toastify';
import {Badge, Button} from "react-bootstrap";

class AdminDictionary extends Component {

    currentPage = 1;
    sizePerPage = 10;

    onPageChange = (page, sizePerPage) => {
        this.currentPage = page;
        this.sizePerPage = sizePerPage;
    };

    onSizePerPageList = (sizePerPage) => {
        this.sizePerPage = sizePerPage;
        return sizePerPage;
    };

    saveCell = (row, cellName, cellValue) => {
        const entry = {
            language: cellName,
            value: cellValue,
            key: row.key
        };
        this.props.store.updateEntry(entry)
            .then(res => {
                if (res) toast.success(D('Entry has been updated'));
            })
    };

    saveAllRecordedEntries = () => {
        let entries = [];
        this.props.store.recordedEntries
            .forEach(el => {
                this.props.store.languages.forEach(lang => {
                    entries.push({
                        key: el.key,
                        language: lang.name,
                        value: el[lang.name]
                    })
                })
            });
        this.props.store.createMultipleEntries(entries)
            .then(res => {
                toast.success(D('Entries added to dictionary'));
            })
    }

    createRecordBtn = () => {
        return <Button bsStyle="primary" onClick={() => this.props.store.isRecording = !this.props.store.isRecording}>
            {this.props.store.isRecording ? D('Stop recording') : D('Start recording')}
        </Button>
    };

    createSaveAllRecorded = () => {
        return <Button bsStyle="primary" onClick={this.saveAllRecordedEntries}>{D('Save all')}</Button>;
    };

    customSearchField = () => {
        return (<SearchField placeholder={D('Search')}/>);
    };
    render() {
        const {entries, languages, isRecording, recordedEntries} = this.props.store;
        if (!languages) return <div/>;

        const columns = [<TableHeaderColumn key={"key"} editable={false} isKey
                                            dataField={"key"}>{D('Key')}</TableHeaderColumn>];
        languages.forEach(lang =>
            columns.push(<TableHeaderColumn key={lang.name} editable
                                            dataField={lang.name}>{lang.displayName}</TableHeaderColumn>));
        return (
            <div>
                <BootstrapTable data={entries}
                                pagination
                                search
                                searchText="Test"
                                multiColumnSearch
                                hover
                                cellEdit={{
                                    mode: 'click',
                                    blurToSave: true,
                                    afterSaveCell: this.saveCell
                                }}
                                insertRow
                                options={{
                                    searchText: "test2",
                                    searchField: this.customSearchField,
                                    insertBtn: this.createRecordBtn,
                                    sizePerPage: this.sizePerPage,
                                    pageStartIndex: 1,
                                    page: this.currentPage,
                                    onSizePerPageList: this.onSizePerPageList,
                                    onPageChange: this.onPageChange,
                                    onSortChange: this.onSortChange,
                                    onFilterChange: this.onFilterChange
                                }}>
                    {columns}
                </BootstrapTable>
                {isRecording &&
                <h2>{D('Recorded entries')} <Badge>{recordedEntries.length}</Badge></h2>
                }
                {isRecording &&
                <BootstrapTable key="recordedElements" data={recordedEntries}
                                pagination
                                search
                                multiColumnSearch
                                hover
                                insertRow
                                cellEdit={{
                                    mode: 'click',
                                    blurToSave: true,
                                    afterSaveCell: (row, field, val) => row[field] = val
                                }}
                                options={{
                                    insertBtn: this.createSaveAllRecorded,
                                    searchField: this.customSearchField,
                                }}>
                    {columns}
                </BootstrapTable>
                }
            </div>
        )
    }
}

export default observer(AdminDictionary)

decorate(AdminDictionary, {
    onPageChange: action,
    onSizePerPageList: action,
    editRow: action,

    currentPage: observable,
    sizePerPage: observable,
    editMode: observable,
    selected: observable
});

AdminDictionary.propTypes = {
    store: PropTypes.instanceOf(LanguageStore)
};

AdminDictionary.defaultProps = {};