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
	|-- data          /* MongoDB database files            */
	|-- models        /* Models (classes) for everything   */
	|-- public        /* Publicly accessible resources     */
	|   |-- images
	|   |-- javascripts
	|   |-- stylesheets 
	|-- routes        /* The URL routes                    */
	|-- views         /* The templates for the 'views'     */

## TODO

- [ ] Make a simple dashboard that usee sees after login
- [ ] Simple user/pwd authentication using passport
- [ ] Facebook authentication using passport-facebook
- [ ] Make the login/signup link into a modal window (jquery)

### What has been done

I have added a basic directory layout that needs to be fixed in the future when we decide what we need. I did the basic setup with express so it starts the server properly listening on port 8888. After starting the server `node app.js` it can be accessed from `http://localhost:8888/`. Added just a basic page so we can get the login to work becuase that seems like a resonable goal.

### What doesn't quite work

![Image](../master/docs-internal/img/dashboard.png?raw=true)

#### The server

After downloading mongodb you need to connect to the database and start it (I think). This can be done by using the commmand in terminal `mongod --dbpath ~/path/to/PlaySink/data` and it should start listening. In another tab you can start a mongo shell. There are tutorials online that I have only glazed over (probabaly why I can't get it to work haven't done one all the way through just thought I could pick things off). Just to see if the data is there you can do the following commands.

    use playsinkdb  // database to use

    db.usercollection.find().pretty()

    db.usercollection.insert({"username": name, "password": pass, "email": email}) // it uses JSON which is awesome make sure you enter it in all the same way


### What need to be done

I think a resonable short term goal is to try to get a logging in system. Using the database to store the email and what not. We should consider logging in with facebook/twitter because we need to make the log in as easy as absolutely possible since that is the one thing that will detract users.

### Links that have helped

Sites:
express/mongo/jade
http://cwbuecheler.com/web/tutorials/2013/node-express-mongo/

mean:
http://mean.io/

Seems legit
http://howtonode.org/express-mongodb
