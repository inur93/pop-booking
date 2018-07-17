package dk.knet.pop.booking.viewmodels;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Transient;

/**
 * Created: 26-02-2018
 * Owner: Runi
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class LoginUserViewModel {
    private String token;
    private String captchaToken;
    private Boolean isUserActive;
    private String username;

    private String password;
}
