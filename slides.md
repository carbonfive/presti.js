# Introductions

* _Alex Cruikshank_ - Senior Architect

  [@sivoh](http://twitter.com/sivoh)

* _Rudy Jahchan_ - Team Lead Supreme

  [@rudy](http://twitter.com/rudy)

* _[Carbon Five](http://carbonfive.com)_ -
  [@carbonfive](http://twitter.com/carbonfive)

!SLIDE
# \#presti.js
* http://prestijs.org/chat
* https://github.com/carbonfive/presti.js

!SLIDE section
# What is Node.js?

* [http://nodejs.org](http://nodejs.org)

!SLIDE
# What is Node.js?
*  Javascript server based on V8

!SLIDE
# What is Node.js?
*  Simple, extensible architecture

!SLIDE
# What is Node.js?
*  Non-blocking from the ground up
   built to scale

!SLIDE
# What is Node.js?
*  Vibrant developer community

!SLIDE section
# When should you consider Node?

!SLIDE
# When should you consider Node?
*  Quick Applications
*  Prototypes
*  Command Line Applications

!SLIDE
# When should you consider Node?
*  Real-time Applications

!SLIDE
# When should you consider Node?
*  IO Heavy Applications

!SLIDE
# When should you consider Node?
*  Everything else

!SLIDE section
# Our Node.js Work

!SLIDE
# Our Node.js Work
*  Mock Thermostat

!SLIDE
# Our Node.js Work
*  iTVS - OVEE

!SLIDE
# Our Node.js Work
*  Reflectrospective

!SLIDE
# Our Node.js Work
*  nodebro.js

!SLIDE
# Our Node.js Work
*  presti.js

!SLIDE section
# Web Frameworks

!SLIDE
# Web Frameworks
*  Lots to choose from

!SLIDE
# Web Frameworks
*  Express.js
*  Connect
*  Flatiron.js
*  Geddy.js
*  Tower.js

!SLIDE
# configuration

    var express = require('express');
    var app = express.createServer();

    app.configure(function() {
      app.use(express.errorHandler({ showStack: true, dumpExceptions: true }));
      app.set('view engine','jade');
      app.set('view options', { layout: false });
      app.use(express.bodyParser());
      app.use(express.compiler({ src:__dirname + '/public', enable:['less'] }));
      app.use(express.static(__dirname + '/public'));
    });

!SLIDE
# routes

    app.get('/', function(request, response, next) {
      response.render('home', { slides : slides });
    });

    app.get('/chat', authenticate, function(request, response, next) {
      response.render('chat', { slides : slides });
    });

    app.listen(config.port || 80);

!SLIDE
# authetication
    function authenticate(request, response, next) {
      if(!request.isAuthenticated()) {
        request.authenticate(function(error, authenticated) {
          if(error) next(new Error('Problem authenticating'));
          else if(authenticated === true) {
            return response.redirect(request.originalUrl);
          }
          else if(authenticated === false) {
            return next(new Error('Access Denied!'));
          } else {}
        });
      }
    }

!SLIDE section
# WebSockets

!SLIDE
# WebSockets
* Real-time Applications

!SLIDE
# WebSockets
*  What are WebSockets?

!SLIDE
# WebSockets
*  Socket.io

!SLIDE
# Server

    require io = require('socket.io').listen(app);

    io.on('connection', onConnect);
    function onConnect(socket) {
      socket.on('message', sendMessage);
      socket.on('disconnect', onDisconnect);
      socket.emit('message', 'Hello World!');

      function sendMessage(messageBody) {
        socket.broadcast.emit('message', messageBody);
      }

      function onDisconnect() {
        socket.broadcast.emit('message', 'Someone left!');
      }
    }

!SLIDE
# Client

    var show = io.connect();

    show.on('message', onMessage);
    function onMessage(messageBody) {
      $('#messages').append(messageBody);
    }
 
!SLIDE
# Other Features
* Handshake
* Namespaces
* Rooms

!SLIDE
# Datastorage
*  MySQL
*  Postgres
*  SQLite
*  Oracle

!SLIDE
# Datastorage
*  JSON Document store is a better fit

!SLIDE
# Datastorage
*  MongoDB
*  CouchDB
*  Reddis

!SLIDE section
# Testing

!SLIDE
# Testing
*  BDD style with jasmine-node / mocha.js

!SLIDE
# Testing
*  Vows, Expresso, Minitest and many others

!SLIDE section
# Deployment

!SLIDE
# Deployment
*  Joyent

!SLIDE
# Deployment
*  Azure

!SLIDE
# Deployment
*  EC2

!SLIDE
# Deployment
*  Heroku
*  Engine Yard

!SLIDE section
# Limitations of Node.js

!SLIDE
# Limitations of Node.js
*  Package Overload

!SLIDE
# Limitations of Node.js
*  Asynchronous Programming
