package dk.knet.pop.booking.services.rest;

import dk.knet.pop.booking.database.UserDAO;
import dk.knet.pop.booking.exceptions.BasicException;
import dk.knet.pop.booking.models.BookingUser;
import dk.knet.pop.booking.viewmodels.ListWithTotal;
import dk.knet.pop.booking.models.Role;
import lombok.extern.slf4j.Slf4j;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

/**
 * Created: 25-03-2018
 * Owner: Runi
 */

@Slf4j
@Path("/v1/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserService extends ProtectedService {

    private UserDAO dao = new UserDAO();


    @GET
    @Path("permissions")
    public Role[] getPermissions(){
        return Role.values();
    }

    @GET
    public ListWithTotal<BookingUser> getUsers(@QueryParam("query") String query, @QueryParam("page") Integer page, @QueryParam("size") Integer size) throws BasicException {
        checkTokenAndRole(Role.ADMIN);
        String[] fields = new String[]{"username", "name", "roomNo"};
        List<BookingUser> users;
        if(page != null && size != null){
            if(query != null){
                users = dao.query(page, size, fields, query);
            }else{
                users = dao.getPage(size, page);
            }
        }else {
            if(query != null){
                users = dao.query(-1, -1, fields, query);
            }else{
                users = dao.getAll();
            }
        }

        int total = dao.count().intValue();
        ListWithTotal<BookingUser> list = new ListWithTotal<>(total, users);
        return list;
    }

    @GET
    @Path("/self")
    public BookingUser getSelf() throws BasicException {
        BookingUser user = checkTokenAndRole();
        return dao.getById(user.getId());
    }

    @PUT
    @Path("/self")
    public BookingUser updateSelf(BookingUser self) throws BasicException {
        BookingUser user = checkTokenAndRole();
        if(user.getId() == self.getId()) {
            BookingUser existing = dao.getById(self.getId());
            //existing.setRoles(self.getRoles());
            //existing.setRoomNo(self.getRoomNo());
            existing.setName(self.getName());
            return dao.update(existing);
        }
        throw new BasicException(Response.Status.FORBIDDEN ,"Invalid user");
    }

    @PUT
    @Path("/{id}")
    public BookingUser updateUser(BookingUser user) throws BasicException {
        BookingUser requester = checkTokenAndRole(Role.ADMIN);
        BookingUser existing = dao.getById(user.getId());
        //admin is only allowed to edit permissions
        existing.setRoles(user.getRoles());
        return dao.update(existing);
    }
}
