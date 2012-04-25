var express = require('express');
var app = express.createServer();
var io = require('socket.io').listen(app);
var auth = require('connect-auth');
var MemoryStore = express.session.MemoryStore;
var sessionStore = new MemoryStore();
var show = require('./lib/show').init(io,sessionStore);
var slides = require('./lib/slides').parse('slides.md');
var config = require('./config');
var cluster = require('cluster');
var os = require('os');

app.configure(function() {
  app.use(express.errorHandler({ showStack: true, dumpExceptions: true }));
  app.use(express.cookieParser());
  app.use(express.session(
    { store: sessionStore,
      secret: config.sessionSecret,
      key: 'express.sid' }));
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
  request.session.presenter = false;
  request.logout();
  response.redirect('/');
});

app.listen(config.port || 80);

function authenticate(request, response, next) {
  if(request.isAuthenticated()) {
    if(request.getAuthDetails().user.email == 'rudy@carbonfive.com' ||
       request.getAuthDetails().user.email == 'alex@carbonfive.com') {
      request.session['presenter'] = true;
      request.session.save();
    }
    next();
  }
  else {
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
