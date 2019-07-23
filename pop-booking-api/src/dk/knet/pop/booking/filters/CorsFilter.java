package dk.knet.pop.booking.filters;

import dk.vormadal.configservice.Configuration;
import lombok.extern.slf4j.Slf4j;
import org.apache.log4j.Logger;

import javax.annotation.Priority;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.*;

import static dk.vormadal.configservice.Configuration.get;

/**
 * Created: 17-02-2018
 * Owner: Runi
 */
@Slf4j
@Priority(500) //Before AuthorizationFilter (1000) to make sure that headers always get injected
@Provider
public class CorsFilter implements ContainerRequestFilter, ContainerResponseFilter {
    @Context
    private HttpServletRequest request;
    @Context
    private HttpServletResponse response;

    private final Set<String> allowedOrigins;
    private final String primaryOrigin;

    public CorsFilter() {
        System.out.println("Cors filter");
        String allowed = get("booking.cors.allowed_origins", "*");
        String[] values = allowed.split(";");
        primaryOrigin = values[0];
        allowedOrigins = new HashSet<>(Arrays.asList(values));


        log.error("Cors filter");
    }

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        if (isPreflightRequest(requestContext)) {
            requestContext.abortWith(Response.ok().build());
        }
    }

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) throws IOException {
        String origin = requestContext.getHeaderString("Origin");
        if (origin == null) {
            return;
        }

        if (isPreflightRequest(requestContext)) {
            response.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS, PATCH");
            String requestAllowHeader = request.getHeader("Access-Control-Request-Headers");
            response.setHeader("Access-Control-Allow-Headers", requestAllowHeader);
            response.setHeader("Access-Control-Allow-Credentials:", "true");
            response.setHeader("Access-Control-Expose-Headers", "Authorization");
            response.setHeader("encoding", "utf-8");
        }

        response.setHeader("Vary", "Origin"); //Access-Control-Allow-Origin might vary - tell the browser
        String allowed = primaryOrigin;
        if (allowedOrigins.contains(origin)) {
            allowed = origin;
        } else if (allowedOrigins.contains("*")) { //if everyone is allowed then let them know - should be avoided though
            allowed = "*";
        }
        response.setHeader("Access-Control-Allow-Origin", allowed);
    }

    private boolean isPreflightRequest(ContainerRequestContext request) {
        return request.getHeaderString("Origin") != null
                && request.getMethod().equalsIgnoreCase("OPTIONS");
    }

}
