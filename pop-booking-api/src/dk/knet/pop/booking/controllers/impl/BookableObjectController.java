package dk.knet.pop.booking.controllers.impl;

import java.util.List;

import dk.knet.pop.booking.database.BookableObjectDAO;
import dk.knet.pop.booking.exceptions.BadRequestException;
import dk.knet.pop.booking.exceptions.BasicException;
import dk.knet.pop.booking.models.BookableItem;
import dk.knet.pop.booking.models.BookingType;

import static dk.knet.pop.booking.configs.ErrorStrings.ERROR_BOOKABLE_ITEM_INVALID;

public class BookableObjectController {
	BookableObjectDAO dao = new BookableObjectDAO();

	public BookableItem createBookableItem(BookableItem item) throws BasicException{
		if(/*item.getBookingType() != null && //this is currently not used - but could be reintroduced*/
				item.getColor() != null &&
				item.getName() != null){
			return dao.create(item);

		}else{
			throw new BadRequestException(ERROR_BOOKABLE_ITEM_INVALID);
		}
	}

	public BookableItem updateBookableItem(BookableItem item) {
		return dao.createOrUpdate(item);
	}

	public List<BookableItem> getBookableObjectsByType(BookingType type){
		return dao.getBookableObjectsByType(type);
	}

	public List<BookableItem> getAllBookableItems(){
		return dao.getAll();
	}

	public void deleteBookableItem(long id){
		dao.deleteById(id);
	}
}
