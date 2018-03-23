package dk.knet.pop.booking.models;

import javax.persistence.*;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
//@AllArgsConstructor
@Getter
@Entity
@Table(name = "bookable_item")
public class BookableItem {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String name;
	private BookingType bookingType;
	private String color;

	@Column(nullable = false)
	private Integer maxBookableHours;
}
