# POP booking API #
This is the API used as backend for the P. O. Pedersen booking system.
See live environment here: [book.pop.k-net.dk](https://book.pop.k-net.dk)



## Development ##

### Preconditions ###
- npm installed version 5.6.0 or later  
- java JDK 10 installed and %JAVA_HOME% set

### Setup ###
`git clone https://github.com/inur93/pop-booking.git`  
`cd pop-booking/pop-booking-web`  
`npm install`

- make sure that the src folder is marked as source root.
- create a tomcat configuration.
- in IntelliJ IDEA you do the following
    1. Run > Edit configurations...
    2. Add a tomcat server configuration via the add button in top left corner and add a tomcat local server.
    3. make sure that the JRE is configured
    4. In deployment tab add 'popbooking: war exploded'
    5. Press 'apply'

## Configuration ##
To be able to access the database, authenticate users and use captcha you have to create a configuration file on the server.
Make sure that the file is accessible by tomcat.
The following properties are required for the system to run:
    
    - hibernate.connection.url
    - hibernate.connection.username
    - hibernate.connection.password
    - knet.username
    - knet.password
    - knet.api_url
    
Optionally you can also provide the following properties:

    - hibernate.show_sql (default is 'false')
    - hibernate.current_session_context_class (default is 'managed')
    - hibernate.hbm2ddl.auto (default is 'update')
    - booking.user_cache_timeout (default is '24')
    - booking.debug_mode (default is 'false'. If 'true' users will not be authenticated towards the knet api and CAPTCHA is ignored. Thus only users that only exist in the database can log in.)
    - captcha.enabled (default is 'false'. If true the next two configurations are required as well.)
    - captcha.url (as of 29-11-2018 the url is 'https://www.google.com/recaptcha/api/siteverify')
    - captcha.secret
    
At last to configure log4j create log4j.properties in the resources folder.
The file could look like this:

```properties
#Log to file FILE
log4j.appender.file=org.apache.log4j.DailyRollingFileAppender
log4j.appender.file.File=${log4j.file_location}
log4j.appender.file.DatePattern='.'yyyy-MM-dd
log4j.appender.file.append=true
log4j.appender.file.layout=org.apache.log4j.PatternLayout
log4j.appender.file.layout.ConversionPattern=%d{yyyy-MM-dd HH:mm:ss} [%-4p] %c: %m%n

#Root Logger
log4j.rootLogger=WARN, stdout, file
```

Note the `log4j.appender.file.File` property which uses the environment specific value described in the Build section.

### Configure the react app ###
In the folder where the `package.json` is found. Create two configuration files:
    
    - development.env, will be used when running `npm start` 
    - production.env, will be used when running `npm run build`
 
 Each with the following configurations:
 ```properties
 API_HOST=<relative or absolute url to api>
 MEETINGROOM_START_TIME=8:00
 MEETINGROOM_END_TIME=22:00
 KANOO_START_TIME=8:00
 KANOO_END_TIME=22:00
 CAPTCHA_SITE_KEY=<the captcha api key found in google console>
 ```

## Build ##
To build the project including the web application is very time consuming due to the production optimizations process for the React app.
Therefore we have to different build processes for the dev environment and production.
The `pom.xml` includes 4 profiles which can be used for the build process:

    1. Production
       Uses production specific configurations.
    2. Development
        Uses development specific configurations.
    3. Build react app
        Makes a production build of the React app.
        This might take a couple of minutes to complete.
    4. Copy react app
        Copies the React app into the target folder so that
        when the war file is generated the React app will be included.
            
        
### Development environment ###

    1. Create a property file in the resources folder and name it `dev.properties`
    2. Add the following two properties to the file:
        configservice.file_location=C:/my/config/file/location.properties  
        log4j.file_location=C:/my/log/file/location.log  
    3. Make sure that you have completed the configurations step above and the `configservice.file_location` path matches the location of that file.
    4. Run `mvn clean package -P "Development,Copy react app"` alternatively include the 'Build react app' profile if the React app should be recompiled.
    5. Now the target folder should contain a war file that you can deploy to your tomcat server.
### Production environment ###
   
This guide is similar to the one for the development environment, with some smaller changes.
 
    1. Create a property file the resources folder and name it 'prod.properties'
    2. Add the following two properties to the file:
       configservice.file_location=C:/my/config/file/location.properties  
       log4j.file_location=C:/my/log/file/location.log
    3. Make sure that you have completed the configurations step above and the `configservice.file_location` path matches the location of that file.
    4. Run `mvn clean package -P "Production,Copy react app"` alternatively include the 'Build react app' profile if the React app should be recompiled.
    5. Now the target folder should contain a war file that you can deploy to the production tomcat server.

## Known issues ##

### NPM ERR ###
Check that you have run `npm install` before you are running the build.

### 'node-sass' is not recognized as an interl or external command ###
install node-sass globally by running `npm install -g node-sass`
## Server setup ##

## Deploy ##
