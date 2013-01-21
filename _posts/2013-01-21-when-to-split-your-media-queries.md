---
layout: post
author: Jim Jeffers
title: "When to Split Your Media Queries"
published: true
excerpt:
  When media queries inherit from on to another your changes are no longer isolated and you ended up often consistently having to return to your CSS to reset styles you just wrote.
---

One problem with using media queries is that you eventually get to a point where you're over compensating for the effects of the cascade. Mobile first or desktop first, the problem arises from multiple media queries inheriting from one another. 

Let's say you're on a mobile first project (where the default CSS styles are for mobile devices) which now has media query blocks to support four additional viewport sizes. All four of the additional viewport media queries inherit from the mobile style sheet. If you want to make adjustments to the mobile styles and don't want them to effect the rest of your layouts, you'll have to overwrite them in one of the other media queries to effectively undo them.

As an example let's say we have a site navigation. In our mobile stylesheet we may want to absolutely position this element in the top right corner of the screen. However, in our tablet layout we've found we can simply get the desired effect by floating the element. Finally, in our larger desktop layout we realize we don't need to float or position the element:

{% highlight css %}
/* Seemingly harmless default styles. */
.site-navigation {
  display: block;
  position: absolute;
  top: 0;
  right: 0;
}

@media (min-width: 800px) {
  .site-navigation {
    float: right;
    /* BAD: Resetting default styles. */
    position: static;
    right: auto;		
    top: auto;
  }
}

@media (min-width: 1024px) {
  .site-navigation {
    margin: 1rem 0;
    /* WORSE: Resetting reset styles. */
    float: none;
  }
}
{% endhighlight %}

As you can see each of our layouts did not need to inherit from one another. We had to undo our styles each time we moved a level up. This isn't always the case but from my experience this can happen very often. Imagine if your entire project was like this. It can become a mess very quickly.

Allowing media queries to inherit from one another creates a situation where your changes to specific viewport are no longer isolated. Fortunately, [Simurai solved this with a technique called "Media Splitting"](http://simurai.com/post/30451824480/media-query-splitting). Here's how the our example might look if we used media splitting:

{% highlight css %}
.site-navigation {
  display: block;
}

@media (max-width: 799px) {
  .site-navigation {
    position: absolute;
    top: 0;
    right: 0;
  }
}

@media (min-width: 800px) and (max-width: 1023px) {
  .site-navigation {
    float: right;
  }
}

@media (min-width: 1024px) {
  .site-navigation {
    margin: 1rem 0;
  }
}
{% endhighlight %}

Notice we still have a default block of style for setting the site navigation to display block. Rules that apply across media queries isn't necessarily something that should be avoided. But it should only be done when it makes sense. Right now I've found that rules that determine the appearance in terms of display type, font-family, and color tend to be best. In contrast, rules that specify positioning, layout, margins, and even padding are prime candidates for media splitting.

There is an inherited problem with media splitting. Older browsers that don't support media queries will never get a full layout to display. That's because there will never be a completely default set of styles that aren't depending on a media query in some way. [Jeremy Keith has shared his thoughts on browsers that don't support media queries](http://adactio.com/journal/5964/). In short, he's made use of CSS pre-processors such as SASS or LESS to build a media query free version of his CSS to serve to IE8 and below. However, [he doesn't necessarily advise doing what he did](http://adactio.com/journal/5969/) as his post was really along the lines why we even bother to provide identical experiences to older browser.

So while there isn't really a conclusive solution to dealing with this yet. I would advise using media splitting in your projects. To support IE I would come up with a compromise from Jeremy's article -- setup a preprocessors to use a default media query block and generate a 'legacy.css' file which you can server to IE8 with a conditional comment. Now who wants to write a build script for doing just that?