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

# The ArticleController manages the current document
# fetches adjacent articles. And essentially repeats
# this process when the current article changes. 
class @ArticleController
  constructor: () ->
    # The nav buttons are wrapped in a custom class to control their
    # presentation.
    @nextButton = new NavButton(element: document.querySelector("#next a"),     direction: NavButton.DIRECTION_NEXT)
    @prevButton = new NavButton(element:document.querySelector("#previous a"),  direction: NavButton.DIRECTION_PREV)
    
    # This radio subscription will handle page navigation via the
    # directional buttons in the page UI.
    radio(NavButton.CLICK_EVENT).subscribe (direction) =>
      if direction == NavButton.DIRECTION_NEXT
        if @nextArticle.tableOfContents
          window.location = "/"
        else
          @pageSlider.moveBackwardAnimated(true)
      else
        if @prevArticle.tableOfContents
          window.location = "/"
        else
          @pageSlider.moveForwardAnimated(true)
    
    # Reacting to the HTML5 popstate event. This is when
    # the user navigates with the browser's forward and
    # back button.
    window.addEventListener("popstate", (e) =>
      if @nextArticle.href == location.href
        @pageSlider.moveBackwardAnimated(false)
      else if @prevArticle.href == location.href
        @pageSlider.moveForwardAnimated(false)
    )
    
    # Setup the current article based on the current document.
    @setCurrentArticle(new Article(
      html:     document.body.innerHTML
      element:  document.querySelector("article.post")
    ))
  
  # Set's the current article and grabs it's adjacent 
  setCurrentArticle: (@currentArticle) ->
    @currentArticle.makeCurrent()
    
    # Grab the next and previous articles.
    @nextArticle = Article.fetchFromURL(@currentArticle.nextURL)
    @prevArticle = Article.fetchFromURL(@currentArticle.prevURL)
    
    if @nextArticle?
      @nextArticle.unstage().append()
      if @nextArticle.tableOfContents
        @nextButton.hide()
      else
        @nextButton.show() if @nextButton.hidden()
    
    if @prevArticle?
      @prevArticle.unstage().append()
      if @prevArticle.tableOfContents
        @prevButton.hide()
      else
        @prevButton.show() if @prevButton.hidden()
    
    # The page slider manages the movement of various posts.
    if @pageSlider?
      @pageSlider.setArticle(@currentArticle)
    else
      @pageSlider = new PageSlider(article: @currentArticle)
      
      # We'll listen to the page slider, check to see which direction it's
      # moving toward, and display the appropriate article.
      radio(PageSlider.DIRECTION_CHANGE).subscribe (direction) =>
        if direction == PageSlider.DIRECTION_RIGHT
          @showNextArticle()
        else if direction == PageSlider.DIRECTION_LEFT
          @showPrevArticle()

      # If the swipe completed we'll need to let the article controller
      # to update the current article.
      radio(PageSlider.DIRECTION_FINISHED).subscribe (completed) =>
        @setStagedToCurrent() if completed
    
  # Replaces the current article with the article on stage.
  setStagedToCurrent: ->
    if @nextArticle.isStaged()
      @prevArticle.remove()
      @setCurrentArticle(@nextArticle)
    else if @prevArticle.isStaged()
      @nextArticle.remove()
      @setCurrentArticle(@prevArticle)
  
  # Ensures the current article's next article is displayed 
  # beneath the current article. (note: next_date > current_date)
  showNextArticle: ->
    @nextArticle.stage()
    @prevArticle.unstage() if @prevArticle?
  
  # Ensures the current article's previous article is displayed 
  # beneath the current article. (note: prev_date < current_date)
  showPrevArticle: ->
    @prevArticle.stage()
    @nextArticle.unstage() if @nextArticle?