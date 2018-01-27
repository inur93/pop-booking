package dk.knet.pop.booking.models;

import javax.persistence.Entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

@Entity
public enum BookingType {

	KANOO_AND_KAJAK("Kanoo and kajak")
	, MEETINGROOM("Meetingroom");
	
	private String title;
	
	private BookingType(String title){
		this.title = title;
		
	}
	
	@JsonValue
	public String getValue(){
		return this.title;
	}
	
	@JsonCreator
	public static BookingType create(String val){
		for(BookingType t : BookingType.values()){
			if(t.getTitle().equalsIgnoreCase(val)){
				return t;
			}
		}
		throw new IllegalArgumentException("No enum found for bookingType: " + val);
	}
	
	public String getTitle(){
		return title;
	}
	
	public static BookingType valueOfTitle(String title){
		for(BookingType b : BookingType.values()){
			if(b.getTitle().equals(title)){
				return b;
			}
		}
		throw new IllegalArgumentException("No enum value found for: " + title);
	}
}
