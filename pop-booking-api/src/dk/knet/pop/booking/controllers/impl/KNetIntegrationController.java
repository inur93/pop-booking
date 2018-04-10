package dk.knet.pop.booking.controllers.impl;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import dk.knet.pop.booking.models.BookingUser;
import lombok.extern.slf4j.Slf4j;
import org.glassfish.jersey.client.ClientProperties;
import org.glassfish.jersey.client.authentication.HttpAuthenticationFeature;

import dk.knet.pop.booking.models.knet.KnetUser;
import dk.knet.pop.booking.models.knet.KnetUsers;
import dk.knet.pop.booking.models.knet.KnetVlan;

@Slf4j
public class KNetIntegrationController {

	private final String targetUrl = ConfigManager.K_NET_API_URL;// "https://k-net.dk/api/v2/network/";
	private final String userPath = "user";
	private final String vlanPath = "vlan";
	private final String queryParamFormatKey = "format";
	private final String queryParamFormatValue = "json";
	private final String queryParamUsernameKey = "username";
	private final String username = ConfigManager.USERNAME;
	private final String password = ConfigManager.PASSWORD;

	private Client client = null;
	public KnetUser getUserByUsername(String username){
		Response res = buildAndGetResponse(null, userPath, new QueryParam(queryParamUsernameKey, username));
		KnetUsers users = res.readEntity(KnetUsers.class);
		close();
		if(users.getResults() != null && users.getResults().size() > 0){

			return users.getResults().get(0);
		}
		log.warn("user not found in knet: " + username);
		////System.err.println("No user found for username:" + username);
		return null;
	}

	public KnetVlan getUserVlan(String vlanurl){
		Response res = buildAndGetResponse(vlanurl, null);
		KnetVlan vlan = res.readEntity(KnetVlan.class);
		close();
		return vlan;

	}

	private Response buildAndGetResponse(String targetUrl, String path, QueryParam... params){

		client = ClientBuilder.newBuilder().build();

		HttpAuthenticationFeature feature = HttpAuthenticationFeature
				.universalBuilder()
				.credentialsForBasic(username, password)
				.credentials(username, password)
				.build();

		client.register(feature);

		WebTarget target = client
				.target(targetUrl == null ? this.targetUrl : targetUrl)
				.property(ClientProperties.FOLLOW_REDIRECTS, Boolean.TRUE)
				.path(path == null ? "" : path)
				.queryParam(queryParamFormatKey, queryParamFormatValue);

		if(params != null){
			for(QueryParam param : params){
				target = target.queryParam(param.key, param.value);
			}
		}
		Response response = target.request(MediaType.APPLICATION_JSON).get();
		return response;
	}

	private void close(){
		if(client != null) client.close();
	}
	private class QueryParam{
		public String key;
		public String value;

		public QueryParam(String key, String value){
			this.key = key;
			this.value = value;
		}
	}
}

