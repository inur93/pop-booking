package dk.knet.pop.booking.database;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.persistence.PersistenceException;
import javax.persistence.Query;

import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.SessionFactory;


public class BasicDAO<T> {

    protected Session s = null;
    protected final Class<T> type;

    protected BasicDAO(Class<T> type) {
        this.type = type;
        s = DBContext.getInstance().getCurrentSession();//SessionRegistry.getSessionFactory().getCurrentSession();
    }


    public T createOrUpdate(T jpaObject) throws PersistenceException {
        s.clear();
        s.saveOrUpdate(jpaObject);
        s.flush();
        return jpaObject;
    }

    public T update(T jpaObject) {
        s.clear();
        s.update(jpaObject);
        s.flush();
        return jpaObject;
    }

    public void delete(T jpaObject) {
        s.delete(jpaObject);
        s.flush();
    }

    public T getById(Long id) {
        T obj = s.get(this.type, id);
        s.flush();
        return obj;
    }

	/*public T getById(String id){
		return s.get(type, id);
	}*/

    public List<T> getAll() {
        List<T> list = s.createQuery("from " + type.getSimpleName(), type).getResultList();
        s.flush();
        return list;
    }

    @SuppressWarnings("unchecked")
    public List<T> getPage(int noPrPage, int page) {

        List<T> jpaObjects = null;
        s.clear();
        Query q = s.createQuery("from " + type.getSimpleName(), type);
        q.setFirstResult(noPrPage * page);
        q.setMaxResults(noPrPage);
        jpaObjects = (List<T>) q.getResultList();
        s.flush();
        return jpaObjects;
    }

    public List<T> query(int page, int noPrPage, String field, String query) {
        Query q = s.createQuery("from " + type.getSimpleName() + " where " + field + " LIKE %" + query + "%");
        if (page >= 0) q.setFirstResult(page * noPrPage);
        if (page > 0) q.setMaxResults(noPrPage);
        return q.getResultList();
    }

    public List<T> query(int page, int noPrPage, String[] fields, String query) {
        String queryStr = "from " + type.getSimpleName();
        if(fields.length > 0) queryStr += " where";
        for(int i = 0; i < fields.length; i++) {
            if(i > 0) queryStr += " OR";
            queryStr += " " + fields[i] + " LIKE '%" + query + "%'";
        }
        Query q = s.createQuery(queryStr);
        if (page >= 0) q.setFirstResult(page * noPrPage);
        if (noPrPage > 0) q.setMaxResults(noPrPage);
        return q.getResultList();
    }

    public Long count(){
        return (Long) s.createQuery("select count(*) from " + type.getSimpleName()).uniqueResult();
    }



    public T create(T jpaObject) throws PersistenceException {
        s.save(jpaObject);
        s.flush();
        return jpaObject;
    }

    public void deleteById(long id) {
        delete(getById(id));
    }
}
