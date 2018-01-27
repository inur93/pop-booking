package dk.knet.pop.booking.database;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.boot.MetadataSources;
import org.hibernate.boot.registry.StandardServiceRegistry;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;

public class DBContext {

	private static DBContext instance;
	private static boolean init = false;
	public synchronized static DBContext getInstance(){
		if(instance == null){
			instance = new DBContext();

		}
		if(!init) instance.setup();
		return instance;

	}

	private SessionFactory sessionFactory;

	private DBContext(){

	}

	private void setup(){
		init = true;
		final StandardServiceRegistry registry = new StandardServiceRegistryBuilder()
				.configure() // configures settings from hibernate.cfg.xml
				.build();
		try {
			sessionFactory = new MetadataSources(registry).buildMetadata().buildSessionFactory();

		} catch (Exception ex) {
			StandardServiceRegistryBuilder.destroy(registry);
			ex.printStackTrace();
		}
	}

	public Session start(){
		Session session = sessionFactory.openSession();		
		session.beginTransaction();
		return session;
	}

	public void end(Session session){
		session.getTransaction().commit();
		session.close();
	}

	public void exit(){
		sessionFactory.close();
	}
}
