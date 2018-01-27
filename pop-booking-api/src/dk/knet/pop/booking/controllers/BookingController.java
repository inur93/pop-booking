package dk.knet.pop.booking.controllers;

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

public class BookingController {

	private BookingDAO dao = new BookingDAO();
	private ClosedPeriodsDAO closedPeriodDao = new ClosedPeriodsDAO();

	public void createBooking(Booking booking) throws DoubleBookingException, InvalidBookingArgsException{
		if(isBookingValid(booking)){
			dao.createBooking(booking);
		}
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
		Booking booking = dao.getBookingById(bookingId);
		if(booking.getBooker().getId().equals(user.getId())){
			dao.deleteBooking(booking);
		}else{
			throw new AuthorizationException(Status.UNAUTHORIZED, "Booking is not owned by user");
		}
	}

	public void updateBooking(Booking booking, BookingUser user) throws BasicException{
		Booking existing = dao.getBookingById(booking.getId());
		if(existing.getBooker().getId().equals(user.getId())){
			if(isBookingValid(booking)){
				dao.updateBooking(booking);
			}
		}else{
			throw new AuthorizationException(Status.UNAUTHORIZED, "Booking is not owned by user");
		}
	}

	private boolean isBookingValid(Booking booking) throws InvalidBookingArgsException, DoubleBookingException{
		if(booking == null) throw new InvalidBookingArgsException("Booking was null");
		if(booking.getDateFrom() == null) throw new InvalidBookingArgsException("From date was null");
		if(booking.getDateTo() == null) throw new InvalidBookingArgsException("Date to was null");
		int diff = booking.getDateTo().compareTo(booking.getDateFrom()); //diff between from and to
		int diffNow = new Date().compareTo(booking.getDateFrom()); //diff between from and now

		//check if booking is made in past time
		if(diffNow > 0){
			throw new InvalidBookingArgsException("Booking can not be made in the past.");
		}
		//check if dates are in right order
		if(diff <= 0){
			throw new InvalidBookingArgsException("The to date can not be before or the same as the from date.");
		}
		long dateToMilliseconds = booking.getDateTo().getTime();
		long dateFromMilliseconds = booking.getDateFrom().getTime();
		//check if booking time span is large enough (min 1 hour)
		if(dateToMilliseconds - dateFromMilliseconds < 1000*60*60){
			throw new InvalidBookingArgsException("You have to book a minium of 1 hour");
		}

		List<Booking> existing = dao.getExistingBookings(booking.getDateFrom(), booking.getDateTo(), booking.getBookableItem());
		boolean bookingUpdate = false;
		if(existing.size() == 1){
			if(existing.get(0).getId() == booking.getId()){
				bookingUpdate = true;
			}
		}
		if(!existing.isEmpty() && !bookingUpdate){
			throw new DoubleBookingException("Booking already exists");
		}
		
		List<ClosedPeriod> closedPeriods = closedPeriodDao.getByType(booking.getBookableItem().getBookingType(), booking.getDateFrom(), booking.getDateTo());
		if(closedPeriods == null || closedPeriods.size() == 0){
			throw new InvalidBookingArgsException("Bookings are not possible during this period.");
		}
		return true;
	}

	public List<Booking> getBookings(long userId, Date from) {
		return dao.getBookingsByUser(userId, from);
	}
}
