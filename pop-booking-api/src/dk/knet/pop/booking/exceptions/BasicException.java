package dk.knet.pop.booking.exceptions;

import java.io.Serializable;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

public class BasicException extends Exception implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	public Status code;
	public BasicException(Status code, String message) {
		super(message);
		this.code = code;
	}
}
