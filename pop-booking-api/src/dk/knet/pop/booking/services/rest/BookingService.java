package dk.knet.pop.booking.services.rest;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import dk.knet.pop.booking.controllers.ControllerRegistry;
import dk.knet.pop.booking.controllers.impl.BookingController;
import dk.knet.pop.booking.exceptions.BasicException;
import dk.knet.pop.booking.models.Booking;
import dk.knet.pop.booking.models.BookingUser;
import dk.knet.pop.booking.models.Role;

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
		List<Booking> bookings = bookingController.getBookings(new Date(from), new Date(to), null);
		return bookings;
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
		List<Booking> created = new ArrayList<>();
		if (user != null) 
		{
			for(Booking booking : bookings){
				booking.setBooker(user); //make sure user books on his own behalf
				created.add(bookingController.createBooking(booking));
			}
			return created;
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
	
//	@Consumes(MediaType.APPLICATION_OCTET_STREAM)
//	@POST @Path("/{bookingid}/saveimage/{name}")
//	public void saveImage(byte[] fileBytes, @QueryParam("bookingid") long bookingId, @QueryParam("name") String name){
//		//System.out.println(name);
//	}
	
//	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
////	@Consumes(MediaType.MULTIPART_FORM_DATA)//MediaType.APPLICATION_FORM_URLENCODED) //MULTIPART_FORM_DATA,APPLICATION_OCTET_STREAM
//	@POST @Path("/{bookingid}/saveimage/{name}")
//	public Response saveImagePut(
//			@FormDataParam("file") InputStream uploadedInputStream,
//            @FormDataParam("file") FormDataContentDisposition fileDetails,
////			String file,
//			//String formData,
////			@FormDataParam("uploadFile") InputStream fileInputStream,
////            @FormDataParam("uploadFile") FormDataContentDisposition fileFormDataContentDisposition, 
//			@PathParam("bookingid") long bookingId, 
//			@PathParam("name") String name){
//		//System.out.println(name);
//		return Response.ok("success").build();
//		
//		try {
			
			//BufferedImage img = ImageIO.read(stream);
            // stream.
//			new File("images").mkdir();
//			name = !name.contains(".") ? name + ".jpg" : name;
//			FileOutputStream fos = new FileOutputStream("images/" + name);
//			ImageIO.write(img, ".jpeg", fos);
			//fos.write(image.getBytes());
//			fos.close();
//			stream.close();
//		} catch (IOException e) {
			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//	}


	protected Date parseDate(String date) {
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		try {
			return df.parse(date);
		} catch (ParseException e) {
			//System.err.println("failed parsing date string: " + date);
			e.printStackTrace();
		}
		return null;
	}
}
