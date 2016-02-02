'use strict';
/**
 * gulpfile.js
 *
 * @description Glup tasks define here.
 *  @module gulpfilejs
 *  @requires gulp
 *  @requires gulp-uglify
 *  @requires gulp-concat
 *  @requires gulp-sass
 *  @requires gulp-ruby-sass
 *  @requires gulp-sourcemaps
 *  @requires gulp-livereload
 *  @requires gulp-clean
 *  @requires gulp-mocha
 *  @requires gulp-util
 *  @requires gulp-minify-css
 *  @requires gulp-if
 *  @requires gulp-imagemin
 *  @requires gulp-closure-compiler
 *  @requires gulp-jsmin
 *  @requires gulp-strip-debug
 *  @requires q
 */
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var rubySass = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');
var cleanup = require('gulp-clean');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var minifyCss = require('gulp-minify-css');
var gulpif = require('gulp-if');
//var imagemin = require('gulp-imagemin');
var minify = require('gulp-closure-compiler');
var jsmin = require('gulp-jsmin');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var stylish = require('gulp-jscs-stylish');
var stripDebug = require('gulp-strip-debug');
var Q = require('q');
var rename = require('gulp-rename');
/**
 * @description path
 * @type {Object}
 * @property {array}  appScripts - includes path of all the js file in public/script/app/.
 * @property {array}  devScripts - includes path of all the js file in public/script/dev/.
 * @property {array}  sass - includes path of all the js file in scss/.
 * @property {array}  livereload - includes path of all the jade template in views/.
 * @property {array}  cleanup - includes path of all the static file in public/.
 * @property {array}  images - includes path of all the images in public/script/frontend/.
 */
var paths = {
    serverScripts: ['controllers/**/*.js', 'helpers/**/*.js', 'lib/**/*.js', 'routes/**/*.js'],
    appScripts: ['public/scripts/app/**/*.js'],
    basicsScripts: ['public/scripts/basics/**/*.js'],
    modulesScripts: ['public/scripts/modules/**/*.js'],
    mixinsScripts: ['public/scripts/mixins/**/*.js'],
    pluginsScripts: ['public/scripts/plugins/**/*.js', 'public/scripts/v1/**/*.js'],
    devScripts: ['public/scripts/dev/**/*.js'],
    sass: ['scss/**/*.scss'],
    livereload: ['views/*.jade', 'views/**/*.jade'],
    cleanup: ['public/styles/index.css', 'public/styles/index-v1.css', 'public/scripts/*.js', 'public/images/*.*'],
    images: ['public/images/*', 'public/images/_originals/**/*']
};

paths.jshintpath = paths.serverScripts.concat(paths.appScripts).concat(paths.basicsScripts).concat(paths.modulesScripts).concat(paths.mixinsScripts);

/** @function
 *  @name gulpfilejs.cleanup
 *  @description A gulp Task for removing files and folders from path.cleanup.
 **/
gulp.task('cleanup', function () {
    return gulp.src(paths.cleanup, {read: false})
        .pipe(cleanup({force: true}));
});
/** @function
 *  @name gulpfilejs.app
 *  @description A gulp Task for removing files and folders from paths.appScripts.
 **/
