---
layout: post
author: Jim Jeffers
title: "Orientating Yourself in iOS"
published: true
excerpt:
  It's easy to mess up when attempting to detect interface
  orientations in your iOS app. Here's the run down.
---

Working with device orientation is essential when building apps on a tablet. Users simply expect your app to work in all orientations. The only exception to his expectation are games. And, while the subject seems basic, how to detect and respond to the orientation of the device isn't clear. I've seen people recommend multiple ways to determine the screen's orientation:

You can access the `UIDeviceOrientation *orientation` via the current device itself:

{% highlight objective-c %}
// Not necessary for screen redrawing
[[UIDevice currentDevice] orientation]
{% endhighlight %}

Or you can access the `UIInterfaceOrientation *interfaceOrientation `via the sharedApplication:

{% highlight objective-c %}
// Reliable but not recommended
[[UIApplication sharedApplication] statusBarOrientation]
{% endhighlight %}

Or you can simply pull the `UIInterfaceOrientation *interfaceOrientation` from within your view controller as a standard property provided to you from the SDK:

{% highlight objective-c %}
// BEST METHOD (most of the time)
self.interfaceOrientation
{% endhighlight %}

## What's the difference between Device and Interface Orientations?

The short answer is that you'll probably only care about `UIInterfaceOrientation`. `UIInterfaceOrientation` only covers the possible orientations for the screen in regards to drawing:

{% highlight objective-c %}
UIInterfaceOrientationPortrait == UIDeviceOrientationPortrait
UIInterfaceOrientationPortraitUpsideDown == UIDeviceOrientationPortraitUpsideDown
UIInterfaceOrientationLandscapeLeft == UIDeviceOrientationLandscapeRight
UIInterfaceOrientationLandscapeRight == UIDeviceOrientationLandscapeLeft
{% endhighlight %}

Where `UIDeviceOrientation` provides six different options that represent the actual orientation of the device in 3D space. When redrawing your layout, you probably won't need to know all of these:

{% highlight objective-c %}
UIDeviceOrientationUnknown                    // Can't be determined
UIDeviceOrientationPortrait                   // Home button facing down
UIDeviceOrientationPortraitUpsideDown         // Home button facing up
UIDeviceOrientationLandscapeLeft              // Home button facing right
UIDeviceOrientationLandscapeRight             // Home button facing left
UIDeviceOrientationFaceUp                     // Flat with screen facing up
UIDeviceOrientationFaceDown                   // Flat with screen facing down
{% endhighlight %}

## How can I Determine the Interface Orientation?

While you could simply use equality operators in an if statement to compare the current orientation against the possible orientation types listed above, Apple has provided some nice macros to help you. Just remember that `UIDeviceOrientation` and `UIInterfaceOrientation` have their own macros. Do not mix and match the different orientation enums. The compiler in XCode should provide you with plenty of warnings if you do.

{% highlight objective-c %}
// For UIInterfaceOrientations
UIInterfaceOrientationIsLandscape(UIInterfaceOrientation orientation)
UIInterfaceOrientationIsPortrait(UIInterfaceOrientation orientation)

// For UIDeviceOrientations
UIDeviceOrientationIsLandscape(UIDeviceOrientation orientation)
UIDeviceOrientationIsPortrait(UIDeviceOrientation orientation)
{% endhighlight %}

## When can I determine the orientation?

A lot of problem, A LOT, run into an issue where the macros mentioned above always return true for portrait or vice versa. This is likely because `self.interfaceOrientation` is `NULL` when a view initially loads. You will not have access to the current orientation in your view controller until it is about to be presented. This means you will want to handle any interface drawing in the `viewWillAppear:` or `viewDidAppear:` methods.

{% highlight objective-c %}
-(void)viewDidLoad {
  self.interfaceOrientation // NULL
}

-(void)viewWillAppear:(BOOL)animated {
  self.interfaceOrientation // UIInterfaceOrientationLandscapeLeft
}
{% endhighlight %}

## Which method works best?

First off, I recommend avoiding `UIDeviceOrientation` unless you're doing something really specific, in which case you must have a reason to want to use `UIDeviceOrientation`. If you don't know why you're using `UIDeviceOrientation` you probably shouldn't be using it.

Second, if you're working within a `UIViewController` or subclass of `UIViewController` I would rely on the `self.interfaceOrientation` property. This is what Apple wants you to use and it's also the most convenient.

And last but not least, if you're working in a `UIView` or subclass of `UIView` the convenient property won't exist. In which case you'll want to access the orientation of the status bar from the shared application. That's the code that looks like this:

{% highlight objective-c %}
[[UIApplication sharedApplication] statusBarOrientation]
{% endhighlight %}

The `sharedApplication` solution seems to be the most popular solution, mainly because it works almost anywhere. But I personally see it as a bit of a hack. Only use this if you really need to. You shouldn't need to react to interface orientation within a `UIView`. This is the job of a `UIViewController`. But if you find yourself in the need of a quick fix in a messy project, this is a dirty solution to get what you want. Just remember to wash your hands after you use it.
