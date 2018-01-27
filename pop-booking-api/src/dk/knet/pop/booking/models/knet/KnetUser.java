package dk.knet.pop.booking.models.knet;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KnetUser {

	private String url;
	private String dorm;
	private List<Object> wifiguestuser_objects;
	private String username;
	private String password;
	private String password_nt;
	private String vlan;
	private String comment;
	private String email;
	private String name;
	private String phonenumber;
	private String userobject;
	
}
