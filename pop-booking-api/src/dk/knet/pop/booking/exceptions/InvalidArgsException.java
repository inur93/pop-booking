package dk.knet.pop.booking.exceptions;

import javax.ws.rs.core.Response.Status;

public class InvalidArgsException extends BasicException{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public InvalidArgsException(String msg){
		super(Status.BAD_REQUEST, msg);
	}
}
