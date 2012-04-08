setTimeout(function(){
  if(Modernizr.svg) {
    var nav = document.getElementById("posts_nav")
    if(nav != null) {
      nav.className = "active"
    }
  }
}, 500);

if(Modernizr.touch) {
  pageSlider = new PageSlider({id: "content", next: "next", previous: "previous"})
}