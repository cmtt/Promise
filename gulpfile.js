"use strict";
var gulp = require('gulp');
var mocha = require('gulp-mocha');

var mochaOptions = {};

gulp.task('default', ['mocha']);

gulp.task('mocha', function () {
  return gulp.src([
    'spec/**/*.js'
  ]).pipe(mocha(mochaOptions));
});
