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
  
  show: ->
    @element.className = ""
  
  hide: ->
    @element.className = "hidden"