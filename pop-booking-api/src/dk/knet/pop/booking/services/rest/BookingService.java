package dk.knet.pop.booking.services.rest;

import java.io.InputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.ws.rs.BadRequestException;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;

import dk.knet.pop.booking.controllers.BookingController;
import dk.knet.pop.booking.exceptions.BasicException;
import dk.knet.pop.booking.models.Booking;
import dk.knet.pop.booking.models.BookingType;
import dk.knet.pop.booking.models.BookingUser;
import dk.knet.pop.booking.models.Message;
import dk.knet.pop.booking.models.Role;

@Path("/v1/bookings")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BookingService extends ProtectedService {

	private BookingController bookingController = new BookingController();

	@GET
	@Path("/mybookings/{userId}")
	public List<Booking> getBookings(
			@PathParam("userId") long userId, 
			@DefaultValue(value="0") @QueryParam("fromDate") long from) throws BasicException {
		BookingUser user = checkTokenAndRole(Role.DEFAULT);

		//if user wants bookings from other user, he needs to be admin 
		if(user.getId() != userId){
			checkTokenAndRole(Role.ADMIN); // throws exception if not admin
		}
		return bookingController.getBookings(userId, new Date(from));
	}

	@GET @Path("/{type}")
	public List<Booking> getBookings(
			@QueryParam("start") long from, 
			@QueryParam("end") long to,
			@PathParam("type") String type) {
		List<Booking> bookings = bookingController.getBookings(new Date(from), new Date(to), BookingType.valueOf(type));
		return bookings;
	}

	@PUT @Path("/new")
	public Message createBooking(Booking booking) throws BasicException{

		BookingUser user = checkTokenAndRole(Role.DEFAULT, Role.ADMIN, Role.EDITOR);
		if (user != null) 
		{
			booking.setBooker(user); //make sure user books on his own behalf
			bookingController.createBooking(booking);

		}
		return new Message("Booking created successfully");
	}

	@PUT @Path("/multiplenew")
	public Message createMultipleBookings(List<Booking> bookings) throws BasicException{

		BookingUser user = checkTokenAndRole(Role.DEFAULT, Role.ADMIN, Role.EDITOR);
		if (user != null) 
		{
			for(Booking booking : bookings){
				booking.setBooker(user); //make sure user books on his own behalf
				bookingController.createBooking(booking);
			}

		}
		return new Message("Booking created successfully");
	}

	@DELETE @Path("/delete/{id}")
	public Message deleteBooking(@PathParam("id") long bookingId) throws BasicException{
		BookingUser user = checkTokenAndRole(Role.DEFAULT, Role.EDITOR, Role.ADMIN);
		bookingController.deleteBooking(bookingId, user);
		return new Message("Booking deleted");
	}

	@POST @Path("/update")
	public Message updateBooking(Booking booking) throws BasicException{
		BookingUser user = checkTokenAndRole(Role.DEFAULT, Role.EDITOR, Role.ADMIN);
		if(user != null){
			bookingController.updateBooking(booking, user);
		}else{
			throw new BadRequestException("User could not be resolved");
		}
		return new Message("Booking saved");
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

	@GET
	public String getMsg() {
		return "Hello booking";
	}

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
