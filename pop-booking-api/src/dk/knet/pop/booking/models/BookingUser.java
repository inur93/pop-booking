package dk.knet.pop.booking.models;

import java.util.Date;
import java.util.Set;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "pop_users")
@Builder
public class BookingUser {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	/*@Transient @JsonIgnore
	private String token;
	@Transient @JsonIgnore
	private String captchaToken;*/
	@JsonIgnore
	private String tokenHash;
	private Boolean isUserActive;
	private String name;
	private String username;

	@JsonIgnore
	private String password;
	

	
	private Date lastUpdated;
	private String roomNo;
	private String vlan;
	
	@ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.ORDINAL)
	private Set<Role> roles;
	
	@Override
	public String toString() {
		return "id=" + id + ";name=" + username + ";isActive=" + isUserActive + ";roles=" + roles;
	}

}
