package dk.knet.pop.booking.exceptions;

import javax.ws.rs.core.Response.Status;

public class BadRequestException extends BasicException{
	private static final long serialVersionUID = 2838363200400738626L;

	
	public BadRequestException(String message) {
		super(Status.BAD_REQUEST, message);
	}

	
}
