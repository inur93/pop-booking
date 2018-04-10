package dk.knet.pop.booking.database;

import dk.knet.pop.booking.models.DictionaryEntry;

import java.util.List;

/**
 * Created: 21-03-2018
 * Owner: Runi
 */

public class DictionaryDao extends BasicDAO<DictionaryEntry> {


    public DictionaryDao() {
        super(DictionaryEntry.class);
    }

    public List<DictionaryEntry> getByLanguage(String lang){
        List<DictionaryEntry> list = (List<DictionaryEntry>) s.createQuery("FROM DictionaryEntry WHERE language='" + lang + "'").getResultList();
        s.flush();
        return list;
    }
}
