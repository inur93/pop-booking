package dk.knet.pop.booking.services.rest;

import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.log4j.Logger;


import dk.knet.pop.booking.models.Role;
import dk.knet.pop.booking.exceptions.AuthorizationException;
import dk.knet.pop.booking.exceptions.BasicException;
import dk.knet.pop.booking.models.BookingUser;
import dk.knet.pop.booking.security.JWTHandler;
import dk.knet.pop.booking.security.MalformedTokenException;
import dk.knet.pop.booking.security.PermissionDeniedException;
import dk.knet.pop.booking.security.PermissionExpiredException;

import static dk.knet.pop.booking.configs.ErrorStrings.*;


/**
 * SuperClass to ensure methods for checking Token and Roles + set consumes/produces to JSON
 * @author Christian
 *
 */
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public abstract class ProtectedService {
	protected Logger logger = Logger.getLogger(this.getClass());
	private static Long LOGIN_DURATION = 3600*1000L; //msec
	private static Long REFRESH_TOKEN_DURATION = LOGIN_DURATION * 2;
	
	@Context
	HttpHeaders headers;
	
	@Context
	HttpServletResponse response;
	
	 
	public BookingUser checkTokenAndRole(Role... allowedroles) throws BasicException{
		//Check if headers are properly injected
		if (headers==null) throw new AuthorizationException(Response.Status.INTERNAL_SERVER_ERROR, ERROR_SERVER_UNKNOWN);
		//Check if Authorization Headers are set
		List<String> authHeaders = headers.getRequestHeader("Authorization");
		
		if (authHeaders== null || authHeaders.get(0)==null) throw new AuthorizationException(Response.Status.FORBIDDEN, ERROR_AUTHENITCATION_NOT_LOGGED_IN);
				
		String autorizationString = authHeaders.get(0); //Get first ( and probably only) authorization header
		String jwtString = autorizationString.split(" ")[1]; //Remove 'bearer' from token
		//B.log(this, jwtString);
		try {
			//Validate JWT claims
			BookingUser viewUser = JWTHandler.getInstance().validateJWT(jwtString, allowedroles);
			
			//Refresh token
			setHeaders(viewUser);
			return viewUser;
		} catch (PermissionExpiredException e) {
			throw new AuthorizationException(Status.UNAUTHORIZED, ERROR_AUTHENTICATION_EXPIRED);
		} catch(PermissionDeniedException e){
			throw new AuthorizationException(Status.UNAUTHORIZED, ERROR_AUTHENTICATION_PERMISSION_DENIED);
		} catch (MalformedTokenException e) {
			throw new AuthorizationException(Status.BAD_REQUEST, ERROR_AUTHENTICATION_INVALID_USER);
		}
		
		
	}
	
	protected String setHeaders(BookingUser user) {
		String jwtToken = JWTHandler.getInstance().createJWT(user, LOGIN_DURATION );
		response.setHeader("Authorization", "Bearer2 " + jwtToken);
		response.setDateHeader("TokenTimeout", new Date().getTime()+LOGIN_DURATION);
		return jwtToken;
	}

}
