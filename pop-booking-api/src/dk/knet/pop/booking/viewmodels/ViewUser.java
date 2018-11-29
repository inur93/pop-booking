package dk.knet.pop.booking.viewmodels;

import dk.knet.pop.booking.models.BookingUser;

/**
 * Created: 17-08-2018
 * author: Runi
 */

public class ViewUser  extends BookingUser{



    public ViewUser(BookingUser user){
        super(user.getId(),
                null,//user.getTokenHash(),
                null, //user.getIsUserActive(),
                user.getName(),
                null, //user.getUsername(),
                null, //user.getPassword(),
                null, //user.getLastUpdated(),
                user.getRoomNo(),
                null, // user.getVlan(),
                null // user.getRoles()
        );
    }
}
