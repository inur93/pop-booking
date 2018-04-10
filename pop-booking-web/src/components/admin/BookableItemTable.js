import React from 'react';

//misc
import Helper from '../../shared/HelperFunctions';

//components
import BookableItem from './EditBookableItem';

//controllers
import AdminController from '../../controllers/AdminPageController';
import BookingController from '../../controllers/BookingStore';
import BookableObjectController from '../../controllers/BookableObjectsStore';

export default class BookableItemTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            createItem: false,
            bookableItems: []
        }
    }

    componentDidMount() {
        BookableObjectController.getBookableItemTypes()
            .then(response => {
                this.bookableItemTypes = response;
                this.updateLists();
            });

    }

    updateLists = () => {
        let self = this;
        BookableObjectController.getAllBookableItems().then(items => items.map(function (item) {
            return self.mapItemToJSXElement(item);
        })).then(items => this.setState({
            bookableItems: items,
            loading: false
        }));
    }

    mapItemToJSXElement = (item) => {
        return <BookableItem
            id={item.id}
            key={item.id || ""}
            name={item.name}
            color={item.color}
            type={item.bookingType}
            typeList={this.bookableItemTypes}
            onItemUpdated={this.itemUpdated}
            onItemDeleted={this.itemDeleted}
            onCancelNew={this.cancelCreateMode}
        />;
    }

    sortBookableItems = (column) => {
        Helper.sortTable(this.bookableItemsTableId, column);
    }

    itemCreated = (item) => {
        return BookableObjectController.createBookableItem(item)
            .then(res => {
                let list = this.state.bookableItems;
                list.push(this.mapItemToJSXElement(res));
                this.setState({
                    bookableItems: list,
                    createItem: false
                });
            });
    }

    itemUpdated = (item) => {
        return BookableObjectController.updateBookableItem(item)
            .then(res => this.setState({ createItem: false }));
    }

    itemDeleted = (id) => {
        return BookableObjectController.deleteBookableItem(id)
            .then(res => {
                let list = this.state.bookableItems;
                list = list.filter(function (item) {
                    return id !== item.props.id;
                });
                this.setState({
                    bookableItems: list
                });
            });

    }

    setCreateMode = () => {
        this.setState({
            createItem: true
        });
    }
    cancelCreateMode = () => {
        this.setState({
            createItem: false
        });
    }

    render() {
        return (
            <div>
                <div className="panel-heading">
                    <h4 className="panel-title">
                        <a className="collapse-link" data-toggle="collapse" href="#collapse-bookable-items">
                            {this.props.title}
                            {this.state.loading && <div className="loader small"></div>}
                        </a>
                    </h4>
                </div>
                <div id="collapse-bookable-items" className="panel-collapse">
                    <table id={this.props.id} className="table table-striped">
                        <thead>
                            <tr>
                                <th onClick={() => this.sortBookableItems(0)}>name</th>
                                <th onClick={() => this.sortBookableItems(1)}>color</th>
                                <th onClick={() => this.sortBookableItems(2)}>type</th>
                                <th> action </th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.bookableItems}

                            {
                                this.state.createItem && <BookableItem
                                    createNew={true}
                                    onItemCreated={this.itemCreated}
                                    onCancelNew={this.cancelCreateMode}
                                    typeList={this.bookableItemTypes} />
                            }
                            {
                                !this.state.createItem &&
                                <tr>
                                    <td colSpan="4">
                                        <a href="#" onClick={this.setCreateMode}>{this.props.createLabel}</a>
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}


