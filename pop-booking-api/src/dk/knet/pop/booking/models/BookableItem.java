package dk.knet.pop.booking.models;

import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Entity
@Builder
@Table(name = "bookable_item")
public class BookableItem {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String name;
	private BookingType bookingType; // this is currently not used
	private String color;

	@Column(nullable = false)
	private Integer maxBookableHours;

	@Column(nullable = false) @ColumnDefault(value = "0")
	private Status status = Status.ACTIVE;
	private String statusMessage;

	public enum Status {
		OUT_OF_ORDER, ACTIVE
	}

}
