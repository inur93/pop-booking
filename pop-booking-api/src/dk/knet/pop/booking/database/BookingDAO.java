package dk.knet.pop.booking.database;

import java.util.Date;
import java.util.List;

import javax.persistence.Query;

import dk.knet.pop.booking.models.BookableItem;
import dk.knet.pop.booking.models.Booking;
import dk.knet.pop.booking.models.BookingType;

public class BookingDAO extends BasicDAO<Booking> {

    public BookingDAO(){
        super(Booking.class);
    }
    @SuppressWarnings("unchecked")
    public List<Booking> getBookings(Date from, Date to, BookingType type) {
        String queryStr = "SELECT B "
                + "FROM Booking B JOIN B.bookableItem BI "
                + "WHERE ("
                + "(B.dateTo > :dateFrom AND B.dateTo < :dateTo) OR "
                + "(B.dateFrom > :dateFrom AND B.dateFrom < :dateTo))";
        if (type != null) queryStr += " AND BI.bookingType = :type";
        Query query = s.createQuery(queryStr);

        query.setParameter("dateFrom", from);
        query.setParameter("dateTo", to);
        if (type != null)
            query.setParameter("type", type);

        ////System.out.println("query: " + query.toString());
        List<Booking> bookings = query.getResultList();
        return bookings;
    }

    public List<Booking> getExistingBookings(Date from, Date to, BookableItem item) {
        String queryStr = "SELECT B "
                + "FROM Booking B JOIN B.bookableItem BI "
                + "WHERE ("
                + ":dateFrom < B.dateTo AND "
                + "(:dateFrom >= B.dateFrom OR B.dateFrom < :dateTo))"
                + " AND BI.id = :item";
        Query query = s.createQuery(queryStr);

        query.setParameter("dateFrom", from);
        query.setParameter("dateTo", to);
        query.setParameter("item", item.getId());

        ////System.out.println("query: " + query.toString());
        List<Booking> bookings = query.getResultList();
        s.flush();
        return bookings;
    }

    public List<Booking> getBookingsByUser(long userId) {
        return getBookingsByUser(userId, null);
    }

    public List<Booking> getBookingsByUser(long userId, Date from) {
        String hql = "";
        if (from == null) {
            hql = "SELECT B FROM Booking B JOIN B.booker U WHERE U.id=:booker";
        } else {
            hql = "SELECT B FROM Booking B JOIN B.booker U WHERE U.id=:booker AND B.dateFrom>:date";
        }
        Query query = s.createQuery(hql);

        query.setParameter("booker", userId);
        if (from != null) query.setParameter("date", from);
        s.flush();
        return (List<Booking>) query.getResultList();
    }
}
