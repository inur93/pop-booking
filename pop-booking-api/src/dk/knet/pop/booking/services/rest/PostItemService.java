package dk.knet.pop.booking.services.rest;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import dk.knet.pop.booking.controllers.ControllerRegistry;
import dk.knet.pop.booking.controllers.impl.PostItemController;
import dk.knet.pop.booking.exceptions.BasicException;
import dk.knet.pop.booking.models.BookingUser;
import dk.knet.pop.booking.models.PostItem;
import dk.knet.pop.booking.models.Role;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Path("/v1/posts")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PostItemService extends ProtectedService{

	private PostItemController controller = ControllerRegistry.getPostItemController();
	
	@GET
	public List<PostItem> getPosts(
			@DefaultValue(value="0") @QueryParam("page") int page, 
			@DefaultValue(value="5") @QueryParam("number") int number){
		log.error("test logging");
		return controller.getPosts(page, number);
	}
	
	@POST
	public PostItem createPostItem(PostItem item) throws BasicException{
		BookingUser user = checkTokenAndRole(Role.DEFAULT, Role.EDITOR, Role.ADMIN);
		return controller.create(item, user);
	}
	
	@DELETE
	@Path("/{id}")
	public void delete(@PathParam("id") long id) throws BasicException{
		BookingUser user = checkTokenAndRole(Role.DEFAULT, Role.EDITOR, Role.ADMIN);
		controller.delete(id, user);
	}
}
