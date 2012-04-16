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

# The PageSlider class acts more or less like a UISwipeGestureRecognizer.
class @PageSlider
  
  # Some oh so useful class level constants.
  @DIRECTION_CHANGE   = "PageSlideDirectionChangeEvent"
  @DIRECTION_FINISHED = "PageSlideDirectionChangeFinished"
  @DIRECTION_UNKNOWN  = 0
  @DIRECTION_LEFT     = 1
  @DIRECTION_RIGHT    = 2
  
  # The constructor takes in an element and an article. The touchTarget listens 
  # for touches while the article is the element being translated.
  constructor: (params={}) ->
    @touchTarget  = params['touchTarget'] || document.body
    
    # Use the article passed in as our @article.
    @setArticle(params['article'])
    
    # If the browser doesn't support touch or we're missing any of the essentials
    # we'll just avoid doing anything at all.
    if Modernizr.touch and @article? and @touchTarget?
      @touchTarget.addEventListener("touchstart",   ((event) => @touchStart(event)),  false)
      @touchTarget.addEventListener("touchmove",    ((event) => @touchMove(event)),   false)
      @touchTarget.addEventListener("touchend",     ((event) => @touchEnd(event)),    false)
      @touchTarget.addEventListener("touchcancel",  ((event) => @touchCancel(event)), false)
  
  # Replaces the article element. This way we can continue to reuse one instance of 
  # PageSlider rather than recreate a new instance every time the currentArticle 
  # changes.
  setArticle: (@article) ->
    @slideTo = 0
    @article.translate(@slideTo)
  
  # When the touch begins we want to reset the direction. We also want to track the 
  # initial position of the touch as we'll be using that to calculate the delta as
  # their finger moves.
  touchStart: (event) ->
    @article.disableTransition()
    if event.touches.length == 1
      @direction    = PageSlider.DIRECTION_UNKNOWN
      @slideStartX  = event.touches[0].pageX
      @slideStartY  = event.touches[0].pageY
  
  touchMove: (event) ->
    # If they're using more than one finger we're just not going to count
    # that. Sorry, one finger swipes only.
    if event.touches.length == 1
      
      # Grab the absolute value of the X and Y offset so that we can get an
      # idea of whether or not the user is trying to scroll or swipe.
      xOffset = Math.abs(event.touches[0].pageX - @slideStartX)
      yOffset = Math.abs(event.touches[0].pageY - @slideStartY)
      
      # Some minor attempt to prevent swiping from disabling scrolling.
      # Oh how much easier it is to control this when you write native
      # apps in obj-c.
      event.preventDefault() if xOffset > 10
      if xOffset > yOffset
        
        # The first thing to do is determine where we're going by getting the 
        # actual offset.
        @slideTo = event.touches[0].pageX - @slideStartX
        
        # Set direction to right and broadcast the event if it's happened.
        # We want to ensure we only do this once as the resulting listeners
        # may or may not write to the DOM which get's expensive during 
        # transitions.
        if @slideTo > 0 and @direction != PageSlider.DIRECTION_RIGHT
          @direction = PageSlider.DIRECTION_RIGHT
          radio(PageSlider.DIRECTION_CHANGE).broadcast(@direction)
        
        # If they're moving to the left we'll do the same thing.
        else if @slideTo < 0 and @direction != PageSlider.DIRECTION_LEFT
          @direction = PageSlider.DIRECTION_LEFT
          radio(PageSlider.DIRECTION_CHANGE).broadcast(@direction)
    else
      @slideTo = 0
    
    @article.translate(@slideTo)
    
  touchEnd: (event) ->
    limit = window.innerWidth/3
    if @slideTo > 0 and Math.abs(@slideTo) >= limit
      @moveTo(window.innerWidth)
    else if @slideTo < 0 and Math.abs(@slideTo) >= limit
      @moveTo(-window.innerWidth)
    else
      @moveTo(0)
  
  # If anything cancels our touch events for any reason let's
  # move everything back to how it was before they started touching
  # it with their sausage fingers.
  touchCancel: (event) ->
    @moveTo(0)
        
  moveTo: (@slideTo) ->
    @article.enableTransition()
    
    # Wonder why this isn't just built into Modernizr.prefixed()...
    # http://modernizr.com/docs/#prefixed
    transEndEventNames =
        'WebkitTransition' : 'webkitTransitionEnd'
        'MozTransition'    : 'transitionend'
        'OTransition'      : 'oTransitionEnd'
        'msTransition'     : 'MSTransitionEnd'
        'transition'       : 'transitionend'

    @article.element.addEventListener(transEndEventNames[ Modernizr.prefixed('transition') ], => 
      radio(PageSlider.DIRECTION_FINISHED).broadcast((@slideTo != 0))
    )
    
    @article.translate(@slideTo)
  
  # Automated a page slide to the next article.
  moveForwardAnimated: (animated=true)->
    @direction = PageSlider.DIRECTION_LEFT
    radio(PageSlider.DIRECTION_CHANGE).broadcast(@direction)
    if animated
      @moveTo(window.innerWidth)
    else
      radio(PageSlider.DIRECTION_FINISHED).broadcast(true)
  
  # Automated a page slide to the previous article.
  moveBackwardAnimated: (animated=true) ->
    @direction = PageSlider.DIRECTION_RIGHT
    radio(PageSlider.DIRECTION_CHANGE).broadcast(@direction)
    if animated
      @moveTo(-window.innerWidth)
    else
      radio(PageSlider.DIRECTION_FINISHED).broadcast(true)