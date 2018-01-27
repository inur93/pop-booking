package dk.knet.pop.booking.services.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import dk.knet.pop.booking.controllers.PropertyController;
import dk.knet.pop.booking.models.Property;


@Path("/v1/properties")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PropertyService {

	
	PropertyController controller = new PropertyController();
	
	@Path("/get/{id}")
	public Property getProperty(@PathParam("id") String id){
		return controller.getProperty(id);
	}
}
