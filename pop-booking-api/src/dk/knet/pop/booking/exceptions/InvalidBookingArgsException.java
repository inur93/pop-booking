package dk.knet.pop.booking.exceptions;

import javax.ws.rs.core.Response.Status;

public class InvalidBookingArgsException extends BasicException{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public InvalidBookingArgsException(String msg){
		super(Status.BAD_REQUEST, msg);
	}
}
