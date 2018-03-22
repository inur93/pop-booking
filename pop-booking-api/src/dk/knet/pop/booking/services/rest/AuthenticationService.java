package dk.knet.pop.booking.services.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;

import dk.knet.pop.booking.controllers.ControllerRegistry;
import dk.knet.pop.booking.controllers.IAuthenticationController;
import dk.knet.pop.booking.controllers.impl.AuthenticationController;
import dk.knet.pop.booking.controllers.impl.AuthenticationControllerLocalhost;
import dk.knet.pop.booking.controllers.impl.ConfigManager;
import dk.knet.pop.booking.exceptions.BasicException;
import dk.knet.pop.booking.models.BookingUser;
import dk.knet.pop.booking.models.LoginUserViewModel;

import static dk.knet.pop.booking.configs.ErrorStrings.ERROR_LOGIN_FAILED;

@Path("/v1/authentication")
@Produces({MediaType.APPLICATION_JSON})
@Consumes({MediaType.APPLICATION_JSON})
public class AuthenticationService extends ProtectedService {


    private IAuthenticationController authCtrl = ControllerRegistry.getAuthenticationController();

    @POST
    @Path("/login")
    public BookingUser authenticateUser(LoginUserViewModel userModel) throws BasicException {
        if (userModel == null) {
            throw new WebApplicationException(ERROR_LOGIN_FAILED, 400);
        }
        BookingUser user = authCtrl.authenticate(userModel);
        setHeaders(user);
        user.setPassword(null);
        return user;
    }

    @POST
    @Path("/logout")
    public BookingUser logout() {
        return null;
    }


}
