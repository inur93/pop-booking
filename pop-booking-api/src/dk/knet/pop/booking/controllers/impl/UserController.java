package dk.knet.pop.booking.controllers.impl;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import dk.knet.pop.booking.configs.Configs;
import dk.knet.pop.booking.database.UserDAO;
import dk.knet.pop.booking.exceptions.BasicException;
import dk.knet.pop.booking.exceptions.InvalidArgsException;
import dk.knet.pop.booking.filters.SecureEndpoint;
import dk.knet.pop.booking.models.BookingUser;
import dk.knet.pop.booking.models.Role;
import dk.knet.pop.booking.models.knet.KnetUser;
import dk.knet.pop.booking.models.knet.KnetVlan;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class UserController {
	
	private KNetIntegrationController knet = new KNetIntegrationController();
	private final int userCacheTimeout; 
	private UserDAO dao = new UserDAO();
	
	public UserController(){
		userCacheTimeout = Configs.USER_CACHE_TIMEOUT;
	}
	
	public BookingUser updateUser(String username){
		try {
			return this.updateUser(username, false);
		}catch(Exception e){
			log.error("Failed to get user from k-net.", e);
		}
		return null;
	}
	
	public BookingUser updateUser(String username, boolean force){
		BookingUser localUser = force ? null : dao.getUserByName(username); //no need if forced
		boolean update = force || 
				localUser == null ||
				shouldUpdate(localUser);
		if(update){
			KnetUser knetUser = knet.getUserByUsername(username);
			//if knetuser is null - it is most likely because the user has been deleted - thus we disable the user
			if(knetUser == null){
				if(localUser != null){
					return disableUser(localUser);
				}else{
					return null; // no user found with given username
				}

			}
			KnetVlan vlan = knet.getUserVlan(knetUser.getVlan());
			if(localUser == null){
				BookingUser user = convertToBookingUser(knetUser, vlan);
				try {
					if(user == null) throw new InvalidArgsException("User is was not found");
					if(user.getUsername() == null || user.getPassword() == null) throw new InvalidArgsException("Username and password can't be null");
					return dao.create(user);
				} catch (BasicException e) {
					e.printStackTrace();
					return localUser;
				}
			}else{
				BookingUser user = mergeUsers(localUser, knetUser, vlan);
				try {
					if(user == null) throw new InvalidArgsException("User is was not found");
					if(user.getUsername() == null || user.getPassword() == null) throw new InvalidArgsException("Username and password can't be null");
					return dao.update(user);
				} catch (BasicException e) {
					log.warn("Could not merge users", e);
					return localUser;
				}
			}
		}
		return localUser;
	}

	public BookingUser disableUser(BookingUser user){
		user.setIsUserActive(false);
		return dao.update(user);
	}
	
	public boolean shouldUpdate(BookingUser user){
		Date yesterday = new Date(new Date().getTime() - 1000*60*60*userCacheTimeout);
		return user == null ||
				user.getLastUpdated() == null || 
				user.getLastUpdated().before(yesterday);
	}
	
	public BookingUser convertToBookingUser(KnetUser user, KnetVlan vlan){
		return mergeUsers(new BookingUser(), user, vlan);
	}
	
	private BookingUser mergeUsers(BookingUser existing, KnetUser newUser, KnetVlan vlan){
		if(existing.getId() == null){
			existing.setUsername(newUser.getUsername());
			Set<Role> roles = new HashSet<>();
			roles.add(Role.DEFAULT);
			existing.setRoles(roles);
			existing.setRoomNo(vlan.getRoom());
			existing.setName(newUser.getName());
		}
		existing.setLastUpdated(new Date());
		existing.setPassword(newUser.getPassword());
		existing.setVlan(vlan.getId());
		existing.setIsUserActive(vlan.getState() > 0 ? true : false);
		
		return existing;
	}

	public Set<SecureEndpoint.Permission> getPermissions(BookingUser user) {
		return null;
	}
}
