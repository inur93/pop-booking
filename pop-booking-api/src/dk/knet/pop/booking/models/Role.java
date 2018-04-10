package dk.knet.pop.booking.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Role {

	ADMIN ("Administrator"),
	EDITOR ("Editor"),
	DEFAULT ("Default");

	private String title;
	Role(String value) {
		this.title = value;
	} 
	@JsonValue
	public String getValue(){
		return this.title;
	}
	
	@JsonCreator
	public static Role create(String val){
		for(Role r : Role.values()){
			if(r.getTitle().equalsIgnoreCase(val)){
				return r;
			}
		}
		throw new IllegalArgumentException("No enum found for Role: " + val);
	}
	
	public String getTitle(){
		return title;
	}

}
