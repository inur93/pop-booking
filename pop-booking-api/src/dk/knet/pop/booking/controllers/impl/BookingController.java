package dk.knet.pop.booking.controllers.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

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
import dk.knet.pop.booking.utils.DateUtil;
import dk.knet.pop.booking.viewmodels.ViewBooking;
import lombok.extern.slf4j.Slf4j;

import static dk.knet.pop.booking.configs.ErrorStrings.*;

@Slf4j
public class BookingController {

    private BookingDAO dao = new BookingDAO();
    private ClosedPeriodsDAO closedPeriodDao = new ClosedPeriodsDAO();

    public List<Booking> createMultipleBookings(List<Booking> bookings, BookingUser booker) throws DoubleBookingException, InvalidBookingArgsException {
        //validate all before saving and set booker
        for (Booking b : bookings) {
            b.setBooker(booker); //assign booker before validation, otherwise it will fail
            isBookingValid(b);
        }
        List<Booking> saved = new ArrayList<>();
        //now save them all
        for(Booking b : bookings){
            saved.add(dao.create(b));
        }
        return saved;
    }

    public Booking createBooking(Booking booking) throws DoubleBookingException, InvalidBookingArgsException {
        if (isBookingValid(booking)) {
            return dao.create(booking);
        }
        return null;
    }

    public List<Booking> getBookings(Date from, Date to, BookingType type) {
        BookingDAO dao = new BookingDAO();
        ////System.out.println("get bookings of type " + type + " from " + from + " to " + to);
        List<Booking> bookings = dao.getBookings(from, to, type);
        for (Booking b : bookings) {
            if (b.getDateFrom().before(new Date())) {
                b.setEditable(false);
            } else {
                b.setEditable(true);
            }
        }
        return bookings.stream().map(ViewBooking::new).collect(Collectors.toList());
    }


    public void deleteBooking(long bookingId, BookingUser user) throws BasicException {
        Booking booking = dao.getById(bookingId);
        boolean authException = false;
        try {
            if (isBookingValid(booking)) {
                if (booking.getBooker().getId().equals(user.getId())) {
                    dao.delete(booking);
                    return;
                } else {
                    authException = true;
                }
            }
        } catch (BasicException exception) {
            log.warn("tried to delete invalid booking: " + (booking == null ? "null" : booking.toString()));
        }
        if (authException) {
            throw new AuthorizationException(Status.UNAUTHORIZED, "You are not allowed to delete this booking");
        } else {
            throw new BasicException(Status.BAD_REQUEST, "The booking can no longer be deleted");
        }
    }

    public Booking updateBooking(Booking booking, BookingUser user) throws BasicException {
        Booking existing = dao.getById(booking.getId());
        if (existing.getBooker().getId().equals(user.getId())) {
            if (isBookingValid(booking)) {
                return dao.createOrUpdate(booking);
            }else{
                throw new BasicException(Status.BAD_REQUEST, "Invalid booking.");
            }
        } else {
            throw new AuthorizationException(Status.UNAUTHORIZED, "Permission denied");
        }
    }

    private boolean isBookingValid(Booking booking) throws InvalidBookingArgsException, DoubleBookingException {
        if (booking == null) throw new InvalidBookingArgsException("Booking has no data. Booking was null");
        if (booking.getBookableItem() == null)
            throw new InvalidBookingArgsException(String.format("Booking '%s' has no bookable item attached"));
        if(booking.getBooker() == null) throw new InvalidBookingArgsException(
                String.format("'%s' has no valid booker. Please contact admins",
                        booking.getBookableItem().getName()));
        if (booking.getDateFrom() == null)
            throw new InvalidBookingArgsException(String.format("Booking '%s' has no from date", booking.getBookableItem().getName()));
        if (booking.getDateTo() == null)
            throw new InvalidBookingArgsException(String.format("Booking '%s' has no to date", booking.getBookableItem().getName()));

        int diff = booking.getDateTo().compareTo(booking.getDateFrom()); //diff between from and to
        int diffNow = new Date().compareTo(booking.getDateFrom()); //diff between from and now

        long bookingDuration = booking.getDateTo().getTime() - booking.getDateFrom().getTime();
        long bookingDurationHours = bookingDuration / 1000 / 60 / 60;


        if (booking.getBookableItem().getMaxBookableHours() < bookingDurationHours) {
            throw new InvalidBookingArgsException(String.format("'%s' can not be booked for longer than %s hours",
                    booking.getBookableItem().getName(),
                    booking.getBookableItem().getMaxBookableHours()));
        }
        //check if booking is made in past time
        if (diffNow > 0) {
            throw new InvalidBookingArgsException("You can not book in the past");
        }
        //check if dates are in right order
        if (diff < 0) {
            throw new InvalidBookingArgsException("Booking dates are invalid");
        }
        long dateToMilliseconds = booking.getDateTo().getTime();
        long dateFromMilliseconds = booking.getDateFrom().getTime();
        //check if booking time span is large enough (min 30 minutes)
        if (dateToMilliseconds - dateFromMilliseconds < 1000 * 60 * 30) {
            throw new InvalidBookingArgsException(String.format("'%s' should be booked for a minimum of 30 minutes", booking.getBookableItem().getName()));
        }

        List<Booking> existing = dao.getExistingBookings(booking.getDateFrom(), booking.getDateTo(), booking.getBookableItem());
        boolean bookingUpdate = false;
        if (existing.size() == 1) {
            if (existing.get(0).getId() == booking.getId()) {
                bookingUpdate = true;
            }
        }
        if (!existing.isEmpty() && !bookingUpdate) {
            Booking selectedExisting = null;
            for (Booking e : existing) {
                if (e.getId() != booking.getId()) {
                    selectedExisting = e;
                }
            }
            //if the existing booking could not be resolved a more generic exception is thrown - this should however not happen
            if (selectedExisting == null) {
                throw new DoubleBookingException(
                        String.format("'%s' is already booking during the given period",
                                booking.getBookableItem().getName()));
            }

            throw new DoubleBookingException(String.format("'%s' is already booked between '%s and '%s'",
                    booking.getBookableItem().getName(),
                    DateUtil.formatDate(selectedExisting.getDateFrom()),
                    DateUtil.formatDate(selectedExisting.getDateTo())));
        }

        List<ClosedPeriod> closedPeriods = closedPeriodDao.getByType(booking.getBookableItem().getBookingType(), booking.getDateFrom(), booking.getDateTo());
        if (closedPeriods == null && closedPeriods.size() > 0) {
            throw new InvalidBookingArgsException(
                    String.format("Booking of '%s' has been closed during this period",
                            booking.getBookableItem().getName()));
        }
        return true;
    }

    public List<Booking> getBookings(long userId, Date from) {
        List<Booking> bookings = dao.getBookingsByUser(userId, from);
        if(bookings != null){
            bookings = bookings.stream().map(ViewBooking::new).collect(Collectors.toList());
        }
        return bookings;
    }
}
