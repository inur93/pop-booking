package dk.knet.pop.booking.models;

import java.awt.image.BufferedImage;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "bookings")
public class Booking {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	//@ColumnDefault(value = "Now()")
	private Date created;
	
	@Transient
	private boolean editable;
	
	@Transient
	private BufferedImage checkInImage;
	@Transient
	private BufferedImage checkOutImage;
	
	@ManyToOne
	private BookableItem bookableItem;
	
	private Date dateFrom;
	private Date dateTo;
	
	@ManyToOne
	private BookingUser booker;
	
}
