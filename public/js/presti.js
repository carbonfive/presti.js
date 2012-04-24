jQuery(function($){
  var numberOfSlides = $('.slideshow').children().size();
  var slideNumber = 0;
  var show = io.connect();

  hljs.initHighlighting();

  $('.slideshow').cycle({
    'fx' : 'none'
  }).cycle('pause');

  show.on('sync', onSync);
  show.on('message', onMessage);

  $(document).keyup(onKeyReleased);
  $('#message').keyup(onMessageKeyReleased);

  function onSync(data) {
    slideNumber = data.slideNumber;
    $('.slideshow').cycle(data.slideNumber);
  }

  function onKeyReleased(event) {
    var code = event.which || event.keyCode;
    if(code == 37) {
      slideNumber = slideNumber <= 0 ? numberOfSlides - 1 : slideNumber - 1;
      show.emit('sync', { 'slideNumber' : slideNumber });
      return false;
    } else if (code == 39) {
      slideNumber = slideNumber >= numberOfSlides - 1 ? 0 : slideNumber + 1;
      show.emit('sync', { 'slideNumber' : slideNumber });
      return false;
    } else {
      $('#message').focus();
      return false;
    }
    return true;
  }

  function onMessage(data) {
    var message = gen('div','message row-fluid');
    message.add(
      gen('a','span2',{ href : '#' })
        .add(gen('img','profile',{ src : data.from.picture }))
    );
    message.add(
      gen('div','span10')
        .add(gen('div','identity')
              .add(gen('strong','name').text(data.from.name))
              .text(' says:'))
        .add(gen('div','body').text(data.message)));
    $('#messages').append(message.el);
  }

  function onMessageKeyReleased(event) {
    var code = event.which || event.keyCode;
    if(code == 13) {
      show.emit('message',
                { message : $('#message').val() });
      $(document).focus();
    }
  }

  function gen( name, clss, atts ) {
    var el = document.createElement(name), out={};
    if ( typeof clss == 'object' ) atts=clss, clss=null;
    for (var att in atts) el.setAttribute(att,atts[att]);
    if ( clss ) el.setAttribute('class', clss);
    out.add = function(node) { return el.appendChild( node.el ? node.el() : node ), out; };
    out.text = function(txt) { return el.appendChild( document.createTextNode(txt) ), out };
    out.el = function() { return el; };
    return out;
  }

});
