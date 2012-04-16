# Notes:
#
# I tried to avoid frameworks as much as possible but
# have opted for a few external dependencies. If you 
# see anything unfamiliar to you please note that 
# this project relies on the following libraries:
#
# modernizr.js (http://modernizr.com/docs/)
# domReady.js (https://github.com/ded/domready)
# radio.js (http://radio.uxder.com/documentation.html)

# This is a really simple wrapper. We assign an element and a direction
# the button will broadcast a click event whenever it is clicked.
# This allows us to subscribe and handle one type of event regardless 
# of how many nav buttons we create.
class @NavButton
  @DIRECTION_NEXT = "NavButtonDirectionNext"
  @DIRECTION_PREV = "NavButtonDirectionPrev"
  @CLICK_EVENT    = "NavButtonClickEvent"
  
  constructor: (params={}) ->
    @element    = params['element']
    @direction  = params['direction']
    
    @element.addEventListener("click", (event) =>
      event.preventDefault()
      radio(NavButton.CLICK_EVENT).broadcast(NavButton.DIRECTION_NEXT) if @direction == NavButton.DIRECTION_NEXT
      radio(NavButton.CLICK_EVENT).broadcast(NavButton.DIRECTION_PREV) if @direction == NavButton.DIRECTION_PREV
    )
  
  hidden: ->
    @element.className == "hidden"
  
  # Note: The behaviors all return 'this' for chainability.
  # ----------------------------------------------------------------
  
  show: ->
    @element.className = ""
    this
  
  hide: ->
    @element.className = "hidden"
    this