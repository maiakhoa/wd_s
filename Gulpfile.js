// Require our dependencies
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var cp = require('child_process');
var cssnano = require('gulp-cssnano');
var del = require('del');
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var mqpacker = require('css-mqpacker');
var neat = require('node-neat').includePaths;
var notify = require('gulp-notify');
var postcss = require('gulp-postcss');
var reload = browserSync.reload;
var rename = require('gulp-rename');
var sass = require('gulp-sass');
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
	php: './*.php',
	sass: 'assets/sass/**/*.scss',
	scripts: 'assets/js/concat/*.js',
	sprites: 'assets/images/sprites/*.png'
};

// Custom CLI messages
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done, code) {
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
gulp.task('jekyll-browser-sync', ['jekyll-build'], function() {
	browserSync({
        server: 'pattern-library/dist'
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

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('jekyll-watch', function () {
	// Run tasks when files change.
	
	// Watch Jekyll src/ styles and .html/.md files
	gulp.watch(paths.jekyll_assets, ['jekyll-styles']);
	gulp.watch(paths.jekyll_src, ['jekyll-rebuild']);
	
	// Watch WP theme's Style and Scripts too
	gulp.watch(paths.sass, ['styles']);
	gulp.watch(paths.scripts, ['scripts']);
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

	// Wrap tasks in a sourcemap.
	.pipe(sourcemaps.init())

		// Compile Sass using LibSass.
		.pipe(sass({
			includePaths: neat, // Include Bourbon & Neat
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
	.pipe(browserSync.stream());
});

/**
 * Minify and optimize style.css.
 *
 * https://www.npmjs.com/package/gulp-cssnano
 */
gulp.task('cssnano', function() {
	return gulp.src('style.css')
	.pipe(cssnano({
		safe: true // Use safe optimizations
	}))
	.pipe(rename('style.min.css'))
	.pipe(gulp.dest('./'))
	.pipe(browserSync.stream());
});

/**
 * Minify SVG files.
 *
 * https://www.npmjs.com/package/gulp-svgmin
 */
gulp.task('svgmin', function() {
	return gulp.src(paths.icons)
	.pipe(svgmin({ plugins: [
		{ removeDoctype: true },
		{ removeComments: true },
		{ removeEmptyAttrs: true },
		{ removeUselessStrokeAndFill: true }
	]}))
	.pipe(gulp.dest('assets/images/svg-icons/'));
});

/**
 * Concatenate icons in a single SVG sprite.
 *
 * https://www.npmjs.com/package/gulp-svgstore
 */
gulp.task('svgstore', function() {
	return gulp.src(paths.icons)
	.pipe(svgstore({
		inlineSvg: true
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
	.pipe(imagemin({
		optimizationLevel: 5
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
 * Make POT file for i18n.
 *
 * https://www.npmjs.com/package/gulp-wp-pot
 */
gulp.task('i18n', function () {
	return gulp.src(paths.php)
	.pipe(sort())
	.pipe(wpPot({
		domain: '_s.dev',
		destFile:'_s.pot',
		package: '_s',
		bugReport: 'http://example.com',
		lastTranslator: 'John Doe <mail@example.com>',
		team: 'Team Team <mail@example.com>'
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
		paths.scripts,
		paths.sprites
	];

	// Kick off BrowserSync.
	browserSync.init( files, {
		proxy: "wd-s.dev",
	});

	// Run tasks when files change.
	gulp.watch(paths.icons, ['icons']);
	gulp.watch(paths.sass, ['styles']);
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

/**
 * Create indivdual tasks.
 */
gulp.task('jekyll', ['jekyll-browser-sync', 'jekyll-watch']);
gulp.task('pattern-library', ['jekyll-browser-sync', 'pl-watch']);
gulp.task('icons', ['clean:icons', 'svgmin', 'svgstore']);
gulp.task('styles', ['clean:styles', 'postcss', 'cssnano']);
gulp.task('scripts', ['clean:scripts', 'uglify']);
gulp.task('sprites', ['imagemin', 'spritesmith']);
gulp.task('default', ['i18n','icons', 'styles', 'scripts', 'sprites']);