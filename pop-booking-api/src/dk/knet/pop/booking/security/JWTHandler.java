package dk.knet.pop.booking.security;

import java.io.IOException;
import java.util.Arrays;
import java.util.Base64;
import java.util.Date;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import dk.knet.pop.booking.models.Role;
import dk.knet.pop.booking.models.BookingUser;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.impl.crypto.MacProvider;

/** 
 * Handles JWT creation/Validation
 * @author Christian
 *
 */
public class JWTHandler {

	private static String defaultKeyBase64 = "5iAdBqSDrmqihDqY5o92c96CYzuyi6QMjlknh3ZxjMsdi7TK9SCu9Nq9Jt21cHz";

	private byte[] secretKey;
	private SignatureAlgorithm alg;

	public static String generateSecret(){
		byte[] keyBytes = MacProvider.generateKey().getEncoded();
		////System.out.println(keyBytes);
		return Base64.getEncoder().encodeToString(keyBytes);		
	}

	public JWTHandler(String base64SecretString, SignatureAlgorithm alg){
		setSecretKey(Base64.getDecoder().decode(base64SecretString));
		this.alg=alg;
	}

	public JWTHandler(){
		this(defaultKeyBase64, SignatureAlgorithm.HS512);
	}
	/**
	 * 
	 * @param user is added to token
	 * @param loginDuration in seconds
	 * @return
	 */
	public String createJWT(BookingUser user, Long loginDuration) {
		return Jwts.builder()
				.claim("user", user)
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis()+loginDuration*1000))
				.signWith(alg, getSecretKey())
				.compact();


	}

	public BookingUser validateJWT(String jwtString, Role... allowedRoles) throws PermissionExpiredException, PermissionDeniedException, MalformedTokenException{
		try {
			//Get claims object from JWT-token - throws exceptions if expired or permission denied
			Object map = Jwts
					.parser()
					.setSigningKey(secretKey)
					.parseClaimsJws(jwtString)
					.getBody()
					.get("user");
			//Parse map to ViewUser
			BookingUser user = parseMapToViewUser(map);
			if (user==null) throw new MalformedTokenException("Token Corrupt");
			//Iterate over roles to check if permission is ok
			//B.log(this, allowedRoles.length);
			if (allowedRoles!=null && allowedRoles.length>0 && allowedRoles[0]!=null) {
				boolean allowed = false; //No access per default
				for (Role role : allowedRoles) {
					 if (user.getAssignedRoles().contains(role)){
						 allowed = true;
					 }	
				}
				if (allowed == false){
//					B.log(this, "Permission Denied - Need role: " + Arrays.toString(allowedRoles));
					throw new PermissionDeniedException("Not allowed for this role");
				}
				
			};
			//B.log(this,"Permission granted");

			return user;
		} catch (SignatureException sigE){
//			B.log(this, "signatureExeption");
			throw new PermissionDeniedException("Bad signature");
		} catch (ExpiredJwtException expE){
//			B.log(this, "Token Expired");
			throw new PermissionExpiredException("Token Expired");
		} catch (MalformedJwtException malE){
			throw new MalformedTokenException("Token corrupt!");
		} catch (JsonProcessingException e) {
			throw new MalformedTokenException("Cannot parse User from token");
		}

	}

	private BookingUser parseMapToViewUser(Object map) throws JsonProcessingException, MalformedTokenException {
		ObjectMapper mapper = new ObjectMapper();
		//Convert map to JSON String
		String mapString = mapper.writeValueAsString(map);			
		BookingUser user = null;
		try {
			user = mapper.readValue(mapString, BookingUser.class);

		} catch (IOException e) {
			throw new MalformedTokenException("Cannot parse User from token");
		}
		return user;
	}


	public byte[] getSecretKey() {
		return secretKey;
	}

	public void setSecretKey(byte[] secretKey) {
		this.secretKey = secretKey;
	}

}