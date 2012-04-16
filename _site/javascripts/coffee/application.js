(function() {

  domready(function() {
    var articleController;
    setTimeout(function() {
      var nav;
      if (Modernizr.svg) {
        nav = document.querySelector("#posts_nav");
        if (nav != null) return nav.className = "active";
      }
    }, 500);
    if (!document.querySelector(".archives")) {
      document.body.className = "contained";
      return articleController = new ArticleController();
    }
  });

}).call(this);
