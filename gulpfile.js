'use strict';

var gulp = require('gulp');

//plug ins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

//lint task 
gulp.task('lint', function() {
	return gulp.src('public/javascripts/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('sass', function(){
  return gulp.src('public/sass/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./public/css/'))
});

gulp.task('browserify', function() {
    return browserify('./public/javascripts/game.js')
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('main.js'))
        // Start piping stream to tasks!
        .pipe(gulp.dest('./public/js/'));
});

//watch
gulp.task('watch', function(){
  gulp.watch('public/javascripts/*.js', ['lint', 'browserify']);
  gulp.watch('./public/sass/*.scss', ['sass']);
})

gulp.task('default', ['lint', 'sass', 'browserify', 'watch']);