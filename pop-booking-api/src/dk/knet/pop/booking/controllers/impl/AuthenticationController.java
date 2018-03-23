package dk.knet.pop.booking.controllers.impl;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Formatter;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.Response.Status;

import dk.knet.pop.booking.controllers.IAuthenticationController;
import dk.knet.pop.booking.models.LoginUserViewModel;
import lombok.extern.slf4j.Slf4j;
import org.glassfish.jersey.client.authentication.HttpAuthenticationFeature;

import dk.knet.pop.booking.exceptions.BasicException;
import dk.knet.pop.booking.models.BookingUser;
import dk.knet.pop.booking.models.CaptchaResponse;
import dk.knet.pop.booking.security.JWTHandler;

import static dk.knet.pop.booking.configs.ErrorStrings.*;
import static dk.knet.pop.booking.controllers.impl.ConfigManager.CAPTCHA_ENABLED;

@Slf4j
public class AuthenticationController implements IAuthenticationController{

	private UserController userController = new UserController();
	private Client client = null;
	private final String captchaAuthUrl = ConfigManager.CAPTCHA_URL;
	private final String captchaSecret = ConfigManager.CAPTCHA_SECRET;
	public BookingUser authenticate(LoginUserViewModel userModel) throws BasicException{

		if(CAPTCHA_ENABLED && !validateCaptcha(userModel.getCaptchaToken())){
			log.error("Captcha error");
			throw new BasicException(Status.UNAUTHORIZED, ERROR_HELLO_ROBOT);
		}
		//make sure user is being updated

		BookingUser	user = null;

		user = userController.updateUser(userModel.getUsername());
		if(user == null){
			throw new BasicException(Status.UNAUTHORIZED, ERROR_INVALID_CREDENTIALS);
		}
		if(!user.getIsUserActive()){
			throw new BasicException(Status.UNAUTHORIZED, ERROR_ACCOUNT_DEACTIVATED);
		}

		log.info("Check: " + userModel.getPassword() + "=" + user.getPassword());
		if(checkPassword(userModel.getPassword(), user.getPassword())){
			JWTHandler handler =JWTHandler.getInstance();
			String token = handler.createJWT(user, 1000*36L);
			user.setToken(token);
			////System.out.println("user authenticated: " + token);
		}else{
			throw new BasicException(Status.UNAUTHORIZED, ERROR_INVALID_CREDENTIALS);
		}

		return user;
	}


	public static void main(String[] args) {
		AuthenticationController auth = new AuthenticationController();
		boolean match = auth.checkPassword("51RE92vu20RIN66", "sha1$664SFSdDOX0J$a8d99a37e86afd9fe099c8bc9296e74f66d3e23d");

	}

	protected boolean checkPassword(String password, String hashedPassword){
		String[] parts = hashedPassword.split("\\$");
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
			log.error("crypt update failed", e);
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


		try {
			CaptchaResponse response = target
//				.request(MediaType.APPLICATION_JSON)
					.request("application/x-www-form-urlencoded")
					.header("Content-length", "0")
					.post(null, CaptchaResponse.class);
			return response.isSuccess();
		}catch (Exception e){
			log.error("Captcha error, response failed", e);
		}
		return false;
	}

}
