package dk.knet.pop.booking.services.rest;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import dk.knet.pop.booking.controllers.ControllerRegistry;
import dk.knet.pop.booking.controllers.impl.BookingController;
import dk.knet.pop.booking.exceptions.BasicException;
import dk.knet.pop.booking.models.Booking;
import dk.knet.pop.booking.models.BookingUser;
import dk.knet.pop.booking.models.Role;
import dk.knet.pop.booking.viewmodels.ViewBooking;

import static dk.knet.pop.booking.configs.ErrorStrings.ERROR_BOOKING_UNKNOWN;
import static dk.knet.pop.booking.configs.ErrorStrings.ERROR_USER_INVALID;

@Path("/v1/bookings")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BookingService extends ProtectedService {

	private BookingController bookingController = ControllerRegistry.getBookingController();

	@GET
	@Path("/self")
	public List<Booking> getBookings(@DefaultValue(value="0") @QueryParam("fromDate") long from) throws BasicException {
		BookingUser user = checkTokenAndRole(Role.DEFAULT);
		return bookingController.getBookings(user.getId(), new Date(from));

	}

	@GET
	public List<Booking> getBookings(
			@QueryParam("start") long from, 
			@QueryParam("end") long to) {
		return bookingController.getBookings(new Date(from), new Date(to), null);
	}

	@POST
	public Booking createBooking(Booking booking) throws BasicException{

		BookingUser user = checkTokenAndRole(Role.DEFAULT, Role.ADMIN, Role.EDITOR);
		if (user != null) 
		{
			booking.setBooker(user); //make sure user books on his own behalf
			return bookingController.createBooking(booking);

		}
		throw new BasicException(Response.Status.BAD_REQUEST, "Could not book items.");
		//return new Message("Booking created successfully");
	}

	@POST @Path("/create")
	public List<Booking> createMultipleBookings(List<Booking> bookings) throws BasicException{
		BookingUser user = checkTokenAndRole(Role.DEFAULT, Role.ADMIN, Role.EDITOR);
		if (user != null) 
		{
			return bookingController.createMultipleBookings(bookings, user);
		}
		throw new BasicException(Response.Status.BAD_REQUEST, ERROR_BOOKING_UNKNOWN);
		//return new Message("Booking created successfully");
	}

	@DELETE @Path("/{id}")
	public void deleteBooking(@PathParam("id") long bookingId) throws BasicException{
		BookingUser user = checkTokenAndRole(Role.DEFAULT, Role.EDITOR, Role.ADMIN);
		bookingController.deleteBooking(bookingId, user);
	}

	@PUT @Path("/{id}")
	public Booking updateBooking(@PathParam("id") long id, Booking booking) throws BasicException{
		BookingUser user = checkTokenAndRole(Role.DEFAULT, Role.EDITOR, Role.ADMIN);
		if(user != null){
			return bookingController.updateBooking(booking, user);
		}else{
			throw new BadRequestException(ERROR_USER_INVALID);
		}
	}

}
