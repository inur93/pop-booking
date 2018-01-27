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
		if (headers==null) throw new AuthorizationException(Response.Status.INTERNAL_SERVER_ERROR, "Server error - ServiceUtil");
		//Check if Authorization Headers are set
		List<String> authHeaders = headers.getRequestHeader("Authorization");
		
		if (authHeaders== null || authHeaders.get(0)==null) throw new AuthorizationException(Response.Status.FORBIDDEN, "No Authorization header");
				
		String autorizationString = authHeaders.get(0); //Get first ( and probably only) authorization header
		String jwtString = autorizationString.split(" ")[1]; //Remove 'bearer' from token
		//B.log(this, jwtString);
		JWTHandler jwtH = new JWTHandler();
		try {
			//Validate JWT claims
			BookingUser viewUser = jwtH.validateJWT(jwtString, allowedroles);
			
			//Refresh token
			setHeaders(jwtH, viewUser);
			return viewUser;
		} catch (PermissionExpiredException | PermissionDeniedException e) {
			throw new AuthorizationException(Status.FORBIDDEN, e.getMessage());
		} catch (MalformedTokenException e) {
			throw new AuthorizationException(Status.BAD_REQUEST, e.getMessage());
		}
		
		
	}
	
	
	
	protected void setHeaders(BookingUser user) {
		this.setHeaders(null, user);
	}
	
	protected void setHeaders(JWTHandler handler, BookingUser user) {
		if(handler == null) handler = new JWTHandler();
		String jwtToken = handler.createJWT(user, LOGIN_DURATION );
		response.setHeader("Authorization", "Bearer2 " + jwtToken);
		response.setDateHeader("TokenTimeout", new Date().getTime()+LOGIN_DURATION);
	}

}
