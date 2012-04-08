(function() {

  this.PageSlider = (function() {

    function PageSlider(params) {
      var _this = this;
      if (params == null) params = {};
      this.element = document.getElementById(params['id']);
      this.article = document.getElementById(params['articleId']);
      this.nextUrl = this.getUrlForId(params['next']);
      this.prevUrl = this.getUrlForId(params['previous']);
      if (Modernizr.touch && (this.article != null) && (this.element != null) && (this.nextUrl != null) && (this.prevUrl != null)) {
        this.element.addEventListener("touchstart", (function(event) {
          return _this.touchStart(event);
        }), false);
        this.element.addEventListener("touchmove", (function(event) {
          return _this.touchMove(event);
        }), false);
        this.element.addEventListener("touchend", (function(event) {
          return _this.touchEnd(event);
        }), false);
        this.element.addEventListener("touchcancel", (function(event) {
          return _this.touchCancel(event);
        }), false);
        this.slideTo = 0;
        this.translate();
      }
    }

    PageSlider.prototype.touchStart = function(event) {
      this.disableTransition();
      if (event.touches.length === 1) {
        this.slideStartX = event.touches[0].pageX;
        return this.slideStartY = event.touches[0].pageY;
      }
    };

    PageSlider.prototype.touchMove = function(event) {
      var xOffset, yOffset;
      if (event.touches.length === 1) {
        xOffset = Math.abs(event.touches[0].pageX - this.slideStartX);
        yOffset = Math.abs(event.touches[0].pageY - this.slideStartY);
        if (xOffset > 50) event.preventDefault();
        if (xOffset > yOffset) {
          this.slideTo = event.touches[0].pageX - this.slideStartX;
        }
      } else {
        this.slideTo = 0;
      }
      return this.translate();
    };

    PageSlider.prototype.touchEnd = function(event) {
      var limit, urlToLoad;
      this.enableTransition();
      limit = window.innerWidth / 3;
      urlToLoad = false;
      if (this.slideTo > 0 && Math.abs(this.slideTo) >= limit && this.nextUrl !== false) {
        this.slideTo = window.innerWidth;
        urlToLoad = this.nextUrl;
      } else if (this.slideTo < 0 && Math.abs(this.slideTo) >= limit && this.prevUrl !== false) {
        this.slideTo = -window.innerWidth;
        urlToLoad = this.prevUrl;
      } else {
        this.slideTo = 0;
      }
      this.translate();
      if (urlToLoad) {
        return setTimeout(function() {
          return window.location = urlToLoad;
        }, 75);
      }
    };

    PageSlider.prototype.touchCancel = function(event) {
      this.enableTransition();
      this.slideTo = 0;
      return this.translate();
    };

    PageSlider.prototype.enableTransition = function() {
      return this.article.style[Modernizr.prefixed('transition')] = "all 0.2s ease-out";
    };

    PageSlider.prototype.disableTransition = function() {
      return this.article.style[Modernizr.prefixed('transition')] = "";
    };

    PageSlider.prototype.translate = function() {
      if (Modernizr.csstransforms3d) {
        return this.article.style[Modernizr.prefixed('transform')] = "translate3d(" + this.slideTo + "px, 0, 0)";
      } else if (Modernizr.csstransforms) {
        return this.article.style[Modernizr.prefixed('transform')] = "translate(" + this.slideTo + "px, 0)";
      }
    };

    PageSlider.prototype.getUrlForId = function(id) {
      var listItem;
      listItem = document.getElementById(id);
      if (listItem != null) {
        return listItem.getElementsByTagName("a")[0].href;
      } else {
        return false;
      }
    };

    return PageSlider;

  })();

}).call(this);
