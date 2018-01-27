package dk.knet.pop.booking.models.knet;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KnetVlan {

	private String url;
	private String id;
	private List<KnetUser> user_objects;
	private String dorm;
	private List<Object> firewallportrange_objects;
	private int vlan_type;
	private String room;
	private int state;
	
	private String download_speed_limit;
	private String upload_speed_limit;
	private String comment;
	
}
