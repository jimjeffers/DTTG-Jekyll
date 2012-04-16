(function() {

  this.PageSlider = (function() {

    PageSlider.DIRECTION_CHANGE = "PageSlideDirectionChangeEvent";

    PageSlider.DIRECTION_FINISHED = "PageSlideDirectionChangeFinished";

    PageSlider.DIRECTION_UNKNOWN = 0;

    PageSlider.DIRECTION_LEFT = 1;

    PageSlider.DIRECTION_RIGHT = 2;

    function PageSlider(params) {
      var _this = this;
      if (params == null) params = {};
      this.touchTarget = params['touchTarget'] || document.body;
      this.setArticle(params['article']);
      if (Modernizr.touch && (this.article != null) && (this.touchTarget != null)) {
        this.touchTarget.addEventListener("touchstart", (function(event) {
          return _this.touchStart(event);
        }), false);
        this.touchTarget.addEventListener("touchmove", (function(event) {
          return _this.touchMove(event);
        }), false);
        this.touchTarget.addEventListener("touchend", (function(event) {
          return _this.touchEnd(event);
        }), false);
        this.touchTarget.addEventListener("touchcancel", (function(event) {
          return _this.touchCancel(event);
        }), false);
      }
    }

    PageSlider.prototype.setArticle = function(article) {
      this.article = article;
      this.slideTo = 0;
      return this.article.translate(this.slideTo);
    };

    PageSlider.prototype.touchStart = function(event) {
      this.article.disableTransition();
      if (event.touches.length === 1) {
        this.direction = PageSlider.DIRECTION_UNKNOWN;
        this.slideStartX = event.touches[0].pageX;
        return this.slideStartY = event.touches[0].pageY;
      }
    };

    PageSlider.prototype.touchMove = function(event) {
      var xOffset, yOffset;
      if (event.touches.length === 1) {
        xOffset = Math.abs(event.touches[0].pageX - this.slideStartX);
        yOffset = Math.abs(event.touches[0].pageY - this.slideStartY);
        if (xOffset > 10) event.preventDefault();
        if (xOffset > yOffset) {
          this.slideTo = event.touches[0].pageX - this.slideStartX;
          if (this.slideTo > 0 && this.direction !== PageSlider.DIRECTION_RIGHT) {
            this.direction = PageSlider.DIRECTION_RIGHT;
            radio(PageSlider.DIRECTION_CHANGE).broadcast(this.direction);
          } else if (this.slideTo < 0 && this.direction !== PageSlider.DIRECTION_LEFT) {
            this.direction = PageSlider.DIRECTION_LEFT;
            radio(PageSlider.DIRECTION_CHANGE).broadcast(this.direction);
          }
        }
      } else {
        this.slideTo = 0;
      }
      return this.article.translate(this.slideTo);
    };

    PageSlider.prototype.touchEnd = function(event) {
      var limit;
      limit = window.innerWidth / 3;
      if (this.slideTo > 0 && Math.abs(this.slideTo) >= limit) {
        return this.moveTo(window.innerWidth);
      } else if (this.slideTo < 0 && Math.abs(this.slideTo) >= limit) {
        return this.moveTo(-window.innerWidth);
      } else {
        return this.moveTo(0);
      }
    };

    PageSlider.prototype.touchCancel = function(event) {
      return this.moveTo(0);
    };

    PageSlider.prototype.moveTo = function(slideTo) {
      var transEndEventNames,
        _this = this;
      this.slideTo = slideTo;
      this.article.enableTransition();
      transEndEventNames = {
        'WebkitTransition': 'webkitTransitionEnd',
        'MozTransition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'msTransition': 'MSTransitionEnd',
        'transition': 'transitionend'
      };
      this.article.element.addEventListener(transEndEventNames[Modernizr.prefixed('transition')], function() {
        return radio(PageSlider.DIRECTION_FINISHED).broadcast(_this.slideTo !== 0);
      });
      return this.article.translate(this.slideTo);
    };

    PageSlider.prototype.moveForwardAnimated = function(animated) {
      if (animated == null) animated = true;
      this.direction = PageSlider.DIRECTION_LEFT;
      radio(PageSlider.DIRECTION_CHANGE).broadcast(this.direction);
      if (animated) {
        return this.moveTo(window.innerWidth);
      } else {
        return radio(PageSlider.DIRECTION_FINISHED).broadcast(true);
      }
    };

    PageSlider.prototype.moveBackwardAnimated = function(animated) {
      if (animated == null) animated = true;
      this.direction = PageSlider.DIRECTION_RIGHT;
      radio(PageSlider.DIRECTION_CHANGE).broadcast(this.direction);
      if (animated) {
        return this.moveTo(-window.innerWidth);
      } else {
        return radio(PageSlider.DIRECTION_FINISHED).broadcast(true);
      }
    };

    return PageSlider;

  })();

}).call(this);
