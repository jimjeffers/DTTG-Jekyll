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

    return ArticleController;

  })();

}).call(this);
