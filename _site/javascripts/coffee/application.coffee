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

# domready is a nice cross browser document.ready 
# event listener.
domready ->
  
  # I'm using a half second time out to get a nice
  # delayed effect on the controls.
  setTimeout( ->
    
    # For my blog I can do what I want. So only
    # browsers that support SVG will get to see the
    # controls. I might substitute plain text controls
    # later. Screenreaders will still be able to 
    # read the alt text.
    if Modernizr.svg
      
      # Display the pevious and next buttons.
      nav = document.querySelector("#posts_nav")
      nav.className = "active" if nav?
      
  , 500)
  
  # We'll only setup the article controller if no archives are present.
  # This way I can preserve scrolling on the Table of Contents page.
  if !document.querySelector(".archives")
    
    # The contained class traps the overflow of the body. This prevents
    # some unwanted horizontal inertial scrolling on iOS.
    document.body.className = "contained"
      
    # The article controller fetches and manages the presentation 
    # of articles. This is a custom class I wrote in coffee script.
    # See article_controller.coffee to view the source.
    articleController = new ArticleController()
    
    # I want to track page views occuring from the swipe navigation
    # so I've allotted for a callback to be set on the article 
    # controller.
    articleController.setAnalyticsCallback (event={}) ->
      _gat._getTrackerByName()._trackPageview(event['pathname'])
      _gat._getTrackerByName()._trackEvent(event['category'], event['action'])