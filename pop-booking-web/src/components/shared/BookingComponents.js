import React from 'react';
import TimePicker from 'react-bootstrap-time-picker';
import { DateField, DatePicker } from 'react-date-picker';
import 'react-date-picker/index.css';

//misc
import Helper from '../../shared/HelperFunctions';

//components

//controllers
import BookingController from '../../controllers/BookingController';
import BookableObjectController from '../../controllers/BookableObjectsController';

export class SelectTime extends React.Component {
    constructor(props) {
        super(props);
        var time = 3600 * 8;
        if (props.time || props.time === 0) time = props.time;
        this.state = {
            time: time
        }
    }

    updateTime = (time) => {
        this.setState({ time });
        this.props.onChange(time);
    }
    render() {
        if (this.props.time !== this.state.time) {
            this.state.time = this.props.time;
        }
        return (
            <TimePicker
                id={this.props.id}
                name={this.props.id}
                start={this.props.startTime}
                end={this.props.endTime}
                format={24}
                step={15}
                onChange={this.updateTime}
                value={this.state.time} />
        );
    }
}

export class SelectDate extends React.Component {
    constructor(props) {
        super(props);
        var defDate = new Date().getTime();
        defDate = defDate - defDate % (3600 * 1000);
        defDate = Helper.getDateAsString(defDate);
        this.lastDate = defDate;

        this.state = {
            date: props.date || defDate,
        }
    }

    updateDate = (date, dateMoment) => {
        this.setState({ date });
        this.props.onChange(new Date(date).getTime());
    }

    render() {
        if (this.props.date !== this.state.date) {
            this.state.date = this.props.date;
        }
        return (

            <DateField
                id={this.props.id}
                className="form-control"
                dateFormat="YYYY-MM-DD"
                forceValidDate={true}
                updateOnDateClick={true}
                collapseOnDateClick={true}
                defaultValue={Date.now()}
                showClock={false}
                value={this.state.date}
                onChange={this.updateDate}>
                <DatePicker
                    navigation={true}
                    locale="da"
                    forceValidDate={true}
                    highlightWeekends={true}
                    highlightToday={true}
                    weekNumbers={true}
                    footer={false}
                    weekStartDay={1} />
            </DateField>
        );
    }
}

export class SelectBookable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookableObjects: [],
            selected: {}
        };
    }

    handleBookableSelect = (proxy) => {
        const value = proxy.target.value;
        var selectedBookableObject = this.state.bookableObjects.find(x => x.name === value);
        this.setState({ selected: value });
        this.props.onChange(selectedBookableObject);
    }

    componentDidMount() {
        BookableObjectController.getBookableItemsByType(this.props.id)
            .then(res => {
                const bookableObjects = res;
                this.setState({ bookableObjects });
                var selectedBookableObject = bookableObjects[0];
                if(this.props.selected){
                    selectedBookableObject = bookableObjects.find(item => item.name === this.props.selected);
                }
                this.props.onChange(selectedBookableObject);
                this.setState({ selected:  selectedBookableObject.name});
            });
    }
    render() {
        return (
            <div>
                <label htmlFor={this.props.id} className="control-label">
                    {this.props.label}
                </label>
                <select
                    name={this.props.id + "selctBookable"}
                    id={this.props.id + "selctBookable"}
                    value={this.state.selected}
                    className="form-control"
                    onChange={this.handleBookableSelect}>
                    {this.state
                        .bookableObjects
                        .map(obj => <option key={obj.name} value={obj.name}>{obj.name}</option>)}
                </select>
            </div>
        );
    }
}