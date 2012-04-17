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

(function() {

  this.Article = (function() {

    Article.TRANSITION = "all 0.2s ease-out";

    Article.CACHE = {};

    Article.fetchFromURL = function(href) {
      var request;
      if (!(href != null) || href === window.location) return null;
      if (Article.CACHE[href] != null) {
        return Article.CACHE[href];
      } else {
        request = new XMLHttpRequest();
        request.open("GET", href, false);
        request.send();
        if (request.status === 200) {
          return Article.CACHE[href] = new Article({
            html: request.response,
            href: href
          });
        }
      }
    };

    function Article(params) {
      var tableOfContents, tempElement;
      if (params == null) params = {};
      this.href = params["href"];
      tempElement = document.createElement("div");
      tempElement.innerHTML = params['html'];
      if (params['element'] != null) {
        this.element = params['element'];
      } else {
        this.element = tempElement.querySelector("article");
      }
      tableOfContents = this.element.querySelector("#table_of_contents");
      if (tableOfContents != null) tableOfContents.className = "active";
      if (tempElement.querySelector("#next a") != null) {
        this.nextURL = tempElement.querySelector("#next a").href;
      }
      if (tempElement.querySelector("#previous a") != null) {
        this.prevURL = tempElement.querySelector("#previous a").href;
      }
      if (tempElement.querySelector("h1 a") != null) {
        this.title = tempElement.querySelector("h1 a").innerHTML;
      }
      this.tableOfContents = tempElement.querySelector(".archives") != null;
      tempElement = null;
      this.staged = false;
      this.current = false;
    }

    Article.prototype.isCurrent = function() {
      return this.current;
    };

    Article.prototype.isStaged = function() {
      return this.staged;
    };

    Article.prototype.append = function() {
      var body;
      this.translate(0);
      body = document.querySelector("body");
      body.appendChild(this.element);
      return this;
    };

    Article.prototype.remove = function() {
      if ((document.removeChild != null) && (this.element.parentNode != null)) {
        this.element.parentNode.removeChild(this.element);
      }
      return this;
    };

    Article.prototype.hide = function() {
      this.element.className = "hidden";
      return this;
    };

    Article.prototype.stage = function() {
      this.disableTransition();
      this.element.className = "post onStage";
      this.staged = true;
      this.current = false;
      return this;
    };

    Article.prototype.unstage = function() {
      this.disableTransition();
      this.element.className = "post offStage";
      this.staged = false;
      this.current = false;
      return this;
    };

    Article.prototype.makeCurrent = function() {
      if (this.tableOfContents) {
        return window.location = "/";
      } else {
        this.disableTransition();
        this.element.className = "post";
        this.staged = false;
        this.current = true;
        document.querySelector("title").innerHTML = "" + this.title + " | DontTrustThisGuy.com";
        if (window.location.href !== this.href) {
          history.pushState(null, "", this.href);
        }
        return this;
      }
    };

    Article.prototype.enableTransition = function() {
      this.element.style[Modernizr.prefixed('transition')] = Article.TRANSITION;
      return this;
    };

    Article.prototype.disableTransition = function() {
      this.element.style[Modernizr.prefixed('transition')] = "";
      return this;
    };

    Article.prototype.translate = function(xPos) {
      if (Modernizr.csstransforms3d) {
        this.element.style[Modernizr.prefixed('transform')] = "translate3d(" + xPos + "px, 0, 0)";
      } else if (Modernizr.csstransforms) {
        this.element.style[Modernizr.prefixed('transform')] = "translate(" + xPos + "px, 0)";
      }
      return this;
    };

    return Article;

  })();

}).call(this);

