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
    var classes = '';
    slideFile.split('\n').forEach(function(line) {
      if(line.indexOf('!SLIDE') == 0) {
        slides.push(new Slide(content,classes));
        classes = line.substr(6).trim();
        content = '';
      } else {
        content = content + '\n' + line;
      }
    });
    slides.push(new Slide(content,classes));
  }

  function Slide(content,classes) {
    this.classes = classes;
    this.originalMarkdown = content;
    this.html = md(this.originalMarkdown);
  }
};
