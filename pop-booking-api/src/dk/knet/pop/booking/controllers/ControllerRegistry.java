package dk.knet.pop.booking.controllers;

import dk.knet.pop.booking.controllers.impl.*;

/**
 * Created: 17-02-2018
 * Owner: Runi
 */

public class ControllerRegistry {
    private static IAuthenticationController authenticationController;
    private static BookableObjectController bookableObjectController;
    private static BookingController bookingController;
    private static ClosedPeriodController closedPeriodController;
    private static KNetIntegrationController kNetIntegrationController;
    private static PostItemController postItemController;
    private static PropertyController propertyController;
    private static UserController userController;

    public static IAuthenticationController getAuthenticationController(){
        if(authenticationController == null){
            authenticationController = ConfigManager.DEBUG ? new AuthenticationControllerLocalhost() : new AuthenticationController();
        }
        return authenticationController;
    }

    public static BookableObjectController getBookableObjectController(){
        if(bookableObjectController == null){
            bookableObjectController = new BookableObjectController();
        }
        return bookableObjectController;
    }

    public static BookingController getBookingController(){
        if(bookingController == null){
            bookingController = new BookingController();
        }
        return bookingController;
    }

    public static ClosedPeriodController getClosedPeriodController(){
        if(closedPeriodController == null){
            closedPeriodController= new ClosedPeriodController();
        }
        return closedPeriodController;
    }

    public static KNetIntegrationController getkNetIntegrationController(){
        if(kNetIntegrationController == null){
            kNetIntegrationController = new KNetIntegrationController();
        }
        return kNetIntegrationController;
    }

    public static PostItemController getPostItemController(){
        if(postItemController == null){
            postItemController= new PostItemController();
        }
        return postItemController;
    }

    public static PropertyController getPropertyController(){
        if(propertyController == null){
            propertyController = new PropertyController();
        }
        return propertyController;
    }

    public static UserController getUserController(){
        if(userController == null){
            userController= new UserController();
        }
        return userController;
    }
}
