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
      articleController = new ArticleController();
      return articleController.setAnalyticsCallback(function(event) {
        if (event == null) event = {};
        _gat._getTrackerByName()._trackPageview(event['pathname']);
        return _gat._getTrackerByName()._trackEvent(event['category'], event['action']);
      });
    }
  });

}).call(this);
