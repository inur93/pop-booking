package dk.knet.pop.booking.database;

import java.util.Date;
import java.util.List;

import javax.persistence.Query;

import dk.knet.pop.booking.models.BookingType;
import dk.knet.pop.booking.models.ClosedPeriod;

public class ClosedPeriodsDAO extends BasicDAO<ClosedPeriod> {

	public ClosedPeriodsDAO() {
		super(ClosedPeriod.class);
	}

	@SuppressWarnings("unchecked")
	public List<ClosedPeriod> get(Date from, Date to){

		List<ClosedPeriod> periods = null;
		if(from == null || to == null){
			periods = getAll();
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
		s.flush();
		return periods;
	}

	@SuppressWarnings("unchecked")
	public List<ClosedPeriod> getByType(BookingType type, Date from, Date to){
		List<ClosedPeriod> periods = null;
		if(from == null || to == null){
			periods = getAll();
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
		s.flush();
		return periods;
	}
}
