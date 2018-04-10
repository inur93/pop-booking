package dk.knet.pop.booking.database;

import java.util.Date;

import javax.persistence.NoResultException;
import javax.persistence.NonUniqueResultException;

import dk.knet.pop.booking.models.Booking;
import org.apache.log4j.Logger;

import dk.knet.pop.booking.exceptions.BasicException;
import dk.knet.pop.booking.exceptions.InvalidArgsException;
import dk.knet.pop.booking.models.BookingUser;

public class UserDAO extends BasicDAO<BookingUser> {

	private Logger log = Logger.getLogger(getClass());

	public UserDAO() {
		super(BookingUser.class);
	}

	public BookingUser getUserByName(String username) {
		BookingUser user = null;
		try{
			user = (BookingUser) s.createQuery("FROM BookingUser u WHERE u.username = '" + username.toLowerCase() + "'").getSingleResult();
		}catch(NoResultException nre){
			log.info("no result found for username=" + username, nre);
		}catch(NonUniqueResultException rnre){
			log.warn("more than one result was found for username=" + username, rnre);
		}catch(NullPointerException npe){
			log.warn("username was not defined", npe);
		}
		s.flush();
		return user;
	}
}
