package dk.knet.pop.booking.filters;

import dk.knet.pop.booking.exceptions.BasicException;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

@Provider
public class CustomExceptionMapper implements ExceptionMapper<BasicException>{

	@Override
	public Response toResponse(BasicException exception) {
		return Response.status(exception.code).type(MediaType.APPLICATION_JSON_TYPE).entity("{\"message\":\""+exception.getMessage() + "\"}").build();
	}

}
