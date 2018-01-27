package dk.knet.pop.booking.database;

import java.util.Date;
import java.util.List;

import javax.persistence.Query;

import dk.knet.pop.booking.exceptions.BasicException;
import dk.knet.pop.booking.exceptions.InvalidArgsException;
import dk.knet.pop.booking.models.BookingType;
import dk.knet.pop.booking.models.ClosedPeriod;

public class ClosedPeriodsDAO extends BasicDAO{

	public ClosedPeriod create(ClosedPeriod period) throws BasicException{
		start();
		ClosedPeriod newPeriod = null;
		if(isPeriodValid(period)){
			newPeriod = simpleSaveNew(period);
		}
		end();
		return newPeriod;
	}

	public void update(ClosedPeriod period) throws BasicException{

		if(isPeriodValid(period)){
			start();
			simpleUpdate(period);
			end();
		}
	}

	public void delete(ClosedPeriod period) {
		start();
		simpleDelete(period);
		end();
	}

	public ClosedPeriod getById(Long id){
		start();
		ClosedPeriod period = simpleGet(ClosedPeriod.class, id);
		end();
		return period;
	}

	@SuppressWarnings("unchecked")
	public List<ClosedPeriod> get(Date from, Date to){
		start();
		List<ClosedPeriod> periods = null;
		if(from == null || to == null){
			periods = simpleGetAll(ClosedPeriod.class);
		}else{
			String queryStr = "SELECT P "
					+ "FROM ClosedPeriod P "
					+ "WHERE ("
					+ "(P.end > :start AND P.end < :end) OR "
					+ "(P.start > :start AND P.start < :end))";
			Query query = s.createQuery(queryStr);

			query.setParameter("start", from);
			query.setParameter("end", to);
			periods = query.getResultList();
		}
		end();
		return periods;
	}

	@SuppressWarnings("unchecked")
	public List<ClosedPeriod> getByType(BookingType type, Date from, Date to){
		start();
		List<ClosedPeriod> periods = null;
		if(from == null || to == null){
			periods = simpleGetAll(ClosedPeriod.class);
		}else{
			String queryStr = "SELECT P "
					+ "FROM ClosedPeriod P "
					+ "WHERE :type in elements(P.applyToTypes) AND("
					+ "(P.end > :start AND P.end < :end) OR "
					+ "(P.start > :start AND P.start < :end))";
			Query query = s.createQuery(queryStr);

			query.setParameter("start", from);
			query.setParameter("end", to);
			query.setParameter("type", type);
			periods = query.getResultList();
		}
		end();
		return periods;
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
