package dk.knet.pop.booking.database;

import dk.knet.pop.booking.models.BookableItem;
import dk.knet.pop.booking.models.BookingType;

import java.util.List;

public class BookableObjectDAO extends BasicDAO{

	public List<BookableItem> getBookableObjects(){
		start();
		List<BookableItem> list = simpleGetAll(BookableItem.class);
		end();
		return list;
	}
	
	@SuppressWarnings("unchecked")
	public List<BookableItem> getBookableObjectsByType(BookingType type){
		start();
		List<BookableItem> items = s.createQuery("FROM BookableItem WHERE bookingType = " + type.ordinal() + "").getResultList();
		end();
		return items;
	}
	
	public BookableItem createBookableObject(BookableItem bookable){
		start();
		BookableItem created = simpleSaveNew(bookable);
		end();
		return created;
	}
	
	public BookableItem updateBookableItem(BookableItem item){
		start();
		BookableItem updated = simpleUpdate(item);
		end();
		return updated;
	}
	
	public void deleteBookableItem(long id){
		//TODO set delete column to true
		start();
		BookableItem item = simpleGet(BookableItem.class, id);
		simpleDelete(item);
		end();
		
	}
}
