package dk.knet.pop.booking.services.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;

import dk.knet.pop.booking.controllers.AuthenticationController;
import dk.knet.pop.booking.exceptions.BasicException;
import dk.knet.pop.booking.models.BookingUser;

@Path("/v1/authentication")
@Produces({MediaType.APPLICATION_JSON})
@Consumes({MediaType.APPLICATION_JSON})
public class AuthenticationService extends ProtectedService{



	private AuthenticationController authCtrl = new AuthenticationController();

	@POST @Path("/login")
	public BookingUser authenticateUser(BookingUser userModel) throws BasicException{

		if(userModel == null){
			throw new WebApplicationException("Malformed request", 400);
		}
//		BookingUser	user = authCtrl.authenticate(userModel);
		

	//	setHeaders(user);
		BookingUser user = userModel;
		user.setPassword(null);
		return user;

	}




}
