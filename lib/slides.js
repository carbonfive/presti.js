var fs = require('fs');
var md = require("node-markdown").Markdown;

module.exports.parse = function(filepath) {
  var slides = new Array();
  readSlides();
  fs.watchFile(filepath,readSlides);
  return slides;

  function readSlides() {
    slides.length = 0;
    var slideFile = fs.readFileSync(filepath,'utf-8');
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
  }

  function Slide(content) {
    this.originalMarkdown = content;
    this.html = md(this.originalMarkdown);
  }
};
