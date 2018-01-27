package dk.knet.pop.booking.controllers;

import java.util.List;

import dk.knet.pop.booking.database.BookableObjectDAO;
import dk.knet.pop.booking.exceptions.BadRequestException;
import dk.knet.pop.booking.exceptions.BasicException;
import dk.knet.pop.booking.models.BookableItem;
import dk.knet.pop.booking.models.BookingType;

public class BookableObjectController {
	BookableObjectDAO dao = new BookableObjectDAO();

	public BookableItem createBookableItem(BookableItem item) throws BasicException{
		if(item.getBookingType() != null &&
				item.getColor() != null &&
				item.getName() != null){
			return dao.createBookableObject(item);

		}else{

			String info = "";
			if(item.getName() == null) info += "name was null";
			if(item.getBookingType() == null) info += "\\nbooking type was null";
			if(item.getColor() == null) info += "\\n color was null";

			throw new BadRequestException("the bookable item was missing a property\\n" + info);
		}
	}

	public void updateBookableItem(BookableItem item) throws BasicException{
		dao.updateBookableItem(item);
	}

	public List<BookableItem> getBookableObjectsByType(BookingType type){
		return dao.getBookableObjectsByType(type);
	}

	public List<BookableItem> getAllBookableItems(){
		return dao.getBookableObjects();
	}

	public void deleteBookableItem(long id){
		dao.deleteBookableItem(id);
	}
}
