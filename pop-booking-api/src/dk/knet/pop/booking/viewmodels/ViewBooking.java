package dk.knet.pop.booking.viewmodels;

import dk.knet.pop.booking.models.Booking;

/**
 * Created: 17-08-2018
 * author: Runi
 */

public class ViewBooking extends Booking {

    public ViewBooking(Booking booking){
        super(booking.getId(),
                booking.getCreated(),
                booking.isEditable(),
                booking.getCheckInImage(),
                booking.getCheckOutImage(),
                booking.getBookableItem(),
                booking.getDateFrom(),
                booking.getDateTo(),
                new ViewUser(booking.getBooker()));
    }
}
