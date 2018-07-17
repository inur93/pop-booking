package dk.knet.pop.booking.viewmodels;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties({"error-codes"})
public class CaptchaResponse {

	private boolean success;
	private Date challenge_ts;
	private String hostname;
	private String[] errorCodes;

}
