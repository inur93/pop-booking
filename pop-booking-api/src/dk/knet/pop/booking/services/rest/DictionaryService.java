package dk.knet.pop.booking.services.rest;

import dk.knet.pop.booking.database.DictionaryDao;
import dk.knet.pop.booking.database.LanguageDao;
import dk.knet.pop.booking.exceptions.BasicException;
import dk.knet.pop.booking.models.DictionaryEntry;
import dk.knet.pop.booking.models.Language;
import dk.knet.pop.booking.models.Role;
import lombok.extern.slf4j.Slf4j;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.Date;
import java.util.List;

/**
 * Created: 21-03-2018
 * Owner: Runi
 */

@Path("dictionary")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Slf4j
public class DictionaryService extends ProtectedService {

    private DictionaryDao dao = new DictionaryDao();

    @GET
    public List<DictionaryEntry> getAll(@QueryParam("lang") String language){
        if(language == null) return dao.getAll();
        return dao.getByLanguage(language);
    }

    @POST
    public DictionaryEntry create(DictionaryEntry entry) throws BasicException {
        checkTokenAndRole(Role.ADMIN);
        Date now = new Date();
        entry.setCreated(now);
        entry.setUpdated(now);
        return dao.create(entry);
    }

    @POST
    @Path("/create")
    public List<DictionaryEntry> createMultiple(List<DictionaryEntry> entries) throws BasicException{
        checkTokenAndRole(Role.ADMIN);
        Date now = new Date();
        for(DictionaryEntry entry : entries){
            entry.setCreated(now);
            entry.setUpdated(now);
            dao.create(entry);
        }
        return entries;
    }

    @PUT
    @Path("{id}")
    public DictionaryEntry update(@PathParam("id") Long id, DictionaryEntry entry) throws BasicException {
        checkTokenAndRole(Role.ADMIN);
        DictionaryEntry existing = dao.getById(id);
        existing.setUpdated(new Date());
        existing.setValue(entry.getValue());
        return dao.update(existing);
    }
}
