//modules
import React from 'react';

//misc
import Helper from '../../shared/HelperFunctions';

//controllers
import AdminController from '../../controllers/AdminPageController';
import BookingController from '../../controllers/BookingController';

//components
import BookableItem from './EditBookableItem';
import ClosedPeriod from './ClosedPeriod';
import ClosedPeriodTable from './ClosedPeriodsTable';
import BookableItemTable from './BookableItemTable';



export default class AdminPage extends React.Component {
  bookableItemsTableId = "bookable-items";

  bookableItemTypes = [];

  constructor(props) {
    super(props);
    this.controller = this.props.controller;
    this.bookableItemsTableId = "bookable-items";
    this.state = {
    }
  };








  render() {
    return (
      <div>

        <div>
          <BookableItemTable id="edit-bookable-items" title="Bookable items" createLabel="create bookable item"/>
          <ClosedPeriodTable id="edit-closed-periods" title="Closed periods" createLabel="create closed period"/>
        </div>

      </div>
    );
  }
}
