import React from 'react';
import 'jquery';
import { ChromePicker } from 'react-color';

//misc

//components

//controllers
// import BookingController from '../../controllers/BookingController';
// import BookableObjectController from '../../controllers/BookableObjectsController';



export default class BookableItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: props.createNew || false,
      createNew: props.createNew || false, // if props.createNew = undefined, createNew will be false
      dirty: false,
      old_name: props.name || "",
      old_type: props.type || props.typeList[0],
      old_color: props.color || "",
      name: props.name || "",
      color: props.color || "",
      type: props.type || props.typeList[0]
    }
  }

  isDirty = (elements) => {
    var type_dirty, name_dirty, color_dirty;
    if (elements.name) {
      name_dirty = this.state.old_name !== elements.name;
    } else {
      name_dirty = this.state.name !== this.state.old_name;
    }
    if (elements.color) {
      color_dirty = this.state.old_color !== elements.color;
    } else {
      color_dirty = this.state.color !== this.state.old_color;
    }
    if (elements.type) {
      type_dirty = this.state.old_type !== elements.type;
    } else {
      type_dirty = this.state.type !== this.state.old_type;
    }
    return type_dirty || name_dirty || color_dirty;
  }

  setEditMode = () => {
    this.setState({
      editMode: true
    });
  }

  saveRow = () => {
    if (this.props.createNew) {
      this.props.onItemCreated(this.getItem());
    } else {
      this.props.onItemUpdated(this.getItem()).then(res => {
        this.itemUpdated()
      });
    }
  }

  itemUpdated = () => {
    this.setState({
      editMode: false,
      old_name: this.state.name,
      old_color: this.state.color,
      old_type: this.state.type,
      dirty: false
    })
  }

  cancelChanges = () => {
    if (this.props.createNew) {
      this.props.onCancelNew();
    } else {
      this.setState({
        name: this.state.old_name,
        color: this.state.old_color,
        type: this.state.old_type,
        dirty: false,
        editMode: false
      });
    }
  }

  getItem = () => {
    return {
      id: this.props.id,
      name: this.state.name,
      color: this.state.color,
      bookingType: this.state.type
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

  removeRow = () => {
    this.props.onItemDeleted(this.props.id);
  }
  render() {
    return (
      <tr id={this.props.id} >
        <td onClick={this.setEditMode}>
          {this.state.editMode ?
            <input className="form-control" id="name" onChange={this.onNameChanged} value={this.state.name} /> :
            this.state.old_name}
        </td>

        <td onClick={this.setEditMode} style={{ backgroundColor: this.state.color }}>
          {this.state.editMode ?
            <ChromePicker id="color" onChange={this.onColorChanged} color={this.state.color} disableAlpha="true" /> :
            this.state.old_color}
        </td>

        <td onClick={this.setEditMode}> {this.state.editMode ?
          <select
            value={this.state.type}
            className="form-control"
            onChange={this.onBookableItemTypeChanged}>
            {this.props.typeList.map(obj => <option key={obj} value={obj}>{obj}</option>)}
          </select>
          : this.state.old_type}
        </td>

        <td>
          {this.state.dirty && this.state.editMode &&
            <a href="#" onClick={this.saveRow} data-toggle="tooltip" title="save">
              <span className="glyphicon glyphicon-floppy-save" />
            </a>
          }
          {!this.props.createNew && !this.state.editMode &&
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