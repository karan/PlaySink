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
	|-- tests         /* Should hold all unit tests        */
	|-- views         /* The templates for the 'views'     */
	|   |-- errors
	|   |-- includes
	|   |-- layouts
	|   |-- users

## TODO

Maintain a macro TODO list on top of each file.

- [x] Make a simple dashboard that usee sees after login
- [ ] User sign-up input validation
- [ ] Simple user/pwd authentication using passport
- [ ] Facebook authentication using passport-facebook
- [ ] Make the login/signup link into a modal window (jquery)
- [ ] Logging capabilities, maybe just save in a txt file, lookup node logging modules
- [ ] Setup admin capabilities
- [ ] Make a simple admin area for all stats using logging

### What doesn't quite work

![Image](../master/docs-internal/img/dashboard.png?raw=true)

#### The server

After downloading mongodb you need to connect to the database and start it. This can be done by using the commmand in terminal `mongod --dbpath ~/path/to/PlaySink/data` and it should start listening. In another tab you can start a `mongo` shell. Just to see if the data is there you can do the following commands.

    use playsinkdb  // database to use

    db.usercollection.find().pretty()

    db.usercollection.insert({"username": name, "password": pass, "email": email}) // it uses JSON which is awesome make sure you enter it in all the same way


### Links that have helped

Sites:
express/mongo/jade
http://cwbuecheler.com/web/tutorials/2013/node-express-mongo/

mean:
http://mean.io/

Seems legit
http://howtonode.org/express-mongodb
