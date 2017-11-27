// jshint esversion: 6, strict: false,undef: true, unused:true

const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

gulp.task('minify', () => {
    return gulp.src('./Class.js')
        .pipe(uglify())
        .pipe(rename('Class.min.js'))
        .pipe(gulp.dest('./'))
        ;
});
