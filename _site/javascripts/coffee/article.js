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
        if (window.location.href !== this.href) {
          history.pushState(null, null, this.href);
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
