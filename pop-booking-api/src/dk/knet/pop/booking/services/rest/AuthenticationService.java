package dk.knet.pop.booking.services.rest;

import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import dk.knet.pop.booking.controllers.ControllerRegistry;
import dk.knet.pop.booking.controllers.IAuthenticationController;
import dk.knet.pop.booking.exceptions.AuthorizationException;
import dk.knet.pop.booking.exceptions.BasicException;
import dk.knet.pop.booking.models.BookingUser;
import dk.knet.pop.booking.viewmodels.LoginUserViewModel;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static dk.knet.pop.booking.configs.ErrorStrings.ERROR_LOGIN_FAILED;
import static dk.vormadal.configservice.Configuration.get;

@Slf4j
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

    @GET
    @Path("/resetpasswordlink")
    public Map<String, String> resetPassword(){
       Map<String, String> map = new HashMap<>();
       map.put("link", get("knet.reset_password_link", "")); //defaults to empty link - in which case the webapp won't show any link leading to any outdated page.
       return map;
    }


}
