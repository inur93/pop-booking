package dk.knet.pop.booking.services.rest;

import java.util.Date;
import java.util.List;

import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;

import dk.knet.pop.booking.controllers.ClosedPeriodController;
import dk.knet.pop.booking.exceptions.BasicException;
import dk.knet.pop.booking.models.BookingType;
import dk.knet.pop.booking.models.BookingUser;
import dk.knet.pop.booking.models.ClosedPeriod;
import dk.knet.pop.booking.models.Message;
import dk.knet.pop.booking.models.Role;

@Path("/v1/closedperiods")
public class ClosedPeriodsService extends ProtectedService{

	private ClosedPeriodController controller = new ClosedPeriodController();
	@POST
	@Path("/create")
	public ClosedPeriod create(ClosedPeriod period) throws BasicException{
		BookingUser user = checkTokenAndRole(Role.ADMIN);
		return controller.create(period, user);
	}
	
	@POST
	@Path("/update")
	public Message update(ClosedPeriod period) throws BasicException{
		BookingUser user = checkTokenAndRole(Role.ADMIN);
		controller.update(period, user);
		return new Message("Period updated");
	}
	
	@GET
	@Path("/get")
	public List<ClosedPeriod> get(@QueryParam("from") Long from, @QueryParam("to") Long to) throws BasicException{
		if(from == null || to == null){
			return controller.get(null, null);
		}else{
		return controller.get(new Date(from), new Date(to));
		}
	}
	
	@GET
	@Path("/get/{type}")
	public List<ClosedPeriod> getByType(@PathParam("type") BookingType type, @QueryParam("from") Long from, @QueryParam("to") Long to) throws BasicException{
		if(from == null || to == null){
			return controller.getByType(type, null, null);
		}else{
		return controller.getByType(type, new Date(from), new Date(to));
		}
	}
	
	@DELETE
	@Path("/delete/{id}")
	public Message delete(@PathParam("id") Long id) throws BasicException{
		BookingUser user = checkTokenAndRole(Role.ADMIN);
		controller.delete(id, user);
		return new Message("Period deleted");
	}
	
}
