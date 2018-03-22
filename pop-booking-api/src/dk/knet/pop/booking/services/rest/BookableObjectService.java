package dk.knet.pop.booking.services.rest;

import java.util.List;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

import dk.knet.pop.booking.controllers.ControllerRegistry;
import dk.knet.pop.booking.controllers.impl.BookableObjectController;
import dk.knet.pop.booking.database.BookableObjectDAO;
import dk.knet.pop.booking.exceptions.BasicException;
import dk.knet.pop.booking.exceptions.InvalidArgsException;
import dk.knet.pop.booking.models.BookableItem;
import dk.knet.pop.booking.models.BookingType;
import dk.knet.pop.booking.models.Role;

import static dk.knet.pop.booking.configs.ErrorStrings.ERROR_BOOKABLE_OBJECT_INVALID_ID;

@Path("/bookableobjects")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BookableObjectService extends ProtectedService {

	private BookableObjectController controller = ControllerRegistry.getBookableObjectController();
	@GET
	public List<BookableItem> getBookableObjects(@QueryParam("type") String type){
		BookableObjectDAO dao = new BookableObjectDAO();
		if(type != null){
			return controller.getBookableObjectsByType(BookingType.valueOf(type));
		}else{
			return dao.getBookableObjects();
		}
	}
	
	@POST
	public BookableItem createBookableItem(BookableItem item) throws BasicException{
		this.checkTokenAndRole(Role.ADMIN);
		return controller.createBookableItem(item);
	}
	
	@GET
	@Path("/types")
	public BookingType[] getBookableItemTypes(){
		return BookingType.values();
	}
	
	@PUT
	@Path("/{id}")
	public BookableItem updateBookableItem(@PathParam("id") String id, BookableItem item) throws BasicException{
		return controller.updateBookableItem(item);
	}
	
	@DELETE
	@Path("/{id}")
	public void deleteBookableItem(@PathParam("id") String id) throws BasicException{
		try{
			long idLong = Long.parseLong(id);
			controller.deleteBookableItem(idLong);
		}catch(NumberFormatException e){
			throw new InvalidArgsException(ERROR_BOOKABLE_OBJECT_INVALID_ID);
		}
	}

	
	
	
}
