package dk.knet.pop.booking.controllers.impl;

import javax.ws.rs.PathParam;

import dk.knet.pop.booking.database.PropertyDAO;
import dk.knet.pop.booking.models.Property;


public class PropertyController {
	
	private PropertyDAO dao = new PropertyDAO();
	
	public Property getProperty(String id){
		return dao.getPropertyById(id);
	}
	

}
