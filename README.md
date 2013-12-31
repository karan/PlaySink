PlaySink
====

Required downloads are NodeJS and MongoDB. Do an `sudo npm install` downloads the dependencies (**angular, express, jade, mongodb, mongoose**). 

- Angular is used for data injections in the page. Has not been implemented yet since we haven't gotten to a place that acutal requires this. It makes the MVC design much better from my understanding. 
- Express is the framework that handles routes and making the server. So far this has made the code more readable. 
- Jade gets compiled into html it will help the future so we can reuse pages and what not and apparently jade and angular work well with each other. 
- Mongodb is the database we are using that uses JSON as the data being stored. I'm not entirely sure that this is what we should be using but we can do a lot with it and it is supposed to be fairly easy. 
- Mongoose makes it "easy" to work with MongoDB.

    - Install node
    - Install express (`npm install -g express`)
    - Create express project (`express --sessions nodetest1`)
    - Edit dependencies
    - `npm install`
    - Install mongodb system-wide
    - Navigate to `data/` and run `mongod --dbpath /path/to/data_folder` to start the db server
    - Then `node app.js` start the app.

- Passport for user authentication.

### Code structure

	|-- app.js        /* The application code itself       */
	|-- config        /* Application settings              */
	|   |-- middlewares
	|-- data          /* MongoDB database files            */
	|-- models        /* Models (classes) for everything   */
	|-- public        /* Publicly accessible resources     */
	|   |-- images
	|   |-- javascripts
	|   |-- stylesheets 
	|-- routes        /* The URL routes                    */
	|-- tests         /* Should hold all unit tests        */
	|-- views         /* The templates for the 'views'     */
	|   |-- errors
	|   |-- includes
	|   |-- layouts
	|   |-- users

## TODO

Maintain a macro TODO list on top of each file. Some major tasks to get us started:

### Authentication

- [x] Make a simple dashboard that usee sees after login
- [x] User sign-up input validation
- [x] Simple user/pwd authentication using passport
- [x] Redirect authenticated users to dashboard
- [x] Facebook authentication using passport-facebook
- [ ] Twitter auth
- [ ] Google auth
- [ ] Setup forgot password reset capability
- [ ] Remember me implementation
- [x] Make sure all signup/sign in flash messages are shown
- [ ] Single data type for all users regardless of login method

### Dashboard

![Image](../master/docs-internal/img/dashboard.png?raw=true)

- [ ] Make a simple prototype in jade (and css) for what we want (see image below)

### User Account

- [ ] Allow fields for favorite genre/artists
- [ ] Allow user to modify profile


### Admin

- [ ] Logging capabilities, maybe just save in a txt file, lookup node logging modules
- [ ] Setup admin user level
- [ ] Make a simple admin area for some stats using logging
- [ ] Add admin capability to manage user accounts

### Frontend

- [x] Give some color to flash messages
- [x] Make the login/signup link into a modal window (jquery)
- [ ] User sign-up input validation

## Current workflow

- Show homepage with a header
- Users can signup or signin
- If they try to access dashboard without signing in, they are redirected to signin page
- Upon registering, user is taken to the dashboard
- An authenticated user accessing homepage, signup or signin page is redirected to dashboard.

### Facebook Login

To login using facebook you must go to the url http://localhost:8888/auth/facebook and it will ask you on your facebook profile to use just your email address. Once you hit accept it will redirect you to your dashboard.

### The server

After downloading mongodb you need to connect to the database and start it. This can be done by using the commmand in terminal `mongod --dbpath ~/path/to/PlaySink/data` and it should start listening. In another tab you can start a `mongo` shell. Just to see if the data is there you can do the following commands.

    use playsinkdb  // database to use

    db.usercollection.find().pretty()

    db.usercollection.insert({"username": name, "password": pass, "email": email}) // it uses JSON which is awesome make sure you enter it in all the same way


### Links that have helped

- http://cwbuecheler.com/web/tutorials/2013/node-express-mongo/
- http://mean.io/
- https://github.com/linnovate/mean
- https://github.com/madhums/node-express-mongoose-demo
- http://howtonode.org/express-mongodb