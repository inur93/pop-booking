package dk.knet.pop.booking.exceptions;

import javax.ws.rs.core.Response.Status;

public class AuthorizationException extends BasicException{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	public AuthorizationException(Status code, String message) {
		super(code, message);
	}

	

}
