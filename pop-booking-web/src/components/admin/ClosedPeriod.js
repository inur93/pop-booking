import React from 'react';
import 'jquery';
//controllers


export default class ClosedPeriod extends React.Component {
    constructor(props) {
        super(props);

        var defDate = Date.now();
        defDate = defDate - defDate % (3600 * 1000);

        var applicableToTypes = (props.applicableToTypes || [])
            .map(el => {
                return {
                    id: el,
                    value: el
                }
            });
        var applicableToItems = (props.applicableToItems || [])
            .map(el => {
                return {
                    id: el.id,
                    value: el.name
                }
            });
        this.state = {
            editMode: props.createNew || false,
            createNew: props.createNew || false, // if props.createNew = undefined, createNew will be false
            dirty: false,


            name: props.name || "",
            start: props.start || defDate,
            end: props.end || defDate,
            applicableToTypes: applicableToTypes,
            applicableToItems: applicableToItems,

            old_name: props.name || "",
            old_start: props.start || defDate,
            old_end: props.end || defDate,
            old_applicableToTypes: applicableToTypes,
            old_applicableToItems: applicableToItems
        }
    }

    isDirty = (elements) => {
        var start_dirty, name_dirty, end_dirty, types_dirty, items_dirty;
        //name
        if (elements.name || elements.name === "") {
            name_dirty = this.state.old_name !== elements.name;
        } else {
            name_dirty = this.state.name !== this.state.old_name;
        }
        //start
        if (elements.start) {
            start_dirty = this.state.old_start !== elements.start;
        } else {
            start_dirty = this.state.start !== this.state.old_start;
        }
        //end
        if (elements.end) {
            end_dirty = this.state.old_end !== elements.end;
        } else {
            end_dirty = this.state.end !== this.state.old_end;
        }
        //items
        var currentItems = this.state.old_applicableToItems;
        var newItems = elements.applicableToItems || this.state.applicableToItems;
        items_dirty = !this.arrayEquals(currentItems, newItems);

        //types
        var currentTypes = this.state.old_applicableToTypes;
        var newTypes = elements.applicableToTypes || this.state.applicableToTypes;
        types_dirty = !this.arrayEquals(currentTypes, newTypes);

        return end_dirty || name_dirty || start_dirty || items_dirty || types_dirty;
    }

    arrayEquals = (currentItems, newItems) => {
        var sameLength = currentItems.length === newItems.length;
        var elementsMismatch = false;
        newItems.forEach(
            el => {
                if (!currentItems.find(x => x.id === el.id && x)) elementsMismatch = true;
            });
        return sameLength && !elementsMismatch;
    }

    setEditMode = () => {
        this.setState({
            editMode: true
        });
    }

    saveRow = () => {
        if (this.props.createNew) {
            this.props.onCreated(this.getItem());
        } else {
            this.props.onUpdated(this.getItem()).then(res => {
                this.itemUpdated()
            });
        }
    }

    itemUpdated = () => {
        this.setState({
            editMode: false,
            old_name: self.state.name,
            old_start: self.state.start,
            old_end: self.state.end,
            old_applicableToItems: self.state.applicableToItems,
            old_applicableToTypes: self.state.applicableToTypes,
            dirty: false
        });
    }

    cancelChanges = () => {
        if (this.props.createNew) {
            this.props.onCancelNew();
        } else {
            this.setState({
                name: this.state.old_name,
                color: this.state.old_color,
                type: this.state.old_type,
                start: this.state.old_start,
                end: this.state.old_end,
                applicableToItems: this.state.old_applicableToItems,
                applicableToTypes: this.state.old_applicableToTypes,
                dirty: false,
                editMode: false
            });
        }
    }

    getItem = () => {
        var types = this.state.applicableToTypes.map(el => el.id);
        var items = [];
        this.state.applicableToItems.forEach(key =>
            items.push(
                this.props.itemOptions.find(el => el.id == key.id)
                    .element
            )
        );
        return {
            id: this.props.id,
            title: this.state.name,
            start: this.state.start,
            end: this.state.end,
            applyToTypes: types,
            applyToItems: items,
        };
    }

    onBookableItemTypeChanged = (event) => {
        const value = event.target.value;
        var dirty = this.isDirty({ type: value });
        this.setState({
            type: value,
            dirty: dirty
        });
    }

