package dk.knet.pop.booking.security;

public class MalformedTokenException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = -3138351511796759759L;

	public MalformedTokenException(String msg) {
		super(msg);
	}

}
