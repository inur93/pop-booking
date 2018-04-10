package dk.knet.pop.booking.database;

import dk.knet.pop.booking.models.BookableItem;
import dk.knet.pop.booking.models.BookingType;

import java.util.List;

public class BookableObjectDAO extends BasicDAO<BookableItem> {

    public BookableObjectDAO() {
        super(BookableItem.class);
    }

    @SuppressWarnings("unchecked")
    public List<BookableItem> getBookableObjectsByType(BookingType type) {
        List<BookableItem> list = s.createQuery("FROM BookableItem WHERE bookingType = " + type.ordinal() + "").getResultList();
        s.flush();
        return list;
    }
}
