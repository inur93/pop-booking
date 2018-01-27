package dk.knet.pop.booking.security;

public class PermissionExpiredException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = -5166166631471672451L;

	public PermissionExpiredException(String msg) {
		super(msg);
	}

}