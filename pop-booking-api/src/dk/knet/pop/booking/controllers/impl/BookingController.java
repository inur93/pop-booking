package dk.knet.pop.booking.controllers.impl;

import java.util.Date;
import java.util.List;

import javax.ws.rs.core.Response.Status;

import dk.knet.pop.booking.database.BookingDAO;
import dk.knet.pop.booking.database.ClosedPeriodsDAO;
import dk.knet.pop.booking.exceptions.AuthorizationException;
import dk.knet.pop.booking.exceptions.BasicException;
import dk.knet.pop.booking.exceptions.DoubleBookingException;
import dk.knet.pop.booking.exceptions.InvalidBookingArgsException;
import dk.knet.pop.booking.models.Booking;
import dk.knet.pop.booking.models.BookingType;
import dk.knet.pop.booking.models.BookingUser;
import dk.knet.pop.booking.models.ClosedPeriod;
import lombok.extern.slf4j.Slf4j;

import static dk.knet.pop.booking.configs.ErrorStrings.*;

@Slf4j
public class BookingController {

	private BookingDAO dao = new BookingDAO();
	private ClosedPeriodsDAO closedPeriodDao = new ClosedPeriodsDAO();

	public Booking createBooking(Booking booking) throws DoubleBookingException, InvalidBookingArgsException{
		if(isBookingValid(booking)){
			return dao.create(booking);
		}
		return null;
	}

	public List<Booking> getBookings(Date from, Date to, BookingType type){
		BookingDAO dao = new BookingDAO();
		////System.out.println("get bookings of type " + type + " from " + from + " to " + to);
		List<Booking> bookings = dao.getBookings(from, to, type);
		for(Booking b : bookings){
			if(b.getDateFrom().before(new Date())){
				b.setEditable(false);
			}else{
				b.setEditable(true);
			}
		}
		return bookings;
	}


	public void deleteBooking(long bookingId, BookingUser user) throws BasicException{
		Booking booking = dao.getById(bookingId);
		boolean authException = false;
		try {
			if (isBookingValid(booking)){
				if(booking.getBooker().getId().equals(user.getId())){
					dao.delete(booking);
					return;
				}else{
					authException = true;
				}
			}
		}catch (BasicException exception){
			log.warn("tried to delete invalid booking: " + (booking == null ? "null": booking.toString()));
		}
		if(authException){
			throw new AuthorizationException(Status.UNAUTHORIZED, "You are not allowed to delete this booking");
		}else {
			throw new BasicException(Status.BAD_REQUEST, "The booking can no longer be deleted");
		}
	}

	public Booking updateBooking(Booking booking, BookingUser user) throws BasicException{
		Booking existing = dao.getById(booking.getId());
		if(existing.getBooker().getId().equals(user.getId())){
			if(isBookingValid(booking)){
				return dao.createOrUpdate(booking);
			}
		}else{
			throw new AuthorizationException(Status.UNAUTHORIZED, ERROR_AUTHENTICATION_PERMISSION_DENIED);
		}
		throw new BasicException(Status.BAD_REQUEST, ERROR_SERVER_UNKNOWN);
	}

	private boolean isBookingValid(Booking booking) throws InvalidBookingArgsException, DoubleBookingException{
		if(booking == null) throw new InvalidBookingArgsException(ERROR_SERVER_UNKNOWN);
		if(booking.getDateFrom() == null) throw new InvalidBookingArgsException(ERROR_BOOKING_INVALID);
		if(booking.getDateTo() == null) throw new InvalidBookingArgsException(ERROR_BOOKING_INVALID);
		int diff = booking.getDateTo().compareTo(booking.getDateFrom()); //diff between from and to
		int diffNow = new Date().compareTo(booking.getDateFrom()); //diff between from and now

		long bookingDuration = booking.getDateTo().getTime() - booking.getDateFrom().getTime();
		long bookingDurationHours = bookingDuration/1000/60/60;

		if(booking.getBookableItem() == null) throw new InvalidBookingArgsException("Bookable item is invalid");
		if(booking.getBookableItem().getMaxBookableHours() < bookingDurationHours) throw new InvalidBookingArgsException("This unit can not be booked for this long");

		//check if booking is made in past time
		if(diffNow > 0){
			throw new InvalidBookingArgsException(ERROR_BOOKING_IN_THE_PAST);
		}
		//check if dates are in right order
		if(diff <= 0){
			throw new InvalidBookingArgsException(ERROR_BOOKING_INVALID);
		}
		long dateToMilliseconds = booking.getDateTo().getTime();
		long dateFromMilliseconds = booking.getDateFrom().getTime();
		//check if booking time span is large enough (min 1 hour)
		if(dateToMilliseconds - dateFromMilliseconds < 1000*60*60){
			throw new InvalidBookingArgsException(ERROR_BOOKING_TOO_SHORT);
		}

		List<Booking> existing = dao.getExistingBookings(booking.getDateFrom(), booking.getDateTo(), booking.getBookableItem());
		boolean bookingUpdate = false;
		if(existing.size() == 1){
			if(existing.get(0).getId() == booking.getId()){
				bookingUpdate = true;
			}
		}
		if(!existing.isEmpty() && !bookingUpdate){
			throw new DoubleBookingException(ERROR_BOOKING_EXISTS);
		}
		
		List<ClosedPeriod> closedPeriods = closedPeriodDao.getByType(booking.getBookableItem().getBookingType(), booking.getDateFrom(), booking.getDateTo());
		if(closedPeriods == null && closedPeriods.size() > 0){
			throw new InvalidBookingArgsException(ERROR_BOOKING_INVALID_PERIOD);
		}
		return true;
	}

	public List<Booking> getBookings(long userId, Date from) {
		return dao.getBookingsByUser(userId, from);
	}
}
