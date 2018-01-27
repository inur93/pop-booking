package dk.knet.pop.booking.models;

import java.util.Date;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "closed_periods")
public class ClosedPeriod {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	private BookingUser createdBy;

	@ManyToOne
	private BookingUser lastUpdatedBy;

	@Column(nullable=false)
	private Date created;

	@Column(nullable=false)
	private Date lastUpdated;

	private String title;

	@Column(nullable = false)
	private Date start;
	@Column(nullable = false)
	private Date end;

	@ElementCollection(fetch = FetchType.EAGER)
	@Enumerated(EnumType.ORDINAL)
	private Set<BookingType> applyToTypes;

	@ManyToMany(fetch = FetchType.EAGER)
	private Set<BookableItem> applyToItems;

}
