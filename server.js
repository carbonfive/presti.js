var express = require('express');
var app = express.createServer();
var io = require('socket.io').listen(app);
var auth = require('connect-auth');
var show = require('./lib/show').init(io);
var slides = require('./lib/slides').parse('slides.md');
var config = require('./config');

app.configure(function() {
  app.use(express.errorHandler({ showStack: true, dumpExceptions: true }));
  app.use(express.cookieParser());
  app.use(express.session({ secret: config.sessionSecret }));
  app.use(auth([ auth.Google2(
    { appId: config.googleAppId,
      appSecret: config.googleAppSecret,
      callback: config.googleCallback,
      requestEmailPermission: true }) ]));
  app.set('view engine','jade');
  app.set('view options', { layout: false });
  app.use(express.bodyParser());
  app.use(express.compiler({ src:__dirname + '/public', enable:['less'] }));
  app.use(express.static(__dirname + '/public'));
});

app.get('/', function(request, response, next) {
  response.render('home', { slides : slides });
});

app.get('/chat', authenticate, function(request, response, next) {
  response.render('chat', { slides : slides });
});

app.get('/logout', function(request, response, next) {
  if(request.isAuthenticated()) {
    request.logout();
  }
  response.redirect('/');
});

app.get('/present', authenticate, isPresenter, function(request, response, next) {
  response.render('present', { slides : slides });
});

app.listen(8500);

function authenticate(request, response, next) {
  if(request.isAuthenticated()) next();
  else {
    request.authenticate(function(error, authenticated) {
      if(error) next(new Error('Problem authenticating'));
      else if(authenticated === true) {
        console.log(requested.getAuthDetails());
        next();
      }
      else if(authenticated === false) {
        next(new Error('Access Denied!'));
      } else {}
    });
  }
}

function isPresenter(request, response, next) {
  if(request.isAuthenticated()) {
    var userAuthDetails = request.getAuthDetails();
    console.log(userAuthDetails);
    if(userAuthDetails.user.email == 'rudy@carbonfive.com' ||
       userAuthDetails.user.email == 'alex@carbonfive.com') {
      return next();
    }
  }
  response.redirect('/');
}
