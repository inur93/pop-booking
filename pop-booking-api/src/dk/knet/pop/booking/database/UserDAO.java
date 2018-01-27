package dk.knet.pop.booking.database;

import java.util.Date;

import javax.persistence.NoResultException;
import javax.persistence.NonUniqueResultException;

import org.apache.log4j.Logger;

import dk.knet.pop.booking.exceptions.BasicException;
import dk.knet.pop.booking.exceptions.InvalidArgsException;
import dk.knet.pop.booking.models.BookingUser;

public class UserDAO extends BasicDAO{

	private Logger log = Logger.getLogger(getClass());

	public BookingUser getUserByName(String username) {
		start();
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
		end();
		return user;
	}
	
	public BookingUser createUser(BookingUser user) throws BasicException{
		if(user == null) return user;
		if(user.getUsername() == null || user.getPassword() == null) throw new InvalidArgsException("Username and password can't be null");
		
//		String saltedHash = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt(12));
//		user.setTokenHash(saltedHash);
		start();
		BookingUser u = simpleSaveNew(user);
		end();
		return u;
	}
	
	public BookingUser updateUser(BookingUser user) throws BasicException{
		if(user == null) return null;
		if(user.getUsername() == null || user.getPassword() == null) throw new InvalidArgsException("Username and password can't be null");
		start();
		user.setLastUpdated(new Date());
		BookingUser u = simpleUpdate(user);
		end();
		return u;
	}
	
}