    onColorChanged = (color) => {
        var dirty = this.isDirty({ color: color.hex });
        this.setState({
            color: color.hex,
            dirty: dirty
        });

    }

    onNameChanged = (event) => {
        var value = event.target.value;
        var dirty = this.isDirty({ name: value });

        this.setState({
            name: value,
            dirty: dirty
        });
    }

    onStartChanged = (date) => {
        var dirty = this.isDirty({ start: date });
        this.setState({
            start: date,
            dirty: dirty
        });
    }

    onEndChanged = (date) => {
        var dirty = this.isDirty({ end: date });
        this.setState({
            end: date,
            dirty: dirty
        })
    }

    onTypesChanged = (types) => {
        var dirty = this.isDirty({ applicableToTypes: types });
        this.setState({
            applicableToTypes: types,
            dirty: dirty
        });
    }

    onItemsChanged = (items) => {
        var dirty = this.isDirty({ applicableToItems: items });
        this.setState({
            applicableToItems: items,
            dirty: dirty
        });
    }

    removeRow = () => {
        this.props.onDeleted(this.props.id);
    }

    typeListToString = (list) => {
        if (!list) return "";
        var hasValue = list.length > 0;
        var valueStr = "";
        if (hasValue) {
            var values = list.sort((a, b) => a.value > b.value);

            values.forEach(el => valueStr += el.value + ", ");
            valueStr = valueStr.substr(0, valueStr.length - 2);
        }
        return valueStr;
    }

    itemListToString = (list) => {
        if (!list) return "";
        var hasValue = list.length > 0;
        var valueStr = "";
        if (hasValue) {
            var values = list.sort((a, b) => a.value > b.value);

            values.forEach(el => valueStr += el.value + ", ");
            valueStr = valueStr.substr(0, valueStr.length - 2);
        }

        return valueStr;
    }

    render() {
        return (
            <tr id={this.props.id} >
                <td onClick={this.setEditMode}>
                    {this.state.editMode ?
                        <input id="closed-period-name" className="form-control" onChange={this.onNameChanged} value={this.state.name} /> :
                        this.state.old_name}
                </td>

               {/* <td onClick={this.setEditMode} >
                    {this.state.editMode ?
                        <SelectDate date={this.state.start} onChange={this.onStartChanged} /> :
                        Helper.getDateAsString(this.state.old_start)
                    }
                </td>*/}
               {/* <td onClick={this.setEditMode} >
                    {this.state.editMode ?
                        <SelectDate date={this.state.end} onChange={this.onEndChanged} /> :
                        Helper.getDateAsString(this.state.old_end)
                    }
                </td>*/}
              {/*  <td onClick={this.setEditMode}> {this.state.editMode ?

                    <Select key={"0" + this.props.id}
                        placeholder="Select types"
                        selected={this.state.applicableToTypes}
                        options={this.props.typeOptions}
                        onChange={this.onTypesChanged} />
                    : this.typeListToString(this.state.old_applicableToTypes)}
                </td>*/}

               {/* <td onClick={this.setEditMode}> {this.state.editMode ?

                    <Select key={"1" + this.props.id}
                        placeholder="Select items"
                        selected={this.state.applicableToItems}
                        options={this.props.itemOptions}
                        onChange={this.onItemsChanged} />
                    : this.itemListToString(this.state.old_applicableToItems)
                }
                </td>*/}

                <td>
                    {this.state.dirty && this.state.editMode &&
                        <a href="#" onClick={this.saveRow} data-toggle="tooltip" title="save">
                            <span className="glyphicon glyphicon-floppy-save" />
                        </a>
                    }
                    {!this.props.createNew &&
                        <a href="#" onClick={this.removeRow} data-toggle="tooltip" title="delete">
                            <span className="glyphicon glyphicon-trash" />
                        </a>
                    }
                    {this.state.editMode &&
                        <a href="#" onClick={this.cancelChanges} data-toggle="tooltip" title="cancel">
                            <span className="glyphicon glyphicon-remove" />
                        </a>
                    }

                    {!this.state.editMode &&
                        <a data-toggle="tooltip" title="Click on row to edit">
                            <span className="glyphicon glyphicon-question-sign" />
                        </a>
                    }

                </td>
            </tr>
        );
    }
}