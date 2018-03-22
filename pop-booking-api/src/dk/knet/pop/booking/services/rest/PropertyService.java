package dk.knet.pop.booking.services.rest;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

import dk.knet.pop.booking.controllers.ControllerRegistry;
import dk.knet.pop.booking.controllers.impl.PropertyController;
import dk.knet.pop.booking.models.Property;


@Path("/v1/properties")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PropertyService {

	
	PropertyController controller = ControllerRegistry.getPropertyController();
	@GET
	@Path("/{id}")
	public Property getProperty(@PathParam("id") String id){
		return controller.getProperty(id);
	}
}
