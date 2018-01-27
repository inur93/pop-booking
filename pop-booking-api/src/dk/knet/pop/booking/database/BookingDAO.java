package dk.knet.pop.booking.database;

import java.util.Date;
import java.util.List;

import javax.persistence.Query;

import dk.knet.pop.booking.models.BookableItem;
import dk.knet.pop.booking.models.Booking;
import dk.knet.pop.booking.models.BookingType;
import dk.knet.pop.booking.models.BookingUser;

public class BookingDAO extends BasicDAO {

	@SuppressWarnings("unchecked")
	public List<Booking> getBookings(Date from, Date to, BookingType type){
		start();
		
		String queryStr = "SELECT B "
				+ "FROM Booking B JOIN B.bookableItem BI "
				+ "WHERE ("
				+ "(B.dateTo > :dateFrom AND B.dateTo < :dateTo) OR "
				+ "(B.dateFrom > :dateFrom AND B.dateFrom < :dateTo))"
				+ " AND BI.bookingType = :type";
		Query query = s.createQuery(queryStr);
		
		query.setParameter("dateFrom", from);
		query.setParameter("dateTo", to);
		query.setParameter("type", type);
		
		////System.out.println("query: " + query.toString());
		List<Booking> bookings = query.getResultList();
		end();
		return bookings;
	}
	
	public List<Booking> getExistingBookings(Date from, Date to, BookableItem item){
start();
		
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
		end();
		return bookings;
	}
	
	public List<Booking> getBookingsByUser(long userId){
		return getBookingsByUser(userId, null);
	}
	
	public List<Booking> getBookingsByUser(long userId, Date from){
		String hql = "";
		if(from == null){
			hql = "SELECT B FROM Booking B JOIN B.booker U WHERE U.id=:booker";			
		}else{
			hql = "SELECT B FROM Booking B JOIN B.booker U WHERE U.id=:booker AND B.dateFrom>:date";
		}
		start();
		Query query = s.createQuery(hql);
		
		query.setParameter("booker", userId);
		if(from != null) query.setParameter("date", from);
		
		List<Booking> results = query.getResultList();
		end();
		return results;
	}
	
	public Booking createBooking(Booking booking){
		start();
		Booking created = simpleSaveNew(booking);
		end();
		return created;
	}

	public Booking getBookingById(long id){
		start();
		Booking booking = this.simpleGet(Booking.class, id);
		end();
		return booking;
	}
	
	public void deleteBooking(Booking booking) {
		start();
		this.simpleDelete(booking);
		end();
	}

	public void updateBooking(Booking booking) {
		start();
		this.simpleSave(booking);
		end();
	}
	
}
