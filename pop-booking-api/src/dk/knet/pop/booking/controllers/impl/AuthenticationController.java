package dk.knet.pop.booking.controllers.impl;

import dk.knet.pop.booking.configs.Configs;
import dk.knet.pop.booking.controllers.IAuthenticationController;
import dk.knet.pop.booking.exceptions.BasicException;
import dk.knet.pop.booking.models.BookingUser;
import dk.knet.pop.booking.viewmodels.CaptchaResponse;
import dk.knet.pop.booking.viewmodels.LoginUserViewModel;
import lombok.extern.slf4j.Slf4j;
import org.glassfish.jersey.client.authentication.HttpAuthenticationFeature;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.Response.Status;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Formatter;

import static dk.knet.pop.booking.configs.Configs.CAPTCHA_ENABLED;

@Slf4j
public class AuthenticationController implements IAuthenticationController{

	private UserController userController = new UserController();
	private Client client = null;
	private final String captchaAuthUrl = Configs.CAPTCHA_URL;
	private final String captchaSecret = Configs.CAPTCHA_SECRET;
	public BookingUser authenticate(LoginUserViewModel userModel) throws BasicException{

		if(CAPTCHA_ENABLED && !validateCaptcha(userModel.getCaptchaToken())){
			log.error("Captcha error");
			throw new BasicException(Status.UNAUTHORIZED, "Hello? Are you a robot?");
		}
		//make sure user is being updated

		BookingUser	user = null;

		user = userController.updateUser(userModel.getUsername());
		if(user == null){
			throw new BasicException(Status.UNAUTHORIZED, "Username or password is incorrect");
		}
		if(!user.getIsUserActive()){
			throw new BasicException(Status.UNAUTHORIZED, "User account has been deactivated");
		}

		if(checkPassword(userModel.getPassword(), user.getPassword())){
			return user;
		}else{
			throw new BasicException(Status.UNAUTHORIZED, "Username or password is incorrect");
		}
	}

	protected boolean checkPassword(String password, String hashedPassword){
		if(hashedPassword == null)
		{
			log.warn("invalid hashed password: null");
			return false;
		}
		String[] parts = hashedPassword.split("\\$");
		if(parts.length < 3){
			log.error("hashed password invalid format. algorithm, salt or hash was missing from string");
			return false;
		}
		String alg = parts[0];
		String salt = parts[1];
		String hash = parts[2];
		MessageDigest crypt = null;
		try {
			crypt = MessageDigest.getInstance(alg);
		} catch (NoSuchAlgorithmException e) {
			log.error("Error using algorithm: " + alg, e);
			return false;
		}

		crypt.reset();
		try {
			crypt.update((salt+password).getBytes("UTF-8"));
		} catch (UnsupportedEncodingException e) {
			log.error("crypt createOrUpdate failed", e);
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
		if(token == null) return false;
		client = ClientBuilder.newBuilder().build();

		HttpAuthenticationFeature feature = HttpAuthenticationFeature
				.universalBuilder()
				.build();
		client.register(feature);

		WebTarget target = client
				.target(captchaAuthUrl)
                .queryParam("secret", captchaSecret)
                .queryParam("response", token);

		try {
			CaptchaResponse response = target
					.request("application/x-www-form-urlencoded")
					.post(Entity.json(new CaptchaRequest(captchaSecret, token)), CaptchaResponse.class);
			return response.isSuccess();
		}catch (Exception e){
			log.error("Captcha error, response failed", e);
		}
		return false;
	}

	public static class CaptchaRequest{
	    public String secret;
	    public String response;

	    public CaptchaRequest(String secret, String response){
	        this.secret = secret;
	        this.response = response;
        }
    }
}
