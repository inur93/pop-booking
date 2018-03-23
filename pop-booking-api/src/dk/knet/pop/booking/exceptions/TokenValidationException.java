package dk.knet.pop.booking.exceptions;

public class TokenValidationException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = -8047657265110750231L;
	private int errorCode;
	private String errorString;

	public TokenValidationException(String errorString, int errorCode) {
		this.setErrorString(errorString);
		this.setErrorCode(errorCode);
	}

	public int getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(int errorCode) {
		this.errorCode = errorCode;
	}

	public String getErrorString() {
		return errorString;
	}

	public void setErrorString(String errorString) {
		this.errorString = errorString;
	}

}
