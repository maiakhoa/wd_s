---
layout: page
title: How-to
permalink: /how-to/
---

This pattern library is build on [Jekyll](http://jekyllrb.com/). 

## Adding a new pattern

* Create a new file in pattern-library/src/_patterns/ , e.g. my-cool-pattern.html
* Make sure you have the appropriate YAML front matter at the top, and your code underneath, e.g.:
{% highlight yaml %}
---
author: Huey Lewis
category: layout
date: 2016-02-08 12:12:25 -0500
description: "A responsive grid using Neat's <code>span-columns</code> and media queries. View more Neat [examples](http://neat.bourbon.io/examples/). **Requires:** jQuery and [jQuery MatchHeight](https://cdnjs.cloudflare.com/ajax/libs/jquery.matchHeight/0.7.0/jquery.matchHeight-min.js)"
layout: pattern
tags: grid
title:  "Non-Flexbox Grid"
---
{% endhighlight %}
* Add your associated Sass partial to the theme's assets/sass/patterns/_my-cool-pattern.scss. Be sure to wrap it in conditional so FEDs can turn the pattern on/off in the patterns/index.scss, e.g.

`_my-cool-pattern.scss`
{% highlight sass %}
// set $use-my-cool-pattern: true/false in patterns/index.scss
@if $use-my-cool-pattern == true {
	// your patterns sass here
}
{% endhighlight %}
`patterns/index.scss`
{% highlight sass %}
// set $use-my-cool-pattern: true/false in patterns/index.scss
$use-my-cool-pattern : true !default;
@import	"_my-cool-pattern";
{% endhighlight %}
* Drop any Javascript files in theme's assets/js/patterns/
