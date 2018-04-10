package dk.knet.pop.booking.database;

import dk.knet.pop.booking.models.Language;

/**
 * Created: 24-03-2018
 * Owner: Runi
 */

public class LanguageDao extends BasicDAO<Language> {

    public LanguageDao(){
        super(Language.class);
    }
}
