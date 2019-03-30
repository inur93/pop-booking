package dk.knet.pop.booking.filters;

import dk.knet.pop.booking.configs.Configs;
import dk.knet.pop.booking.controllers.ControllerRegistry;
import dk.knet.pop.booking.exceptions.MalformedAuthorizationHeaderException;
import dk.knet.pop.booking.exceptions.NotLoggedInException;
import dk.knet.pop.booking.models.BookingUser;
import dk.knet.pop.booking.viewmodels.JsonErrorMessage;
import dk.knet.pop.booking.security.JWTHandler;
import dk.knet.pop.booking.security.MalformedTokenException;
import dk.knet.pop.booking.security.PermissionDeniedException;
import dk.knet.pop.booking.security.PermissionExpiredException;
import lombok.extern.slf4j.Slf4j;

import javax.annotation.Priority;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ResourceInfo;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;
import java.io.IOException;
import java.util.Set;

/** Authorizationfilter - intercepts jwtTokens and validates global permissions. Resourcelevel Permissions are evaluated af resource level.
 * Created by Christian on 21-06-2017.
 */
@Priority(Priorities.AUTHENTICATION)
@Provider
@Slf4j
public class AuthorizationFilter implements ContainerRequestFilter {
    private static final String DELIMITER = " ";
    @Context
    ResourceInfo resourceInfo;
    @Context
    HttpHeaders headers;

    public AuthorizationFilter(){
        System.out.println("Authorization filter");
        log.error("authorization filter");
    }

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        if ("options".equals(requestContext.getMethod().toLowerCase())) {log.trace("OPTIONS is not filtered");return;}
        log.debug("Caught in AUTH-filter");
        SecureEndpoint annotation = resourceInfo.getResourceMethod().getAnnotation(SecureEndpoint.class);
        BookingUser user = null;
        if (annotation == null) { //No annotation on method level
            annotation = resourceInfo.getResourceClass().getAnnotation(SecureEndpoint.class);
        }
        if (annotation == null) { //No annotation on class level
            return;
            //No need to verify - EndPoint is not secured!
        }
        user = getUserFromHeader(requestContext);
        log.debug("User applied to context: " + user);
        requestContext.setProperty(Configs.CONTEXT_USER_KEY,user);
        if (annotation!=null) {
            SecureEndpoint.Permission[] annotationPermissions = annotation.value();

            if (!checkPermissions(user, annotationPermissions)) {
                StringBuilder allowedPerms = new StringBuilder();
                for (SecureEndpoint.Permission perm : annotationPermissions) {
                    allowedPerms.append(perm).append(" ");
                }
                requestContext.abortWith(Response.status(Response.Status.FORBIDDEN).entity("You do not have the right permission(s): " + allowedPerms.toString()).build());
                log.warn("Request for secure endpoint without proper permissions: " + user);
            }
            //Phew everything checked out! request ok!
        }
        // Accessing unsecured endpoint...
        log.trace("User accessing unsecure endpoint: " + resourceInfo.getResourceMethod());

    }

    private BookingUser getUserFromHeader(ContainerRequestContext requestContext) {
        BookingUser user = null;
        try {
            user = resolveUser();
        } catch (NotLoggedInException e) {
            //No problem - continue as anonymous
        } catch (PermissionDeniedException e) {
            requestContext.abortWith(Response.status(Response.Status.FORBIDDEN).entity(new JsonErrorMessage("Du har ikke de nødvendige rettigheder - Forsøg at logge ind igen")).build());
        } catch (MalformedAuthorizationHeaderException e) {
            log.warn("Malformed authorization header!: " +e.getMessage() );
            requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).entity(new JsonErrorMessage("Du er ikke korrekt logget ind - Forsøg at logge ind igen")).build());
        } catch (MalformedTokenException e) {
            requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).entity(new JsonErrorMessage("Du er ikke korrekt logget ind - Forsøg at logge ind igen")).build());
            log.warn("Malformed Token:" + e.getMessage());
        } catch (PermissionExpiredException e) {
            log.debug("User token expired " + e.getMessage());
            requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).entity(new JsonErrorMessage("Du er ikke korrekt logget ind - Forsøg at logge ind igen")).build());
        }
        return user;


    }

    private boolean checkPermissions(BookingUser user, SecureEndpoint.Permission... permissions) {
        for (SecureEndpoint.Permission permission : permissions) {
            Set<SecureEndpoint.Permission> userPermissions = ControllerRegistry.getUserController().getPermissions(user);
            if (userPermissions!=null && userPermissions.contains(permission)) {
                return true; //Users own permissions contains permission
            }
        }
        return false;
    }


    private BookingUser resolveUser() throws NotLoggedInException, MalformedAuthorizationHeaderException, PermissionExpiredException, PermissionDeniedException, MalformedTokenException {
        String authHeader = headers.getHeaderString(HttpHeaders.AUTHORIZATION);
        if (authHeader == null) {
            throw new NotLoggedInException("No securityToken - You need to login!");
        } else {
            String[] splitAuthHeader = authHeader.split(DELIMITER);
            if (splitAuthHeader.length != 2) {
                throw new MalformedAuthorizationHeaderException("Authorization header malformed: " + authHeader + ", Should be: 'Authorization: Bearer <JWTTOKEN>'");
            } else {
               return JWTHandler.getInstance().validateJWT(splitAuthHeader[1]);
            }

        }
    }



}
