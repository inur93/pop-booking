package dk.knet.pop.booking.filters;

import dk.knet.pop.booking.database.DBContext;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.StaleObjectStateException;

import javax.annotation.Priority;
import javax.servlet.*;
import javax.ws.rs.WebApplicationException;

/**
 * Created: 23-03-2018
 * Owner: Runi
 */
@Priority(1100)
@Slf4j
public class HibernateFilter implements Filter {

    DBContext context;

    public HibernateFilter(){
        log.error("Hibernate filter");
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        log.error("startup initialized");
        DBContext.setup();
        this.context = DBContext.getInstance();
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) {
        try {
            log.debug("Starting a database transaction");

            context.getCurrentSession().beginTransaction();

            // Call the next filter (continue request processing)
            filterChain.doFilter(servletRequest, servletResponse);

            //request completed and now we commit our work
            context.getCurrentSession().getTransaction().commit();

            log.debug("Hibernate session has closed");

        } catch (StaleObjectStateException staleEx) {
            log.error("stale object state", staleEx);
            throw staleEx;
        } catch (Throwable ex) {
            log.error("trying to rollback", ex);
            try {
                if (context.getCurrentSession().getTransaction().isActive()) {
                    log.debug("Trying to rollback database transaction after exception");
                    context.getCurrentSession().getTransaction().rollback();
                }
            } catch (Throwable rbEx) {
                log.error("Could not rollback transaction after exception!", rbEx);
            }

            throw new WebApplicationException(ex.getMessage(), 503);
        }
    }

    @Override
    public void destroy() {

    }
}
