package dk.knet.pop.booking.utils;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created: 27-05-2018
 * author: Runi
 */

public class DateUtil {


    public static String formatDate(Date date){
        return formatDate(date, "dd-MM-yyyy HH:mm");
    }
    public static String formatDate(Date date, String format){
        SimpleDateFormat DATE_FORMAT = new SimpleDateFormat(format);
        return DATE_FORMAT.format(date);
    }
}
