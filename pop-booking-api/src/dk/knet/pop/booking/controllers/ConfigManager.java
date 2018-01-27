package dk.knet.pop.booking.controllers;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class ConfigManager {

	//keys
	public static final String USERNAME = "username";
	public static final String PASSWORD = "password";
	public static final String K_NET_API_URL = "k_net_api_url";
	public static final String USER_CACHE_TIMEOUT = "user_cache_timeout";
	public static final String CAPTCHA_URL = "captcha_url";
	public static final String CAPTCHA_SECRET = "captcha_secret";
	
	
	private static final String FILENAME = "popbooking.properties";
	
	public static String read(String key){
		String value = null;
		Properties props = new Properties();
		InputStream is = null;
		
		try{
			is = new FileInputStream(FILENAME);
			props.load(is);
			value = props.getProperty(key);
		}catch(Exception e){
			e.printStackTrace();
		}finally{
			if(is != null)
				try {
					is.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
		}
		
		return value;
	}
	
}
