package dk.knet.pop.booking.controllers.impl;

import dk.knet.pop.booking.configs.Configs;
import dk.knet.pop.booking.database.UserDAO;
import dk.knet.pop.booking.exceptions.BasicException;
import dk.knet.pop.booking.models.BookingUser;
import dk.knet.pop.booking.viewmodels.LoginUserViewModel;
import dk.knet.pop.booking.security.JWTHandler;

import javax.ws.rs.client.Client;
import javax.ws.rs.core.Response;

import static dk.knet.pop.booking.configs.ErrorStrings.ERROR_ACCOUNT_DEACTIVATED;
import static dk.knet.pop.booking.configs.ErrorStrings.ERROR_INVALID_CREDENTIALS;

/**
 * Created: 17-02-2018
 * Owner: Runi
 */

public class AuthenticationControllerLocalhost extends AuthenticationController {

    private UserDAO dao = new UserDAO();
    private Client client = null;
    private final String captchaAuthUrl = Configs.CAPTCHA_URL;
    private final String captchaSecret = Configs.CAPTCHA_SECRET;

    @Override
    public BookingUser authenticate(LoginUserViewModel userModel) throws BasicException {

        BookingUser user = dao.getUserByName(userModel.getUsername());
        if (user == null) {
            throw new BasicException(Response.Status.UNAUTHORIZED, ERROR_INVALID_CREDENTIALS);
        }
        if (!user.getIsUserActive()) {
            throw new BasicException(Response.Status.UNAUTHORIZED, ERROR_ACCOUNT_DEACTIVATED);
        }

        if (checkPassword(userModel.getPassword(), user.getPassword())) {
            return user;
        } else {
            throw new BasicException(Response.Status.UNAUTHORIZED, ERROR_INVALID_CREDENTIALS);
        }
    }
}
