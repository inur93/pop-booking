// @flow
import React, { Component } from 'react';

import $ from 'jquery'
import FullCalendar from 'fullcalendar' //is used although react console says not.
import 'fullcalendar/dist/fullcalendar.min.css'

const views = {
  day: 'agendaDay',
  week: 'agendaWeek',
  month: 'month'
};
import moment from 'moment'

class Calendar extends Component {

  initFullCalendar = (domNode) => {
    const { view, events, selectable, header, customButtons, defaultDate, nowIndicator, locale } = this.props;
    moment.locale(locale);
    require(`fullcalendar/dist/locale/${locale}`);
    this.calendar = $(domNode);
    $(domNode).fullCalendar({
      view: views[view],
      events,
      selectable,
      header,
      customButtons,
      defaultDate,
      nowIndicator,
      dayClick: this.onDayClick,
      eventClick: this.onEventClick,
      eventAllow: this.eventAllow,
      eventDrop: this.eventDrop,
      select: this.onSelect,
      locale,
      dragRevertDuration: 500,
      dragOpacity: 0.75,
      dragScroll: true,
      eventOverlap: true, //can be a function function(stillEvent, movingEvent)
      eventStartEditable: true,
      eventDurationEditable: true
      
    });
  }

  destroyFullCalendar = () => {
    const { calendar } = this.refs;
    $(calendar).fullCalendar('destroy');
  }

  onSelect = ( start, end, jsEvent, view ) => {
   // const object = $(this);
    if (this.props.onSelect) {
      return this.props.onSelect(start, end, jsEvent, view);
    }
  }
  eventAllow = (dropLocation, draggedEvent) => {
   // const object = $(this);
    if (this.props.eventAllow) {
      return this.props.eventAllow(dropLocation, draggedEvent);
    }
    return false;
  }

  eventDrop = (event, delta, revertFunc, jsEvent, ui, view) => {
    //const object = $(this);
    if (this.props.eventDrop) {
      return this.props.eventDrop(event, delta, revertFunc, jsEvent, ui, view);
    }
  }

  onDayClick = (date, jsEvent, view) => {
    const object = $(this);
    if (this.props.onDayClick) {
      this.props.onDayClick(date, jsEvent, view, object);
    }
  };

  onEventClick = (calEvent, jsEvent, view) => {
    if (this.props.onEventClick) {
      this.props.onEventClick(calEvent, jsEvent, view);
    }
  };

  componentDidMount() {
    const { calendar } = this.refs;
    this.initFullCalendar(calendar);

  }

  componentWillUnmount() {
    this.destroyFullCalendar()
  }

  componentWillReceiveProps = (nextProps) => {
    let events = nextProps.events;

    this.calendar.fullCalendar('changeView', views[nextProps.view]);
    this.calendar.fullCalendar('gotoDate', nextProps.date);
    this.calendar.fullCalendar('removeEvents');
    this.calendar.fullCalendar('addEventSource', events);
  }

  addEventElement = (element) => {
    this.calendar.fullCalendar('addEventSource', element);
  }

  refreshEvents = () => {
    this.calendar.fullCalendar('refetchEvents');
  }

  gotoDay = (date) => {
    this.calendar.fullCalendar('changeView', 'agendaDay', date);
  }

  isMonthView = () => {
    return this.calendar.fullCalendar('getView').currentRangeUnit === "month";
  }

  render() {
    return (<div ref="calendar"></div>);
  }
}
;

Calendar.defaultProps = {
  view: 'month',
  events: [],
  selectable: true,
  header: {
    left: 'agendaDay,basicWeek,month',
    center: 'title',
    right: 'today prev,next',
  },
  customButtons: {},
  defaultDate: null,
  nowIndicator: true,
  locale: 'en-gb',
  eventStartEditable: true,
  eventDurationEditable: true,

};

export default Calendar;
