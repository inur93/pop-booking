import React from 'react';
import Helper from '../../shared/HelperFunctions';
import {observer} from "mobx-react";
import PropTypes from 'prop-types';
import Booking from "../../models/Booking";
import {D} from '../../D';


class BookingList extends React.Component {

    constructor() {
        super();
    }

    render() {
        const {bookings} = this.props;
        if (!bookings || bookings.length === 0) return <div/>;

        return (
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>{D('name')}</th>
                    <th>{D('from')}</th>
                    <th>{D('to')}</th>
                </tr>
                </thead>
                <tbody>
                {bookings.map(b => <BookingRow booking={b} key={b.id}/>)}
                </tbody>
            </table>);
    }
}

export default observer(BookingList);

BookingList.propTypes = {
    bookings: PropTypes.array
}


class BookingRow extends React.Component {
    render() {
        const {bookableItem, dateFrom, dateTo} = this.props.booking;
        let name = bookableItem.name;
        let from = dateFrom;

        from = Helper.getDateAsStringAndFormat(new Date(from));
        let to = dateTo;
        to = Helper.getDateAsStringAndFormat(new Date(to));

        return (<tr>
            <td>{name}</td>
            <td>{from}</td>
            <td>{to}</td>
        </tr>)
    }
}

BookingRow.propTypes = {
    booking: PropTypes.instanceOf(Booking)
}