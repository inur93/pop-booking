package dk.knet.pop.booking.services.rest;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import dk.knet.pop.booking.controllers.BookableObjectController;
import dk.knet.pop.booking.database.BookableObjectDAO;
import dk.knet.pop.booking.exceptions.BasicException;
import dk.knet.pop.booking.exceptions.InvalidArgsException;
import dk.knet.pop.booking.models.BookableItem;
import dk.knet.pop.booking.models.BookingType;
import dk.knet.pop.booking.models.Message;
import dk.knet.pop.booking.models.Role;

@Path("/bookableobjects")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BookableObjectService extends ProtectedService {

	private BookableObjectController controller = new BookableObjectController();
	@GET
	@Path("/all")
	public List<BookableItem> getBookableObjects(){
		BookableObjectDAO dao = new BookableObjectDAO();
		return dao.getBookableObjects();
	}
	
	/**
	 * 
	 * @param type, accepts display name and enum name
	 * @return
	 */
	@GET
	@Path("/{type}")
	public List<BookableItem> getMeetingRooms(@PathParam("type") String type){
		BookingType bookingType = null;
		try{
			bookingType = BookingType.valueOf(type);
		}catch(Exception e){
			bookingType = BookingType.valueOfTitle(type);
		}
		return controller.getBookableObjectsByType(bookingType);

	}
	
	@POST
	@Path("/create")
	public BookableItem createBookableItem(BookableItem item) throws BasicException{
		this.checkTokenAndRole(Role.ADMIN);
		return controller.createBookableItem(item);
//		return new Message("Item created succesfully.");
	}
	
	@GET
	@Path("/gettypes")
	public BookingType[] getBookableItemTypes(){
		return BookingType.values();
	}
	
	@POST
	@Path("/update")
	public Message updateBookableItem(BookableItem item) throws BasicException{
		controller.updateBookableItem(item);
		return new Message("Item updated succesfully.");
	}
	
	@DELETE
	@Path("/delete/{id}")
	public Message deleteBookableItem(@PathParam("id") String id) throws BasicException{
		try{
			long idLong = Long.parseLong(id);
			controller.deleteBookableItem(idLong);
		}catch(NumberFormatException e){
			throw new InvalidArgsException("Id was invalid: " + id);
		}
		return new Message("Item deleted succesfully.");
	}

	
	
	
}
