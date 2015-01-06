// Gulpfile.js
var gulp = require('gulp');
var rename = require('gulp-rename');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var less = require('gulp-less');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var browserify = require('gulp-browserify');


// we'd need a slight delay to reload browsers
// connected to browser-sync after restarting nodemon
var BROWSER_SYNC_RELOAD_DELAY = 500;
var JS_GLOB = 'app/**/*.js';
var LESS_GLOB = 'less/**/*.less';


gulp.task('less', function () {
  gulp.src('./less/*.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('js:hint', function () {
   return gulp.src(JS_GLOB)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('browserify', function () {
   return gulp.src('./app/index.js')
    .pipe(browserify({
      insertGlobals : true,
      debug : true
     }))
    .pipe(rename('app.js'))
    .pipe(gulp.dest('./public/js'));
});

gulp.task('js', ['browserify']);

gulp.task('serve', function () {
  nodemon({script: 'server.js', ext: 'html js', ignore: ['public/', 'app/']})
    .on('restart', function () {

    });
});

gulp.task('default', ['less', 'js','serve'], function(){
    gulp.watch(LESS_GLOB, ['less']);
    gulp.watch(JS_GLOB, ['js']);
});
