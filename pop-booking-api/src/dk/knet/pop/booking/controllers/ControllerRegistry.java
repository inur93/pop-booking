package dk.knet.pop.booking.controllers;

import dk.knet.pop.booking.configs.Configs;
import dk.knet.pop.booking.controllers.impl.*;

/**
 * Created: 17-02-2018
 * Owner: Runi
 */

public class ControllerRegistry {


    public static IAuthenticationController getAuthenticationController() {
        return Configs.DEBUG ? new AuthenticationControllerLocalhost() : new AuthenticationController();
    }

    public static BookableObjectController getBookableObjectController() {
        return new BookableObjectController();
    }

    public static BookingController getBookingController() {
        return new BookingController();
    }

    public static ClosedPeriodController getClosedPeriodController() {
        return new ClosedPeriodController();
    }

    public static KNetIntegrationController getkNetIntegrationController() {
        return new KNetIntegrationController();
    }

    public static PostItemController getPostItemController() {
        return new PostItemController();
    }

    public static PropertyController getPropertyController() {
        return new PropertyController();
    }

    public static UserController getUserController() {
        return new UserController();
    }
}
