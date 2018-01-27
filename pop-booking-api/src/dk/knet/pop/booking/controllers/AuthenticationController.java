package dk.knet.pop.booking.controllers;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Formatter;

import javax.security.auth.login.LoginException;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.Response.Status;

import org.glassfish.jersey.client.authentication.HttpAuthenticationFeature;

import dk.knet.pop.booking.exceptions.BasicException;
import dk.knet.pop.booking.models.BookingUser;
import dk.knet.pop.booking.models.CaptchaResponse;
import dk.knet.pop.booking.security.JWTHandler;

public class AuthenticationController {

	private UserController userController = new UserController();
	private Client client = null;
	private final String captchaAuthUrl = ConfigManager.read(ConfigManager.CAPTCHA_URL);
	private final String captchaSecret = ConfigManager.read(ConfigManager.CAPTCHA_SECRET);
	public BookingUser authenticate(BookingUser userModel) throws BasicException{
		
		if(!validateCaptcha(userModel.getCaptchaToken())){
			throw new BasicException(Status.UNAUTHORIZED, "You are a robot!");
		}
		//make sure user is being updated
		
		BookingUser	user = null;
		try{
		user = userController.updateUser(userModel.getUsername());
		if(user == null){
			throw new BasicException(Status.UNAUTHORIZED, "No user found with given username");
		}
		if(!user.getIsUserActive()){
			throw new BasicException(Status.UNAUTHORIZED, "Account has been deactivated");
		}
		
		if(checkPassword(userModel.getPassword(), user.getPassword())){
			JWTHandler handler = new JWTHandler();
			String token = handler.createJWT(user, 1000*36L);
			user.setToken(token);
			////System.out.println("user authenticated: " + token);
		}else{
			throw new BasicException(Status.UNAUTHORIZED, "Invalid credentials.");
		}
		user.setPassword(null);
		}catch(Exception e){
			throw new BasicException(Status.FORBIDDEN, e.getMessage());
		}
		return user;
	}
	
	
	
	private boolean checkPassword(String password, String saved){
		String[] parts = saved.split("\\$");
		String alg = parts[0];
		String salt = parts[1];
		String hash = parts[2];
		MessageDigest crypt = null;
		try {
			crypt = MessageDigest.getInstance(alg);
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
			return false;
		}
	
		crypt.reset();
		try {
			crypt.update((salt+password).getBytes("UTF-8"));
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
			return false;
		}
		byte[] bytes = crypt.digest();
		String hashToCheck = byteToHex(bytes);
		
		return hash.equals(hashToCheck);
	}
	
	private String byteToHex(final byte[] hash)
	{
		Formatter formatter = new Formatter();
		for (byte b : hash)
		{
			formatter.format("%02x", b);
		}
		String result = formatter.toString();
		formatter.close();
		return result;
	}
	
	private boolean validateCaptcha(String token){
		client = ClientBuilder.newBuilder().build();

		HttpAuthenticationFeature feature = HttpAuthenticationFeature
				.universalBuilder()
				.build();
		client.register(feature);

		WebTarget target = client
				.target(captchaAuthUrl)
				.queryParam("secret", this.captchaSecret)
				.queryParam("response", token);

		
		CaptchaResponse response = target
//				.request(MediaType.APPLICATION_JSON)
				.request("application/x-www-form-urlencoded")
				.header("Content-length", "0")
				.post(null, CaptchaResponse.class);
		return response.isSuccess();
	}

}
