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
      return this.element.className = "";
    };

    NavButton.prototype.hide = function() {
      return this.element.className = "hidden";
    };

    return NavButton;

  })();

}).call(this);
