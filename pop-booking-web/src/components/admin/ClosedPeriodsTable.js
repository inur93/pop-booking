import React from 'react';
import Helper from '../../shared/HelperFunctions';
import 'jquery';
//controllers
import AdminController from '../../controllers/AdminPageController';
//components
import ClosedPeriod from './ClosedPeriod';


export default class ClosedPeriodsTable extends React.Component {
    closedPeriodsTableId = "closed-periods";

    constructor(props) {
        super(props);
        this.state = {
            create: false,
            loading: true,
            closedPeriods: [],
            applicableItemsOptions: [],
            applicableTypesOptions: []
        }
    }

    componentDidMount() {
        this.updateLists();
    }

    updateLists = () => {
        let self = this;

        AdminController.getClosedPeriods().then(
            items => items.map(function (item) {
                return self.mapPeriodToJSXElement(item);
            })).then(items => this.setState({
                closedPeriods: items,
                loading: false
            }));

        AdminController.getApplicableTypesOptions().then(items => {
            this.setState({
                typeOptions: items
            }
            )
        });
        AdminController.getApplicableItemsOptions().then(items => {
            this.setState({
                itemOptions: items
            })
        });

    }

    mapPeriodToJSXElement = (item) => {
        
        return <ClosedPeriod
            id={item.id}
            key={item.id || ""}
            createNew={false}
            onUpdated={this.periodUpdated}
            onDeleted={this.periodDeleted}
            name={item.title}
            start={item.start}
            end={item.end}
            applicableToTypes={item.applyToTypes}
            applicableToItems={item.applyToItems}
            typeOptions={this.state.typeOptions}
            itemOptions={this.state.itemOptions} />;
    }

    sortClosedPeriods = (column) => {
        Helper.sortTable(this.closedPeriodsTableId, column);
    }

    periodCreated = (item) => {
        return AdminController.createClosedPeriod(item)
            .then(res => {
                let list = this.state.closedPeriods;
                list.push(this.mapPeriodToJSXElement(res));
                this.setState({
                    closedPeriods: list,
                    create: false
                });
            });
    }

    periodUpdated = (item) => {
        return AdminController.updateClosedPeriod(item)
            .then(res => { this.setState({ create: false }) });
    }

    periodDeleted = (id) => {
        return AdminController.deleteClosedPeriod(id)
            .then(res => {
                let list = this.state.closedPeriods;
                list = list.filter(function (item) {
                    return id !== item.props.id;
                });
                this.setState({
                    closedPeriods: list
                });
            });
    }

    setCreateMode = () => {
        this.setState({
            create: true
        });
    }
    cancelCreateMode = () => {
        this.setState({
            create: false
        });
    }

    render() {
        return (
            <div>
                <div className="panel-heading">
                    <h4 className="panel-title">
                        <a className="collapse-link" data-toggle="collapse" href="#collapse-closed-periods">
                            Closed periods
              {this.state.loading && <div className="loader small"></div>}
                        </a>
                    </h4>
                </div>
                <div id="collapse-closed-periods" className="panel-collapse">
                    <table id={this.closedPeriodsTableId} className="table table-striped">
                        <thead>
                            <tr>
                                <th onClick={() => this.sortClosedPeriods(0)}>name</th>
                                <th onClick={() => this.sortClosedPeriods(1)}>from</th>
                                <th onClick={() => this.sortClosedPeriods(2)}>to</th>
                                <th onClick={() => this.sortClosedPeriods(3)}>Applicable for types</th>
                                <th onClick={() => this.sortClosedPeriods(4)}>Applicable for items</th>

                                <th> action </th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.closedPeriods}

                            {this.state.create &&
                                <ClosedPeriod
                                    createNew={true}
                                    onCancelNew={this.cancelCreateMode}
                                    onCreated={this.periodCreated}
                                    typeOptions={this.state.typeOptions}
                                    itemOptions={this.state.itemOptions} />
                            }
                            {!this.state.create &&
                                <tr>
                                    <td colSpan={6}>
                                        <a href="#" onClick={this.setCreateMode}>create closed period</a>
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