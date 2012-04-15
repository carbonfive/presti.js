jQuery(function($){
  $('.slideshow').cycle({
    'fx' : 'none'
  }).cycle('pause');
  $(document).keyup(function(event) {
    if(event.keyCode == 37) {
      $('.slideshow').cycle('prev');
    } else if (event.keyCode == 39) {
      $('.slideshow').cycle('next');
    }
  });
});
