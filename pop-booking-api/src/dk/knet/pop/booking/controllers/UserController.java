package dk.knet.pop.booking.controllers;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import dk.knet.pop.booking.database.UserDAO;
import dk.knet.pop.booking.exceptions.BasicException;
import dk.knet.pop.booking.models.BookingUser;
import dk.knet.pop.booking.models.Role;
import dk.knet.pop.booking.models.knet.KnetUser;
import dk.knet.pop.booking.models.knet.KnetVlan;

public class UserController {
	
	private KNetIntegrationController knet = new KNetIntegrationController();
	private final int userCacheTimeout; 
	private UserDAO dao = new UserDAO();
	
	public UserController(){
		String readValue = ConfigManager.read(ConfigManager.USER_CACHE_TIMEOUT);
		int value = 24;
		try{
			value = Integer.valueOf(readValue);
		}catch(Exception e){
			value = 24;
		}
		userCacheTimeout = value;
	}
	
	public BookingUser updateUser(String username){
		return this.updateUser(username, false);
	}
	
	public BookingUser updateUser(String username, boolean force){
		BookingUser localUser = force ? null : dao.getUserByName(username); //no need if forced
		boolean update = force || 
				localUser == null ||
				shouldUpdate(localUser);
		if(update){
			KnetUser knetUser = knet.getUserByUsername(username);
			KnetVlan vlan = knet.getUserVlan(knetUser.getVlan());
			if(localUser == null){
				BookingUser user = convertToBookingUser(knetUser, vlan);
				try {
					return dao.createUser(user);
				} catch (BasicException e) {
					e.printStackTrace();
					return localUser;
				}
			}else{
				BookingUser user = mergeUsers(localUser, knetUser, vlan);
				try {
					return dao.updateUser(user);
				} catch (BasicException e) {
					e.printStackTrace();
					return localUser;
				}
			}
		}
		return localUser;
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
			existing.setAssignedRoles(roles);
		}
		existing.setLastUpdated(new Date());
		existing.setPassword(newUser.getPassword());
		existing.setVlan(vlan.getId());
//		existing.setEmail(newUser.getEmail());
//		newUser.getPhonenumber();
		existing.setName(newUser.getName());
		existing.setRoomNo(vlan.getRoom());
		existing.setIsUserActive(vlan.getState() > 0 ? true : false);
		
		return existing;
	}

}
