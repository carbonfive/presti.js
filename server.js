var express = require('express');
var app = express.createServer();
var io = require('socket.io').listen(app);
var show = require('./lib/show').init(io);
var fs = require('fs');
var _ = require('underscore');
var md = require('discount');

var slideFile = fs.readFileSync('slides.md','utf-8');
var slides = new Array();
var currentSlide = {
  content : ''
};

_.each(slideFile.split('\n'), function(line) {
  if(line.indexOf('!SLIDE') == 0) {
    currentSlide.content = md.parse(currentSlide.content);
    slides.push(currentSlide);
    currentSlide = { content : '' };
  } else {
    currentSlide.content = currentSlide.content + '\n' + line;
  }
});
currentSlide.content = md.parse(currentSlide.content);
slides.push(currentSlide);
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

app.listen(8500);