gulp.task('app', ['cleanup'], function () {
    return gulp.src(paths.appScripts, { container: 'app' })
        .pipe(sourcemaps.init())
        .pipe(concat('app.js', {newLine: ';'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/scripts'));
});
/** @function
 *  @name gulpfilejs.app-watch
 *  @description Inline source maps are embedded in the source file here source is, paths.appScripts. + debug is true : to output debug messages
 *  @description concat app.js
 *  @description To write external source map files, pass a path relative to the destination here destination is public/scripts
 **/
gulp.task('app-watch', function () {
    return gulp.src(paths.appScripts)
        .pipe(sourcemaps.init({debug: true}))
        .pipe(concat('app.js', {newLine: ';'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/scripts'));
});

gulp.task('basics', ['cleanup'], function () {
    return gulp.src(paths.basicsScripts, { container: 'basics' })
        .pipe(sourcemaps.init())
        .pipe(concat('basics.js', {newLine: ';'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/scripts'));
});

gulp.task('basics-watch', function () {
    return gulp.src(paths.basicsScripts)
        .pipe(sourcemaps.init({debug: true}))
        .pipe(concat('basics.js', {newLine: ';'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/scripts'));
});

gulp.task('modules', ['cleanup'], function () {
    return gulp.src(paths.modulesScripts, { container: 'modules' })
        .pipe(sourcemaps.init())
        .pipe(concat('modules.js', {newLine: ';'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/scripts'));
});

gulp.task('modules-watch', function () {
    return gulp.src(paths.modulesScripts)
        .pipe(sourcemaps.init({debug: true}))
        .pipe(concat('modules.js', {newLine: ';'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/scripts'));
});

gulp.task('mixins', ['cleanup'], function () {
    return gulp.src(paths.mixinsScripts, { container: 'mixins' })
        .pipe(sourcemaps.init())
        .pipe(concat('mixins.js', {newLine: ';'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/scripts'));
});

gulp.task('mixins-watch', function () {
    return gulp.src(paths.mixinsScripts)
        .pipe(sourcemaps.init({debug: true}))
        .pipe(concat('mixins.js', {newLine: ';'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/scripts'));
});

gulp.task('plugins', ['cleanup'], function () {
    return gulp.src(paths.pluginsScripts, { container: 'plugins' })
        .pipe(sourcemaps.init())
        .pipe(concat('plugins.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/scripts'));
});

gulp.task('plugins-watch', function () {
    return gulp.src(paths.pluginsScripts)
        .pipe(sourcemaps.init({debug: true}))
        .pipe(concat('plugins.js', {newLine: ';'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/scripts'));
});
/** @function
 *  @name gulpfilejs.minifyScripts
 *  @description minify all the js from  public/scripts/ and write minified script in public/scripts
 **/
gulp.task('minifyScripts', ['plugins', 'app', 'basics', 'modules', 'mixins'], function () {
    return gulp.src(['public/scripts/*.js', '!public/scripts/plugins.js'])
        .pipe(sourcemaps.init())
        .pipe(jsmin())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/scripts'));
});
/** @function
 *  @name gulpfilejs.minifyDevScripts
 *  @description minify all the js from  public/scripts/dev/ and write minified script in public/scripts/dist
 **/
gulp.task('minifyDevScripts', function () {
    return gulp.src(['public/scripts/dev/*.js'])
        .pipe(sourcemaps.init())
        .pipe(jsmin())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/scripts/dist'));
});
/** @function
 *  @name gulpfilejs.uglify
 *  @description Minify files with UglifyJS.
 *  @description minify all the js from  public/scripts/ and write minified script in public/scripts
 **/
gulp.task('uglify', function () {
    return gulp.src('public/scripts/*.js')
        .pipe(sourcemaps.init())
        .pipe(uglify({mangle: false, compress: true}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/scripts'));
});

gulp.task('sass', ['sass1'], function () {
    return rubySass('scss/basics/index.scss', {trace: true, sourcemap: true, loadPath: 'scss', style: 'compressed', verbose: true})
        .on('error', function (err) {
            console.error('Error', err.message);
        })
        .pipe(minifyCss({keepSpecialComments: 1, advanced: false, aggressiveMerging: false}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/styles/'));
});

gulp.task('sass1', function () {
    return rubySass('scss/basics/index-v1.scss', {trace: true, sourcemap: true, loadPath: 'scss', style: 'compressed', verbose: true})
        .on('error', function (err) {
            console.error('Error', err.message);
        })
        .pipe(minifyCss({keepSpecialComments: 1, advanced: false, aggressiveMerging: false}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/styles/'));
});

gulp.task('be-test', function () {
    gulp.src('test/**/*.js')
        .pipe(mocha({reporter: 'nyan'}))
        .on('error', function (err) {
        });
});
/** @function
 * @name gulpfilejs.images
 * @description minify images from paths.images and them in public/images
 **/
gulp.task('images', [], function () {
    return gulp.src(paths.images)
        //.pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest('public/images'));
});
/** @function
 * @name copy-images
 * @description copy images from public/images/_originals/ to public/images
 **/
gulp.task('copy-images', ['cleanup'], function () {
    return gulp.src('public/images/_originals/**/*')
        .pipe(gulp.dest('public/images'));
});

gulp.task('livereload', function () {
    gulp.src(paths.livereload)
        .pipe(livereload());
});

// rerun the task when a file changes
gulp.task('watch', ['cleanup', 'sass', 'plugins', 'app', 'basics', 'modules', 'mixins', 'images'], function () {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.pluginsScripts, ['plugins-watch']);
    gulp.watch(paths.appScripts, ['app-watch']);
    gulp.watch(paths.basicsScripts, ['basics-watch']);
    gulp.watch(paths.modulesScripts, ['modules-watch']);
    gulp.watch(paths.mixinsScripts, ['mixins-watch']);
    //gulp.watch(paths.devScripts, ['minifyDevScripts']);
    gulp.watch('public/images/_originals/**/*', ['copy-images']);
});

gulp.task('watch-dg', ['sass', 'scripts-dg'], function () {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.scripts, ['scripts-dg']);
    gulp.watch(paths.devScripts, ['minifyDevScripts']);
});

gulp.task('scripts-dg', function () {
    return gulp.src(paths.scripts)
        .pipe(concat('main.js', {newLine: ';'}))
        .pipe(gulp.dest('public/scripts'));
});

// taks related to check docs
gulp.task('clean-doc', function () {
    return gulp.src('docs', {read: false})
        .pipe(cleanup());
});

gulp.task('doc', ['clean-doc'], function () {
    var jsdoc = require('gulp-jsdoc');
    return gulp.src(paths.jshintpath)
        .pipe(jsdoc('docs'));
});

gulp.task('lint', function () {
    gulp.src(paths.jshintpath)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('gulp-checkstyle-jenkins-reporter'));

    gulp.src(paths.jshintpath)
        .pipe(jscs({configPath: '.jscsrc'}))        // enforce style guide
        .on('warning', function () {
            process.exit(1);                        // Stop on error
        })
        .pipe(stylish());                           // log style errors

    // gulp.task('lint', function () {
    // gulp.src(paths.jshintpath)
    //     .pipe(jshint())
    //     .pipe(jshint.reporter('default'))
    //     .pipe(jshint.reporter('fail'));
    // });
});

/*
 gulp.task('lint', function () {
 gulp.src(paths.jshintpath)
 .pipe(jshint('.jshintrc'))
 .pipe(jshint.reporter('jshint-stylish'))
 .pipe(jshint.reporter('fail'));

 gulp.src(paths.jshintpath)
 .pipe(jscs({configPath: '.jscsrc'}))        // enforce style guide
 .on('warning', function () {
 process.exit(1);                        // Stop on error
 })
 .pipe(stylish());                           // log style errors
 });
 */

// the default task (called when you run `gulp` from cli)
gulp.task('default', ['watch']);
gulp.task('build', ['cleanup', 'images', 'app', 'basics', 'modules', 'mixins', 'sass', 'minifyScripts', 'minifyDevScripts']);
gulp.task('dg', ['scripts-dg', 'sass', 'watch-dg', 'minifyDevScripts']);
gulp.task('docs', ['doc']);
