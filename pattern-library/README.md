# Pattern Library for wd_s 1.0
 
The Pattern Library is a rapid-prototyping tool built with [Jekyll](https://jekyllrb.com/) (static site generator), and was originally built to play nice with Gulp, but could easily be ported. 

Yes, it is a static site inside of a WordPress theme :)

* Please keep in mind that everything in the `/dist` is destroyed and overwritten on each build by everythign in the `/src`. 

Requirements:

* [Jekyll](https://jekyllrb.com/)
* [Gulp](http://gulpjs.com/)

Some features:

* [BrowserSync](https://www.browsersync.io/) - synchronised browser testing
* [Sass-to-json](https://www.npmjs.com/package/gulp-sass-json) - watches `_colors.scss` color variables, creates JSON (`src/_data`), and generates a swatch page (`dist/colors/index.html`) from template (Jekyll).
* Patterns - contains a series of Patterns that leverage wd_s Patterns library assets, e.g. `(src/_patterns/pagination.html -> dist/patterns/pagination/index.html)`

## Adding a Pattern
Please read instructions here: [How-to](src/how-to.md), which is also inside of Pattern Library static site, once generated.