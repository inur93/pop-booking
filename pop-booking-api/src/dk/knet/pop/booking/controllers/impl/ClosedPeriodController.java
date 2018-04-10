package dk.knet.pop.booking.controllers.impl;

import java.util.Date;
import java.util.List;

import dk.knet.pop.booking.database.ClosedPeriodsDAO;
import dk.knet.pop.booking.exceptions.BadRequestException;
import dk.knet.pop.booking.exceptions.BasicException;
import dk.knet.pop.booking.exceptions.InvalidArgsException;
import dk.knet.pop.booking.models.BookingType;
import dk.knet.pop.booking.models.BookingUser;
import dk.knet.pop.booking.models.ClosedPeriod;

import static dk.knet.pop.booking.configs.ErrorStrings.ERROR_AUTHENTICATION_PERMISSION_DENIED;

public class ClosedPeriodController {

	private ClosedPeriodsDAO dao = new ClosedPeriodsDAO();
	
	public ClosedPeriod create(ClosedPeriod period, BookingUser user) throws BasicException{
		if(user == null) throw new BadRequestException(ERROR_AUTHENTICATION_PERMISSION_DENIED);
		Date created = new Date();
		period.setCreated(created);
		period.setLastUpdated(created);
		period.setCreatedBy(user);
		period.setLastUpdatedBy(user);
		if(isPeriodValid(period)) {
			return dao.create(period);
		}
		return null;
	}
	
	public ClosedPeriod update(ClosedPeriod period, BookingUser user) throws BasicException{
		if(user == null) throw new BadRequestException(ERROR_AUTHENTICATION_PERMISSION_DENIED);
		ClosedPeriod current = dao.getById(period.getId());
		Date updated = new Date();
		//set properties that can't be set manually
		period.setLastUpdated(updated);
		period.setLastUpdatedBy(user);
		period.setCreated(current.getCreated());
		period.setCreatedBy(current.getCreatedBy());
		
		return dao.createOrUpdate(period);
	}
	
	public void delete(Long id, BookingUser user) throws BasicException{
		if(user == null) throw new BadRequestException(ERROR_AUTHENTICATION_PERMISSION_DENIED);
		dao.delete(dao.getById(id));
	}
	
	public List<ClosedPeriod> get(Date from, Date to) {
		return dao.get(from, to);
	}
	
	public List<ClosedPeriod> getByType(BookingType type, Date from, Date to) {
		return dao.getByType(type, from, to);
	}


	private boolean isPeriodValid(ClosedPeriod period) throws BasicException{
		boolean itemsEmpty = period.getApplyToItems() == null && period.getApplyToItems().isEmpty();
		boolean typesEmpty = period.getApplyToTypes() == null && period.getApplyToTypes().isEmpty();
		if(itemsEmpty && typesEmpty){
			throw new InvalidArgsException("An item or item must be selected for the closed period.");
		}

		if(period.getStart() == null){
			throw new InvalidArgsException("A start date was not defined for the closed period");
		}

		if(period.getEnd() == null){
			throw new InvalidArgsException("An end date was not defined for the closed period");
		}

		return true;
	}
}
