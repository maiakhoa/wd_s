// Require our dependencies
var autoprefixer = require('autoprefixer');
var bourbon = require('bourbon').includePaths;
var browserSync = require('browser-sync');
var cheerio = require('gulp-cheerio');
var concat = require('gulp-concat');
var cp = require('child_process');
var cssnano = require('gulp-cssnano');
var del = require('del');
var es = require('event-stream');
var glob = require('glob');
var gulp = require('gulp');
var gutil = require('gulp-util');
var imagemin = require('gulp-imagemin');
var jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var mqpacker = require('css-mqpacker');
var neat = require('bourbon-neat').includePaths;
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var reload = browserSync.reload;
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sassJson = require('gulp-sass-json');
var sort = require('gulp-sort');
var sourcemaps = require('gulp-sourcemaps');
var spritesmith = require('gulp.spritesmith');
var svgmin = require('gulp-svgmin');
var svgstore = require('gulp-svgstore');
var uglify = require('gulp-uglify');
var wpPot = require('gulp-wp-pot');

// Set assets paths.
var paths = {
	css: ['./*.css', '!*.min.css'],
	icons: 'assets/images/svg-icons/*.svg',
	images: ['assets/images/*', '!assets/images/*.svg'],
	jekyll_src: ['pattern-library/src/*.{html,md}', 'pattern-library/src/_layouts/*.html', 'pattern-library/src/_posts/*.{html,md}', 'pattern-library/src/_patterns/*.{html,md}'],
	jekyll_assets: 'pattern-library/assets/scss/**/*.scss',
	pattern_scripts: 'assets/js/patterns/*.js',
	php: './*.php',
	php: ['./*.php', './**/*.php'],
	sass: 'assets/sass/**/*.scss',
	sass_colors: 'assets/sass/utilities/variables/_colors.scss',
	scripts: 'assets/js/concat/*.js',
	sprites: 'assets/images/sprites/*.png'
};

// Custom CLI messages
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Handle errors and alert the user.
 */
function handleErrors () {
	var args = Array.prototype.slice.call(arguments);

	notify.onError({
		title: 'Task Failed [<%= error.message %>',
		message: 'See console.',
		sound: 'Sosumi' // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
	}).apply(this, args);

	gutil.beep(); // Beep 'sosumi' again

	// Prevent the 'watch' task from stopping
	this.emit('end');
}

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', ['sass-json'], function (done, code) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn('jekyll', ['build'], {stdio: 'inherit'}).on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('jekyll-watch', ['jekyll-build'], function() {
	// Files to watch.
	var files = [
		paths.icons,
		paths.jekyll_assets,
		paths.jekyll_src,
		paths.pattern_scripts,
		paths.sass,
		paths.sass_colors,
		paths.scripts,
		paths.sprites
	];
	
	// Run tasks when files change.
	// Watch Jekyll src/ styles and .html/.md files
	gulp.watch(paths.jekyll_assets, ['jekyll-styles']);
	gulp.watch(paths.jekyll_src, ['jekyll-build']);
	
	// Watch WP theme's Style and Scripts too
	gulp.watch(paths.sass, ['styles']);
	gulp.watch(paths.sass_colors, ['sass-json', 'jekyll-rebuild']);
	gulp.watch(paths.scripts, ['pattern_scripts', 'scripts']);
	
	browserSync.init( files,{
		proxy: 'http://wd-s.dev',
		startPath: 'wp-content/themes/wd_s/pattern-library/dist/index.html',
		watchOptions: {
			debounceDelay: 1000
		}
    });
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('jekyll-styles', function () {
    return gulp.src('pattern-library/assets/scss/style.scss')
		
		// Wrap tasks in a sourcemap.
		.pipe(sourcemaps.init())

			// Compile Sass using LibSass.
			.pipe(sass({
				//includePaths: neat, // Include Bourbon & Neat
				outputStyle: 'expanded' // Options: nested, expanded, compact, compressed
			}))

			// Parse with PostCSS plugins.
			.pipe(postcss([
				autoprefixer({
					browsers: ['last 2 version']
				}),
				mqpacker({
					sort: true
				}),
			]))

		// Create sourcemap.
		.pipe(sourcemaps.write())
		
		.pipe(cssnano({
			safe: true // Use safe optimizations
		}))
		
		.pipe(gulp.dest('pattern-library/assets'))
		.pipe(notify({ message: 'Jekyll assets compiled' }))
		.pipe(browserSync.stream());
});

// create colors.json from theme's _colors.scss
gulp.task('sass-json', function () {
    var stream = gulp.src(paths.sass_colors)
        .pipe(sassJson())
        .pipe(gulp.dest('pattern-library/src/_data'))
		return stream;
});

/**
 * Compile Sass and run stylesheet through PostCSS.
 *
 * https://www.npmjs.com/package/gulp-sass
 * https://www.npmjs.com/package/gulp-postcss
 * https://www.npmjs.com/package/gulp-autoprefixer
 * https://www.npmjs.com/package/css-mqpacker
 */
gulp.task('postcss', function() {
	return gulp.src('assets/sass/*.scss', paths.css)

	// Deal with errors.
	.pipe(plumber({ errorHandler: handleErrors }))

	// Wrap tasks in a sourcemap.
	.pipe(sourcemaps.init())

		// Compile Sass using LibSass.
		.pipe(sass({
			includePaths: [].concat(bourbon, neat),
			errLogToConsole: true,
			outputStyle: 'expanded' // Options: nested, expanded, compact, compressed
		}))

		// Parse with PostCSS plugins.
		.pipe(postcss([
			autoprefixer({
				browsers: ['last 2 version']
			}),
			mqpacker({
				sort: true
			}),
		]))

	// Create sourcemap.
	.pipe(sourcemaps.write())

	// Create style.css.
	.pipe(gulp.dest('./'))
	.pipe(browserSync.stream())
});

