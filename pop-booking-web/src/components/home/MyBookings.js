import React from 'react';

import BookingController from '../../controllers/BookingController';
import Helper from '../../shared/HelperFunctions';



export default class MyBookings extends React.Component {

    constructor() {
        super();
        this.state = {
            myBookings: [],
            updateBookings: true,
            noBookings: false
        }
    }

    componentDidMount() {
        if (!this.props.showBookings) return;
        if (this.state.updateBookings) {
            this.updateBookings();
        }
    }

    updateBookings = () => {
        BookingController.getMyBookings().then(res => {
            const myBookings = res.map(booking => {
                return <BookingRow booking={booking} key={booking.id} />;
            });
            this.setState({
                myBookings: myBookings,
                updateBookings: false,
                noBookings: myBookings === null | myBookings.length === 0
            });

        }).catch(err => {
            this.setState({
                updateBookings: false,
                noBookings: true
            });
        });
    }

    render() {
        if (!this.props.showBookings || this.state.noBookings) return <div></div>;
        if (this.state.myBookings.length > 0) {
            return (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>name</th>
                            <th>from</th>
                            <th>to</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.myBookings}
                    </tbody>
                </table>);
        } else {
            return (
                this.state.updateBookings ?
                    <div className="loader"></div> :
                    <div></div>
            )
        }
    }
}


class BookingRow extends React.Component {
    render() {
        var name = this.props.booking.bookableItem.name;
        var from = this.props.booking.dateFrom;

        from = Helper.getDateAsStringAndFormat(new Date(from));
        var to = this.props.booking.dateTo;
        to = Helper.getDateAsStringAndFormat(new Date(to));

        return (<tr key={this.props.booking.id}>
            <td>{name}</td>
            <td>{from}</td>
            <td>{to}</td>
        </tr>)
    }
}