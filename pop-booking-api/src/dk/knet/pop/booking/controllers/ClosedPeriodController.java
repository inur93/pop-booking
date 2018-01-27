package dk.knet.pop.booking.controllers;

import java.util.Date;
import java.util.List;

import dk.knet.pop.booking.database.ClosedPeriodsDAO;
import dk.knet.pop.booking.exceptions.BadRequestException;
import dk.knet.pop.booking.exceptions.BasicException;
import dk.knet.pop.booking.exceptions.InvalidArgsException;
import dk.knet.pop.booking.models.BookingType;
import dk.knet.pop.booking.models.BookingUser;
import dk.knet.pop.booking.models.ClosedPeriod;

public class ClosedPeriodController {

	private ClosedPeriodsDAO dao = new ClosedPeriodsDAO();
	
	public ClosedPeriod create(ClosedPeriod period, BookingUser user) throws BasicException{
		if(user == null) throw new BadRequestException("User could not be resolved");
		Date created = new Date();
		period.setCreated(created);
		period.setLastUpdated(created);
		period.setCreatedBy(user);
		period.setLastUpdatedBy(user);
		return dao.create(period);
	}
	
	public void update(ClosedPeriod period, BookingUser user) throws BasicException{
		if(user == null) throw new BadRequestException("User could not be resolved");
		ClosedPeriod current = dao.getById(period.getId());
		Date updated = new Date();
		//set properties that can't be set manually
		period.setLastUpdated(updated);
		period.setLastUpdatedBy(user);
		period.setCreated(current.getCreated());
		period.setCreatedBy(current.getCreatedBy());
		
		dao.update(period);
	}
	
	public void delete(Long id, BookingUser user) throws BasicException{
		if(user == null) throw new BadRequestException("User could not be resolved");
		dao.delete(dao.getById(id));
	}
	
	public List<ClosedPeriod> get(Date from, Date to) throws BasicException{
		return dao.get(from, to);
	}
	
	public List<ClosedPeriod> getByType(BookingType type, Date from, Date to) throws BasicException{
		return dao.getByType(type, from, to);
	}
}
