---
layout: post
author: Jim Jeffers
title: "Two Rules for Writing Better CSS"
published: true
excerpt:
  Flexibility and avoiding specificity are key ingredients to better CSS.
---

This might seem obvious but it's difficult for many to practice. There are really just two good rules to have very effective and efficient CSS.

1. Only use class selectors.
2. Don't scope any rules unless you're namespacing an entire module.

That's really it. Overly simplified? Perhaps. But this is what you need to remember: class level selectors are flexible and perform well. The only selectors more performant are ID based selectors. However, giving every styled object an ID is impractical.

Class level selectors are also extremely flexible. You can repeatedly use them as much as you'd like and providing a specific type of appearance to a given object is as simple as adding a class or two. Thus you have predictable knowledge of how to apply your UI without deferring to convoluted nested tags of markup to recreate outcomes created by complex scoped and tag-based selectors.

Follow these two rules alone and you will find your CSS is much easier to work with in the long run. Yes, you need to add more classes to the elements in your markup. But that provides greater clarity to your future self and others who work on the project later.