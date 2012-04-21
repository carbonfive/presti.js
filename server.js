var express = require('express');
var app = express.createServer();
var io = require('socket.io').listen(app);
var show = require('./lib/show').init(io);
var slides = require('./lib/slides').parse('slides.md');

console.log(slides);

app.configure(function() {
  app.use(express.errorHandler({ showStack: true, dumpExceptions: true }));
  app.set('view engine','jade');
  app.set('view options', { layout: false });
  app.use(express.bodyParser());
  app.use(express.compiler({ src:__dirname + '/public', enable:['less'] }));
  app.use(express.static(__dirname + '/public'));
});

app.get('/', function(request, response, next) {
  response.render('home', { slides : slides });
});

app.get('/chat', function(request, response, next) {
  response.render('chat', { slides : slides });
});

app.listen(8500);
