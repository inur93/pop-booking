package dk.knet.pop.booking.models;

import java.util.Date;
import java.util.Set;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
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
@Table(name = "pop_users")
public class BookingUser {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Transient
	private String token;
	private String tokenHash;
	private Boolean isUserActive;
	private String name;
	private String username;
	private String password;
	
	@Transient
	private String captchaToken;
	
	private Date lastUpdated;
	private String roomNo;
	private String vlan;
	
	@ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.ORDINAL)
	private Set<Role> assignedRoles;
	
	
	@Override
	public String toString() {
		return "id=" + id + ";name=" + username + ";password=" + password + ";isActive=" + isUserActive + ";roles=" + assignedRoles;
	}

}
