package dk.knet.pop.booking.exceptions;

import javax.ws.rs.core.Response;

public class DoubleBookingException extends BasicException{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public DoubleBookingException(String msg){
		super(Response.Status.BAD_REQUEST, msg);
	}
}