/**
 * Minify and optimize style.css.
 *
 * https://www.npmjs.com/package/gulp-cssnano
 */
gulp.task('cssnano', function() {
	return gulp.src('style.css')
	.pipe(plumber({ errorHandler: handleErrors }))
	.pipe(cssnano({
		safe: true // Use safe optimizations
	}))
	.pipe(rename('style.min.css'))
	.pipe(gulp.dest('./'))
	.pipe(browserSync.stream());
});

/**
 * Minify, concatenate, and clean SVG icons.
 *
 * https://www.npmjs.com/package/gulp-svgmin
 * https://www.npmjs.com/package/gulp-svgstore
 * https://www.npmjs.com/package/gulp-cheerio
 */
gulp.task('svg', function() {
	return gulp.src(paths.icons)
	.pipe(plumber({ errorHandler: handleErrors }))
	.pipe(svgmin())
	.pipe(rename({ prefix: 'icon-' }))
	.pipe(svgstore({ inlineSvg: true }))
	.pipe(cheerio({
		run: function($, file) {
			$('svg').attr('style', 'display:none');
			$('[fill]').removeAttr('fill');
		},
		parserOptions: { xmlMode: true }
	}))
	.pipe(gulp.dest('assets/images/'))
	.pipe(browserSync.stream());
});

/**
 * Optimize images.
 *
 * https://www.npmjs.com/package/gulp-imagemin
 */
gulp.task('imagemin', function() {
	return gulp.src(paths.images)
	.pipe(plumber({ errorHandler: handleErrors }))
	.pipe(imagemin({
		optimizationLevel: 5,
		progressive: true,
		interlaced: true
	}))
	.pipe(gulp.dest('assets/images'));
});

/**
 * Concatenate images into a single PNG sprite.
 *
 * https://www.npmjs.com/package/gulp.spritesmith
 */
gulp.task('spritesmith', function() {
	return gulp.src(paths.sprites)
	.pipe(plumber({ errorHandler: handleErrors }))
	.pipe(spritesmith({
		imgName:   'sprites.png',
		cssName:   '../../assets/sass/base/_sprites.scss',
		imgPath:   'assets/images/sprites.png',
		algorithm: 'binary-tree'
	}))
	.pipe(gulp.dest('assets/images/'))
	.pipe(browserSync.stream());
});

/**
 * Concatenate and minify javascripts.
 *
 * https://www.npmjs.com/package/gulp-uglify
 * https://www.npmjs.com/package/gulp-concat
 */
gulp.task('uglify', function() {
	return gulp.src(paths.scripts)
	.pipe(plumber({ errorHandler: handleErrors }))
	.pipe(sourcemaps.init())
		.pipe(uglify({
			mangle: false
		}))
	.pipe(concat('project.js'))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('assets/js'))
	.pipe(browserSync.stream());
});

/**
 * Scan the theme and create a POT file.
 *
 * https://www.npmjs.com/package/gulp-wp-pot
 */
gulp.task('wp-pot', function () {
	return gulp.src(paths.php)
	.pipe(plumber({ errorHandler: handleErrors }))
	.pipe(sort())
	.pipe(wpPot({
		domain: '_s',
		destFile:'_s.pot',
		package: '_s',
		bugReport: 'http://_s.com',
		lastTranslator: 'John Doe <mail@_s.com>',
		team: 'Team <mail@_s.com>'
	}))
	.pipe(gulp.dest('languages/'));
});

/**
 * Process tasks and reload browsers on file changes.
 *
 * https://www.npmjs.com/package/browser-sync
 */
gulp.task('watch', function() {

	// Files to watch.
	var files = [
		paths.icons,
		paths.sass,
		paths.sass_colors,
		paths.scripts,
		paths.sprites
	];

	// Kick off BrowserSync.
	browserSync.init( files, {
		open: false,
		proxy: "_s.dev",
		watchOptions: {
			debounceDelay: 1000
		}
	});

	// Run tasks when files change.
	gulp.watch(paths.icons, ['icons']);
	gulp.watch(paths.sass, ['styles']);
	gulp.watch(paths.sass_colors, ['sass-json']);
	gulp.watch(paths.scripts, ['scripts']);
	gulp.watch(paths.sprites, ['sprites']);
});

/**
 * Delete compiled files.
 */
gulp.task('clean:icons', function() {
	return del(['assets/images/svg-icons.svg']);
});

gulp.task('clean:styles', function() {
	return del(['style.css', 'style.min.css']);
});

gulp.task('clean:scripts', function() {
	return del(['assets/js/project.js']);
});

gulp.task('clean:pot', function() {
	return del(['languages/_s.pot']);
});

/**
 * Create indivdual tasks.
 */
gulp.task('i18n', ['clean:pot','wp-pot']);
gulp.task('icons', ['clean:icons', 'svg']);
gulp.task('jekyll', ['jekyll-watch']);
gulp.task('styles', ['clean:styles', 'postcss', 'cssnano']);
gulp.task('scripts', ['clean:scripts', 'uglify']);
gulp.task('sprites', ['imagemin', 'spritesmith']);
gulp.task('default', ['i18n','icons', 'styles', 'scripts', 'sprites']);