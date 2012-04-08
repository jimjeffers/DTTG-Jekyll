class @PageSlider
  constructor: (params={}) ->
    @element = document.getElementById(params['id'])
    @article = document.getElementById(params['articleId'])
    @nextUrl = @getUrlForId(params['next'])
    @prevUrl = @getUrlForId(params['previous'])
    
    if Modernizr.touch and @article? and @element? and @nextUrl? and @prevUrl?
      @element.addEventListener("touchstart", ((event) => @touchStart(event)), false)
      @element.addEventListener("touchmove", ((event) => @touchMove(event)), false)
      @element.addEventListener("touchend", ((event) => @touchEnd(event)), false)
      @element.addEventListener("touchcancel", ((event) => @touchCancel(event)), false)
      
      @slideTo = 0
      @translate()
  
  touchStart: (event) ->
    @disableTransition()
    if event.touches.length == 1
      @slideStartX = event.touches[0].pageX
      @slideStartY = event.touches[0].pageY
  
  touchMove: (event) ->
    if event.touches.length == 1
      xOffset = Math.abs(event.touches[0].pageX - @slideStartX)
      yOffset = Math.abs(event.touches[0].pageY - @slideStartY)
      event.preventDefault() if xOffset > 50
      if xOffset > yOffset
        @slideTo = event.touches[0].pageX - @slideStartX
    else
      @slideTo = 0
    @translate()
    
  touchEnd: (event) ->
    @enableTransition()
    limit = window.innerWidth/3
    urlToLoad = false
    if @slideTo > 0 and Math.abs(@slideTo) >= limit and @nextUrl != false
      @slideTo = window.innerWidth
      urlToLoad = @nextUrl
    else if @slideTo < 0 and Math.abs(@slideTo) >= limit and @prevUrl != false
      @slideTo = -window.innerWidth
      urlToLoad = @prevUrl
    else
      @slideTo = 0
    @translate()
    if urlToLoad
      setTimeout( ->
        window.location = urlToLoad
      , 75)
  
  touchCancel: (event) ->
    @enableTransition()
    @slideTo = 0
    @translate()
  
  enableTransition: ->
    @article.style[Modernizr.prefixed('transition')] = "all 0.2s ease-out"
  
  disableTransition: ->
    @article.style[Modernizr.prefixed('transition')] = ""
  
  translate: ->
    if Modernizr.csstransforms3d
      @article.style[Modernizr.prefixed('transform')] = "translate3d(#{@slideTo}px, 0, 0)"
    else if Modernizr.csstransforms
      @article.style[Modernizr.prefixed('transform')] = "translate(#{@slideTo}px, 0)"
  
  getUrlForId: (id) ->
    listItem = document.getElementById(id)
    if listItem?
      return listItem.getElementsByTagName("a")[0].href
    else
      return false