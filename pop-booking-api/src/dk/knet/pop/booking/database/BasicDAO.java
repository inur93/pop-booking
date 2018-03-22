package dk.knet.pop.booking.database;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.persistence.PersistenceException;
import javax.persistence.Query;

import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.SessionFactory;


public class BasicDAO {

	protected Session s = null;
	protected BasicDAO() {
	}


	protected <T> T simpleSave(T jpaObject) throws PersistenceException {
		s.saveOrUpdate(jpaObject);
		s.flush(); 
		return jpaObject;
	}
	
	protected <T> T simpleUpdate(T jpaObject) {
		s.update(jpaObject);
		s.flush();
		return jpaObject;
	}

	/**
	 * Objects is left in transient state, remember to call flush
	 * @param jpaObject
	 * @return
	 * @throws PersistenceException
	 */
	protected <T> T simpleSaveDontFlush(T jpaObject) throws PersistenceException {
		s.saveOrUpdate(jpaObject);
		return jpaObject;
	}

	protected <T> List<T> simpleSaveAll(List<T> jpaObjects) throws PersistenceException {
		for(T jpaObject:jpaObjects){
			s.saveOrUpdate(jpaObject);
		}
		s.flush(); 

		return jpaObjects;
	}	

	protected <T> void simpleDelete(T jpaObject) {
		s.delete(jpaObject);
		s.flush();
	}	

	protected <T> void simpleDeleteAll(List<T> jpaObjects) throws PersistenceException {
		for(T jpaObject:jpaObjects){
			s.delete(jpaObject);
		}
		s.flush(); 
	}

	protected <T> T simpleGet(Class <T> classType, Long id) {
		T jpaObject = null;
		jpaObject = s.get(classType, id);
		return jpaObject;
	}
	
	protected <T> T simpleGet(Class <T> classType, String id){
		T jpaObject = null;
		jpaObject = s.get(classType, id);
		return jpaObject;
	}

	protected <T> List<T> simpleGetAll(Class <T> classType) {
		String className = classType.getSimpleName(); 
		List<T> jpaObjects = null;
		jpaObjects = (List<T>) s.createQuery("from " + className, classType).getResultList();
		return jpaObjects;		
	}

	@SuppressWarnings("unchecked")
	protected <T> List<T> simpleGetPage(Class <T> classType, int noPrPage, int page) {
		String className = classType.getSimpleName(); 
		List<T> jpaObjects = null;
		
		Query q = s.createQuery("from " + className, classType);
		q.setFirstResult(noPrPage * page);
		q.setMaxResults(noPrPage);
		jpaObjects = (List<T>) q.getResultList();

		return jpaObjects;		
	}



	protected <T> T simpleSaveNew(T jpaObject) throws PersistenceException {
		s.save(jpaObject);
		s.flush();
		return jpaObject;
	}

	protected <T> void simpleDeleteNew(T jpaObject) {
		s.delete(jpaObject);
	}	

	protected <T> T simpleGetNew(Class <T> classType, Long id) {
		T jpaObject = null;
		jpaObject = s.get(classType, id);
		return jpaObject;
	}

	protected <T> List<T> simpleGetAllNew(Class <T> classType) {
		String className = classType.getSimpleName(); 
		List<T> jpaObjects = null;
		jpaObjects = (List<T>) s.createQuery("from " + className, classType).getResultList();
		return jpaObjects;		
	}

	@SuppressWarnings("unchecked")
	protected <T> List<T> simpleGetPageNew(Class <T> classType, int noPrPage, int page) {
		////System.out.println("simpleGetPage: " + classType.getSimpleName());
		String className = classType.getSimpleName(); 
		List<T> jpaObjects = null;

		Query q = s.createQuery("from " + className, classType);
		q.setFirstResult(noPrPage * page);
		q.setMaxResults(noPrPage);
		jpaObjects = (List<T>) q.getResultList();
		return jpaObjects;		
	}

	protected void start(){
		s = DBContext.getInstance().start();
		
	}

	protected void end(){
		DBContext.getInstance().end(s);
	}




}
