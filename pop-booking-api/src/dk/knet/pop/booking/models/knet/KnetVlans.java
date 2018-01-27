package dk.knet.pop.booking.models.knet;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KnetVlans {

	private int count;
	private String next;
	private String previous;
	private List<KnetVlan> results;
	
}
