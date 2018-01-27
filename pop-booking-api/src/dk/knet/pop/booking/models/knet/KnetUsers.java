package dk.knet.pop.booking.models.knet;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KnetUsers {

	private int count;
	private String next;
	private String previous;
	private List<KnetUser> results;
	
}
