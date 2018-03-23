package dk.knet.pop.booking.services.rest;

import dk.knet.pop.booking.database.DictionaryDao;
import dk.knet.pop.booking.models.BookableItem;
import dk.knet.pop.booking.models.DictionaryEntry;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

/**
 * Created: 21-03-2018
 * Owner: Runi
 */

@Path("dictionary")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class DictionaryService extends ProtectedService {

    private DictionaryDao dao = new DictionaryDao();
    @GET
    public List<DictionaryEntry> getAll(@QueryParam("lang") String language){
        if(language == null) return dao.getAll();
        return dao.getAll(language);
    }

    @POST
    public DictionaryEntry update(DictionaryEntry entry){
        return dao.save(entry);
    }
}
