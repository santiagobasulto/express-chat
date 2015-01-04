// Gulpfile.js
var gulp = require('gulp')
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var less = require('gulp-less');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');


// we'd need a slight delay to reload browsers
// connected to browser-sync after restarting nodemon
var BROWSER_SYNC_RELOAD_DELAY = 500;
var JS_GLOB = 'js/**/*.js';


gulp.task('less', function () {
  gulp.src('./less/*.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('js', function () {
   return gulp.src(JS_GLOB)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('serve', function () {
  nodemon({script: 'app.js', ext: 'html js', ignore: ['public/']})
    .on('restart', function () {

    })
})

gulp.task('default', ['less', 'serve'], function(){
    gulp.watch("less/**/*.less", ['less']);
});
