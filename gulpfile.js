"use strict";

const gulp = require("gulp");
const less = require("gulp-less");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const rename = require("gulp-rename");
const server = require("browser-sync").create();
const del = require("del");
const print = require('gulp-print');
const run = require("run-sequence");
const mqpacker = require("css-mqpacker"); //media
const minify = require("gulp-csso");

gulp.task("style", function () {
    return gulp.src("less/style.less")
        .pipe(plumber())
        .pipe(less())
        .pipe(postcss([
            autoprefixer({
                // grid: true,
                browsers: [
                    "last 2 versions"
                ]
            }),
            mqpacker({
                sort: true
            })
        ]))

        .pipe(gulp.dest("build/css"))
        .pipe(minify())
        // .pipe(rename("style.min.css"))
        // .pipe(gulp.dest("build/css"))
        .pipe(server.stream());

});

gulp.task("serve", function () {
    server.init({
        server: "."
    });

    gulp.watch("less/**/*.less", gulp.series(
        'style'
    ));

    gulp.watch("*.html")
        .on("change", server.reload);
});

gulp.task("copy", function() {
    return gulp.src([
        // "fonts/**/*.{woff,woff2}",
        // "img/**",
        // "js/**",
        "*.html"
    ], {
        base: "." })
        .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
    return del("build");
});

gulp.task('build', gulp.series(
    'clean',
    'copy',
    'style',
    'serve'
));

