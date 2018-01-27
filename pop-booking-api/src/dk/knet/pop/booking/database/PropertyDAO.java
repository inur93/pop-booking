package dk.knet.pop.booking.database;

import dk.knet.pop.booking.models.Property;

public class PropertyDAO extends BasicDAO {
	
	public Property getPropertyById(String id){
		start();
		Property prop = simpleGet(Property.class, id);
		end();
		return prop;
	}
	
	public void updateProperty(Property prop){
		start();
		simpleUpdate(prop);
		end();
	}

}
