package dk.knet.pop.booking.configs;

import static dk.vormadal.configservice.Configuration.get;
import static dk.vormadal.configservice.Configuration.getBool;
import static dk.vormadal.configservice.Configuration.getInt;

/**
 * Created: 27-05-2018
 * author: Runi
 */

public class Configs {
    public static final String USERNAME = get("knet.username");
    public static final String PASSWORD = get("knet.password");
    public static final String K_NET_API_URL = get("knet.api_url");
    public static final int USER_CACHE_TIMEOUT = getInt("booking.user_cache_timeout", 24);
    public static final String CAPTCHA_URL = get("captcha.url");
    public static final String CAPTCHA_SECRET = get("captcha.secret");
    public static final boolean DEBUG = getBool("booking.debug_mode", false);
    public static final String CONTEXT_USER_KEY = "user";//this is overkill -> get("booking.user_context_key");
    public static final boolean CAPTCHA_ENABLED = getBool("captcha.enabled", false);
}
