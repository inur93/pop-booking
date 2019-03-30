package dk.knet.pop.booking.filters;

import javax.ws.rs.NameBinding;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Created by Christian on 15-06-2017.
 */
@NameBinding
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD})
public @interface SecureEndpoint {
    Permission[] value() default {};
    String group() default "";

    public enum Permission{
        ADMIN, BOOKER, ANONYMOUS, EDITOR
    }
}

