package dk.knet.pop.booking.security;

public class PermissionDeniedException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 5170649188517519554L;

	public PermissionDeniedException(String msg) {
		super(msg);
	}

}