(function() {

  this.ArticleController = (function() {

    function ArticleController() {
      var _this = this;
      this.nextButton = new NavButton({
        element: document.querySelector("#next a"),
        direction: NavButton.DIRECTION_NEXT
      });
      this.prevButton = new NavButton({
        element: document.querySelector("#previous a"),
        direction: NavButton.DIRECTION_PREV
      });
      radio(NavButton.CLICK_EVENT).subscribe(function(direction) {
        if (direction === NavButton.DIRECTION_NEXT) {
          if (_this.nextArticle.tableOfContents) {
            return window.location = "/";
          } else {
            return _this.pageSlider.moveBackwardAnimated(false);
          }
        } else {
          if (_this.prevArticle.tableOfContents) {
            return window.location = "/";
          } else {
            return _this.pageSlider.moveForwardAnimated(false);
          }
        }
      });
      window.addEventListener("popstate", function(e) {
        if (_this.nextArticle.href === location.href) {
          return _this.pageSlider.moveBackwardAnimated(false);
        } else if (_this.prevArticle.href === location.href) {
          return _this.pageSlider.moveForwardAnimated(false);
        }
      });
      this.setCurrentArticle(new Article({
        html: document.body.innerHTML,
        element: document.querySelector("article.post")
      }));
    }

    ArticleController.prototype.setCurrentArticle = function(currentArticle) {
      var _this = this;
      this.currentArticle = currentArticle;
      this.currentArticle.makeCurrent();
      if ((this.analyticsCallback != null) && typeof this.analyticsCallback === "function") {
        this.analyticsCallback({
          category: "articleChange",
          action: "asynchronous",
          pathname: location.pathname
        });
      }
      this.nextArticle = Article.fetchFromURL(this.currentArticle.nextURL);
      this.prevArticle = Article.fetchFromURL(this.currentArticle.prevURL);
      if (this.nextArticle != null) {
        this.nextArticle.unstage().append();
        if (this.nextArticle.tableOfContents) {
          this.nextButton.hide();
        } else {
          if (this.nextButton.hidden()) this.nextButton.show();
        }
      }
      if (this.prevArticle != null) {
        this.prevArticle.unstage().append();
        if (this.prevArticle.tableOfContents) {
          this.prevButton.hide();
        } else {
          if (this.prevButton.hidden()) this.prevButton.show();
        }
      }
      if (this.pageSlider != null) {
        return this.pageSlider.setArticle(this.currentArticle);
      } else {
        this.pageSlider = new PageSlider({
          article: this.currentArticle
        });
        radio(PageSlider.DIRECTION_CHANGE).subscribe(function(direction) {
          if (direction === PageSlider.DIRECTION_RIGHT) {
            return _this.showNextArticle();
          } else if (direction === PageSlider.DIRECTION_LEFT) {
            return _this.showPrevArticle();
          }
        });
        return radio(PageSlider.DIRECTION_FINISHED).subscribe(function(completed) {
          if (completed) return _this.setStagedToCurrent();
        });
      }
    };

    ArticleController.prototype.setStagedToCurrent = function() {
      if (this.nextArticle.isStaged()) {
        this.prevArticle.remove();
        return this.setCurrentArticle(this.nextArticle);
      } else if (this.prevArticle.isStaged()) {
        this.nextArticle.remove();
        return this.setCurrentArticle(this.prevArticle);
      }
    };

    ArticleController.prototype.showNextArticle = function() {
      this.nextArticle.stage();
      if (this.prevArticle != null) return this.prevArticle.unstage();
    };

    ArticleController.prototype.showPrevArticle = function() {
      this.prevArticle.stage();
      if (this.nextArticle != null) return this.nextArticle.unstage();
    };

    ArticleController.prototype.setAnalyticsCallback = function(analyticsCallback) {
      this.analyticsCallback = analyticsCallback;
      return typeof this.analyticsCallback === "function";
    };

    return ArticleController;

  })();

}).call(this);

(function() {

  this.NavButton = (function() {

    NavButton.DIRECTION_NEXT = "NavButtonDirectionNext";

    NavButton.DIRECTION_PREV = "NavButtonDirectionPrev";

    NavButton.CLICK_EVENT = "NavButtonClickEvent";

    function NavButton(params) {
      var _this = this;
      if (params == null) params = {};
      this.element = params['element'];
      this.direction = params['direction'];
      this.element.addEventListener("click", function(event) {
        event.preventDefault();
        if (_this.direction === NavButton.DIRECTION_NEXT) {
          radio(NavButton.CLICK_EVENT).broadcast(NavButton.DIRECTION_NEXT);
        }
        if (_this.direction === NavButton.DIRECTION_PREV) {
          return radio(NavButton.CLICK_EVENT).broadcast(NavButton.DIRECTION_PREV);
        }
      });
    }

    NavButton.prototype.hidden = function() {
      return this.element.className === "hidden";
    };

    NavButton.prototype.show = function() {
      this.element.className = "";
      return this;
    };

    NavButton.prototype.hide = function() {
      this.element.className = "hidden";
      return this;
    };

    return NavButton;

  })();

}).call(this);

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
