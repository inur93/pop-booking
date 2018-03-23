package dk.knet.pop.booking.database;

import dk.knet.pop.booking.models.BookableItem;
import dk.knet.pop.booking.models.DictionaryEntry;

import java.util.List;

/**
 * Created: 21-03-2018
 * Owner: Runi
 */

public class DictionaryDao extends BasicDAO {


    public List<DictionaryEntry> getAll(){
        start();
        List<DictionaryEntry> all = simpleGetAll(DictionaryEntry.class);
        end();
        return all;
    }

    public List<DictionaryEntry> getAll(String lang){
        start();

        List<DictionaryEntry> items =s.createQuery("FROM DictionaryEntry WHERE language=" + lang).getResultList();
        end();
        return items;
    }

    public DictionaryEntry save(DictionaryEntry entry){
        start();
        DictionaryEntry saved = simpleSave(entry);
        end();
        return saved;
    }
}
