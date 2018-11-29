package dk.knet.pop.booking.services.rest;

import dk.knet.pop.booking.filters.HibernateFilter;
import lombok.extern.slf4j.Slf4j;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;
import java.util.Set;

@Slf4j
@ApplicationPath("/api")
public class PopBooking extends Application {

    /*  public PopBooking(){
        super();
        log.error("popbooking application");
    }*/
    /*@Override
    public Set<Class<?>> getClasses() {
        final Set<Class<?>> classes = new HashSet<Class<?>>();
        // register resources and features
        classes.add(MultiPartFeature.class);
        classes.add(MultipartDataSource.class);
        classes.add(FormDataContentDisposition.class);
        classes.add(InputStream.class);
        classes.add(MultiPart.class);
        classes.add(MimeMultipart.class);
        classes.add(BookingService.class);
     
        //System.out.println("added classes");
        return classes;
    }*/

    
}