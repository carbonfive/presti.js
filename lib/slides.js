var fs = require('fs');
var md = require('discount');

module.exports.parse = function(filepath) {
  var slideFile = fs.readFileSync('slides.md','utf-8');
  var slides = new Array();
  var content = '';

  slideFile.split('\n').forEach(function(line) {
    if(line.indexOf('!SLIDE') == 0) {
      slides.push(new Slide(content));
      content = '';
    } else {
      content = content + '\n' + line;
    }
  });
  slides.push(new Slide(content));
  return slides;

  function Slide(content) {
    this.originalMarkdown = content;
    this.html = md.parse(this.originalMarkdown);
  }
};
