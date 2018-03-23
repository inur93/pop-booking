package dk.knet.pop.booking.controllers.impl;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class ConfigManager {

	//configs
	public static final String USERNAME;
	public static final String PASSWORD;
	public static final String K_NET_API_URL;
	public static final String USER_CACHE_TIMEOUT;
	public static final String CAPTCHA_URL;
	public static final String CAPTCHA_SECRET;
	public static final boolean DEBUG;
	public static final String CONTEXT_USER_KEY;
	public static final boolean CAPTCHA_ENABLED;
	private static final String FILENAME = "/popbooking.properties";

	static {
		Properties props = new Properties();
		InputStream is = null;
		String username=null, password=null,
				kNetApiUrl=null, userCacheTimeout=null,
				captchaUrl=null, captchaSecret=null,
				debug=null, contextUserKey=null,
				enableCaptcha=null;
		try{
			is = ConfigManager.class.getResourceAsStream(FILENAME);
			props.load(is);
			username = props.getProperty("knet.username");
			password = props.getProperty("knet.password");
			kNetApiUrl = props.getProperty("k_net_api_url");
			userCacheTimeout = props.getProperty("user_cache_timeout");
			captchaUrl = props.getProperty("captcha_url");
			captchaSecret = props.getProperty("captcha_secret");
			debug = props.getProperty("debug");
			enableCaptcha = props.getProperty("captcha.enable");
			contextUserKey = props.getProperty("context_user_key");
		}catch(Exception e){
			e.printStackTrace();
		}finally{
			USERNAME = username;
			PASSWORD = password;
			K_NET_API_URL = kNetApiUrl;
			USER_CACHE_TIMEOUT = userCacheTimeout;
			CAPTCHA_URL = captchaUrl;
			CAPTCHA_SECRET = captchaSecret;
			DEBUG = "true".equalsIgnoreCase(debug);
			CAPTCHA_ENABLED = "true".equalsIgnoreCase(enableCaptcha);
			CONTEXT_USER_KEY = contextUserKey;
			if(is != null)
				try {
					is.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
		}
	}
	

	
}
