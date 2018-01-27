package dk.knet.pop.booking.models;

import java.util.Date;

import javax.persistence.Id;
import javax.persistence.ManyToOne;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Property {

	@Id
	public String id;
	public String name;
	public String value;
	public Date updated;
	@ManyToOne
	private BookingUser updatedBy;
}
