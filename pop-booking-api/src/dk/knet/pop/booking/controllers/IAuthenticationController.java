package dk.knet.pop.booking.controllers;

import dk.knet.pop.booking.exceptions.BasicException;
import dk.knet.pop.booking.models.BookingUser;
import dk.knet.pop.booking.viewmodels.LoginUserViewModel;

public interface IAuthenticationController {

    BookingUser authenticate(LoginUserViewModel userModel) throws BasicException;
}
