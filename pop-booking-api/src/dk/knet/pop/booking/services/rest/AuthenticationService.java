package dk.knet.pop.booking.services.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import dk.knet.pop.booking.controllers.ControllerRegistry;
import dk.knet.pop.booking.controllers.IAuthenticationController;
import dk.knet.pop.booking.exceptions.AuthorizationException;
import dk.knet.pop.booking.exceptions.BasicException;
import dk.knet.pop.booking.models.BookingUser;
import dk.knet.pop.booking.viewmodels.LoginUserViewModel;

import static dk.knet.pop.booking.configs.ErrorStrings.ERROR_LOGIN_FAILED;

@Path("/v1/authentication")
@Produces({MediaType.APPLICATION_JSON})
@Consumes({MediaType.APPLICATION_JSON})
public class AuthenticationService extends ProtectedService {


    private IAuthenticationController authCtrl = ControllerRegistry.getAuthenticationController();

    @POST
    @Path("/login")
    public LoginUserViewModel authenticateUser(LoginUserViewModel userModel) throws BasicException {
        if (userModel == null) {
            throw new WebApplicationException(ERROR_LOGIN_FAILED, 400);
        }
        BookingUser user = authCtrl.authenticate(userModel);
        if(user != null) {
            String token = setHeaders(user);
            userModel.setPassword(null);
            userModel.setCaptchaToken(null);
            userModel.setTokenHash(null);
            userModel.setToken(token);
            return userModel;
        }else{
            throw new AuthorizationException(Response.Status.UNAUTHORIZED ,"Invalid credentials");
        }
    }

    @POST
    @Path("/logout")
    public BookingUser logout() {
        return null;
    }


}
