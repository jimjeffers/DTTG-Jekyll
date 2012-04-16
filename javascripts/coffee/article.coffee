# The Article model converts any blog page on DontTrustThisGuy.com into
# a resource we can work with in javascript.
class @Article
  @TRANSITION = "all 0.2s ease-out"
  @CACHE      = {}
  
  # Here we simply do a normal GET request to load the
  # html for a given page of the site. The model will
  # parse out the article content from the html.
  # Lesson here -- HTML is a dataformat. If you don't 
  # clutter your documents with a massive amount of
  # component markup you'll be able to use them as
  # resources rather than generating multiple formats
  # of all your content.
  @fetchFromURL = (href) ->
    return null if !href? or href == window.location
    
    if Article.CACHE[href]?
      return Article.CACHE[href]
    else
      # Request the adjacent article if a href was supplied.
      request = new XMLHttpRequest()
      request.open("GET",href,false)
      request.send()

      # Article model processes the http response into 
      # something that's fun to play with.
      if request.status == 200
        return Article.CACHE[href] = new Article(html: request.response, href: href)
  
  constructor: (params={}) ->
    # Store the href for reference. We'll need it for history.pushState.
    @href = params["href"]
    
    # Create a temp element to store and parse the response content.
    tempElement = document.createElement("div")
    tempElement.innerHTML = params['html']
    
    # Grab and assign the article.
    if params['element']?
      @element = params['element']
    else
      @element = tempElement.querySelector("article")
    
    # Display the table of contents button.
    tableOfContents = @element.querySelector("#table_of_contents")
    tableOfContents.className = "active" if tableOfContents?
    
    # Grab next and previous hrefs.
    @nextURL = tempElement.querySelector("#next a").href      if tempElement.querySelector("#next a")?
    @prevURL = tempElement.querySelector("#previous a").href  if tempElement.querySelector("#previous a")?
    
    # Grab the title of the article.
    @title   = tempElement.querySelector("h1 a").innerHTML    if tempElement.querySelector("h1 a")?
    
    # This property will return true allowing us to handle
    # the table of contents.
    @tableOfContents = tempElement.querySelector(".archives")?
    
    # Remove temporary element.
    tempElement = null
    
    # By default an article is not 'staged' or 'current'
    @staged   = false
    @current  = false
  
  # Returns the 'current' state of the of the article.
  isCurrent: -> @current
  
  # Returns the 'staged' state of the of the article.
  isStaged: -> @staged
  
  # Note: The behaviors all return 'this' for chainability.
  # ----------------------------------------------------------------

  # Appends the article's element property to the document body.
  append: ->
    # Reset position.
    @translate(0)
    
    # Append the article to the body.
    body = document.querySelector("body")
    body.appendChild(@element)
    this
  
  # Removes the article's element property from the document body.
  remove: ->
    if document.removeChild? and @element.parentNode?
      @element.parentNode.removeChild(@element)
    this
  
  # Marks the article's element property by adding a CSS 'hidden'
  # class. Don't set the element to display: none or opacity: 0
  # here in your script. Manage that in CSS.
  hide: ->
    @element.className = "hidden"
    this
  
  # I have two special classes for posts. One is onStage. The other
  # is offStage. Both classes ensure the post is beneath the current
  # post. This just ensures which post is below the other.
  stage: ->
    @disableTransition()
    @element.className  = "post onStage"
    @staged             = true
    @current            = false
    this
  
  # Ensure the article is beneath any article that's current 'onStage'.
  unstage: ->
    @disableTransition()
    @element.className  = "post offStage"
    @staged             = false
    @current            = false
    this
  
  # Removes any staging classes from the post.
  makeCurrent: ->
    # Redirect to the root url if we're trying to present the table
    # of contents.
    if @tableOfContents
      window.location = "/"
    else
      @disableTransition()
      @element.className  = "post"
      @staged             = false
      @current            = true
      history.pushState(null, null, @href) if window.location.href != @href
      this

  # We enable the and disable the transition with these two helpers
  # only because it's obnoxious to actually translate the page directly
  # to your finger with a transition applied. However, we do want it to
  # slide back into place once the user removes their finger. Either off
  # the screen or simply back into the middle.
  enableTransition: ->
    @element.style[Modernizr.prefixed('transition')] = Article.TRANSITION
    this
  
  disableTransition: ->
    @element.style[Modernizr.prefixed('transition')] = ""
    this
    
  # Note: We use 3D transforms when possible to support hardware
  # acceleration in webkit.
  translate: (xPos) ->
    if Modernizr.csstransforms3d
      @element.style[Modernizr.prefixed('transform')] = "translate3d(#{xPos}px, 0, 0)"
    else if Modernizr.csstransforms
      @element.style[Modernizr.prefixed('transform')] = "translate(#{xPos}px, 0)"
    this