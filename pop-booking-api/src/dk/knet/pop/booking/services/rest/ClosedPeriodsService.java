package dk.knet.pop.booking.services.rest;

import java.util.Date;
import java.util.List;

import javax.ws.rs.*;

import dk.knet.pop.booking.controllers.ControllerRegistry;
import dk.knet.pop.booking.controllers.impl.ClosedPeriodController;
import dk.knet.pop.booking.exceptions.BasicException;
import dk.knet.pop.booking.models.BookingType;
import dk.knet.pop.booking.models.BookingUser;
import dk.knet.pop.booking.models.ClosedPeriod;
import dk.knet.pop.booking.models.Role;

@Path("/v1/closedperiods")
public class ClosedPeriodsService extends ProtectedService {

    private ClosedPeriodController controller = ControllerRegistry.getClosedPeriodController();

    @POST
    public ClosedPeriod create(ClosedPeriod period) throws BasicException {
        BookingUser user = checkTokenAndRole(Role.ADMIN);
        return controller.create(period, user);
    }

    @PUT
    @Path("/{id}")
    public ClosedPeriod update(@PathParam("id") long id, ClosedPeriod period) throws BasicException {
        BookingUser user = checkTokenAndRole(Role.ADMIN);
        return controller.update(period, user);
    }

    @GET
    public List<ClosedPeriod> get(@QueryParam("type") BookingType type, @QueryParam("from") Long from, @QueryParam("to") Long to) throws BasicException {
        if (type != null) {
            return controller.getByType(type, from == null ? null : new Date(from), to == null ? null : new Date(to));
        } else {
            return controller.get(from == null ? null : new Date(from), to == null ? null : new Date(to));
        }
    }

    @DELETE
    @Path("/{id}")
    public void delete(@PathParam("id") Long id) throws BasicException {
        BookingUser user = checkTokenAndRole(Role.ADMIN);
        controller.delete(id, user);
    }

}
