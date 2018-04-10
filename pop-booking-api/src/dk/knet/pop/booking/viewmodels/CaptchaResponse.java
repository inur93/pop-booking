package dk.knet.pop.booking.viewmodels;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CaptchaResponse {

	private boolean success;
	private Date challenge_ts;
	private String hostname;
	private String[] errorCodes;

}
