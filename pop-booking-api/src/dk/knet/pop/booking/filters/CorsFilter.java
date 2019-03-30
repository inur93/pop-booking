package dk.knet.pop.booking.filters;

import lombok.extern.slf4j.Slf4j;
import org.apache.log4j.Logger;

import javax.annotation.Priority;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.Context;
import javax.ws.rs.ext.Provider;
import java.io.IOException;

/**
 * Created: 17-02-2018
 * Owner: Runi
 */
@Slf4j
@Priority(500) //Before AuthorizationFilter (1000) to make sure that headers always get injected
@Provider
public class CorsFilter implements ContainerRequestFilter {
    @Context
    private HttpServletRequest request;
    @Context
    private HttpServletResponse response;

    public CorsFilter(){
        System.out.println("Cors filter");
        log.error("Cors filter");
    }

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        log.debug("Request caught in CORS-Filter:" +request.getRequestURI());
        setCORSHeaders();
    }


    private void setCORSHeaders() {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS, PATCH");
        String requestAllowHeader = request.getHeader("Access-Control-Request-Headers");
        response.setHeader("Access-Control-Allow-Headers",requestAllowHeader);
        response.setHeader("Access-Control-Allow-Credentials:", "true");
        response.setHeader("Access-Control-Expose-Headers","Authorization");
        response.setHeader("encoding", "utf-8");
    }

}
