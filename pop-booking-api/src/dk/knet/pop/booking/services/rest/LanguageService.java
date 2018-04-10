package dk.knet.pop.booking.services.rest;

import dk.knet.pop.booking.database.LanguageDao;
import dk.knet.pop.booking.models.Language;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

/**
 * Created: 24-03-2018
 * Owner: Runi
 */
@Path("languages")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class LanguageService {

    private LanguageDao languageDao = new LanguageDao();

    @GET
    public List<Language> getLanguages(){
        return languageDao.getAll();
    }

    @POST
    public Language createLanguage(Language language){
        return languageDao.create(language);
    }

    @PUT
    public Language updateLanguage(Language language){
        return languageDao.update(language);
    }
}
