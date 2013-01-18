---
layout: post
author: Jim Jeffers
title: "Bite-sized Strategies for CSS"
published: true
excerpt:
  Breaking down selectors into bitesized morsels of functional goodness is key to front-end success!
---

Practicing restraint with the complexity of CSS selectors is important to building a more maintainable project. Practicing restraint in the rules you write are equally important. It's really tempting to write specific selectors to query a specific set of elements and then pile on a stack of CSS rules. But doing so creates two problems:

1. You can't easily re-use your styles. In effect, you need to come up with an alternate selector that you tack on to the existing rule to apply it to other DOM objects.
2. If you need to provide variations of an object you'll create a new rule which will likely need additional rules to undo changes in the original rule.

The solution to these problems is bite-sized CSS. Bite sized css involves creating specific classes to describe specific attributes you want to re-apply on different objects. For an example, lets create a simple CSS framework for buttons used throughout a web app UI.

Let's say you have a call to action that looks like a big red button with all cap text. A bad practice would be to use a very specific selector and a large set of rules:

{% highlight css %}
/* BAD */
#content > div#primary > section#call-to-action a {
	background-color: red;
	border-radius: 5px;
	font-weight: bold;
  display: block;
  text-transform: uppercase;
  margin: 0 1em;
	padding: 0.25em 0.5em;
  text-color: white;
	text-decoration: none;	
}
{% endhighlight %}

But what happens when we want to apply a similar button style to our confirm and cancel buttons used throughout the size?

{% highlight css %}
/* WORSE! */
#content > div#primary > section#call-to-action a,
#content form input.confirm,
#content form input.secondary {
	...
}

/* Overwriting rules we just applied... */
#content form input.confirm,
#content form input.secondary {
	background: blue;
	text-transform: capitalize;
}

/* Overwriting rules we just overwrote! */
#content form input.secondary {
	background: grey;
	font-weight: normal;
}
{% endhighlight %}

If we develop a habit of solving problems in CSS like this we wind up no better than where we started. We only make our life harder as each additional use case for an item with a similar style results in us returning to the CSS to extend and create additional selectors and rules rather than simply reapplying them across elements.

The solution is to use name-spaced classes that can be combined to achieve the desired effect:

{% highlight css %}
/* GOOD */
.bitesized-btn {
	background: blue;
	border-radius: 5px;
	display: block;
  text-color: white;
	text-decoration: none;	
}

.bitesized-btn-default {
	font-weight: bold;
}

.bitesized-btn-secondary {
	background: grey;
}

.bitesized-btn-priority {
	background: red;
	font-weight: bold;
	text-transform: uppercase;
}

.bitesized-btn-standalone {
  margin: 0 1em;
	padding: 0.25em 0.5em;
}
{% endhighlight %}

With a set of bite sized classes to manage the presentation of our buttons we can simply add classes on to applicable portions of our markup without creating additional complexity in our CSS.

{% highlight html %}
<!-- Call to Action -->
<section id="call-to-action">
	…
	<a href="…" class="bitesized-btn bitesized-btn-priority bitesized-btn-standalone">…</a>
</section>
{% endhighlight %}

And then later on when we have a form with dual buttons:

{% highlight html %}
<!-- Form Buttons -->
<form>
	…
	<input class="bitesized-btn bitesized-btn-default"
		value="Save" type="submit"/>
	<input class="bitesized-btn bitesized-btn-secondary"
	 	value="Cancel" type="button"/>
</form>
{% endhighlight %}

There are two important things to note:

1. The type of element we use no longer matters. We could use these classes on an anchor, input, or whatever DOM element we wanted.
2. The class names are still semantic. They add value to our markup. Yes it is implied that each class is applying a specific variation to the appearance, but we're using meaningful names to do so. We aren't using classes named button-red or button-blue. We have primary and secondary intents now clearly labeled throughout the site. If we want to add any specific functionality to our project with javascript we can easily query the default action for any given perform just by querying `$(".bitesized-btn-default")`.
3. The prefix `bitesized-` could be replaced with any name you wanted to use for your project. For example, google's maia CSS framework prefixes with the `maia-` namespace.

Approaching CSS in a bitesized approach provides a clear pattern for success. Each additional use case which causes us to present a different variation of a button will now make our CSS framework more powerful. If we followed the path shown in the earlier example, each additional use case would make our CSS more difficult to modify or maintain.