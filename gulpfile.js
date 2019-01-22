"use strict";

const gulp = require("gulp");
const less = require("gulp-less");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const rename = require("gulp-rename");
const server = require("browser-sync").create();
const del = require("del");
const run = require("run-sequence");
const mqpacker = require("css-mqpacker"); //media
const minify = require("gulp-csso");

gulp.task("style", function () {
    return gulp.src("less/style.less")
        .pipe(plumber())
        .pipe(less())
        .pipe(postcss([
            autoprefixer({
                grid: true,
                browsers: [
                    "last 2 versions"
                ]
            }),
            mqpacker({
                sort: true
            })
        ]))

        .pipe(minify())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("build/css"))
        .pipe(server.stream());

});

gulp.task("html", function () {
    return gulp.src("*.html")
        .pipe(gulp.dest("build"));
});


gulp.task("serve", function () {
    server.init({
        server: "build/",
        notify: false,
        open: true,
        cors: true,
        ui: false
    });

    gulp.watch("less/**/*.less", gulp.series('style'));
    gulp.watch("*.html", gulp.series("html", "refresh"))

});

gulp.task("refresh", function (done) {
    server.reload();
    done();
});

gulp.task("copy", function () {
    return gulp.src([
        "*.html"
    ], {
        base: "."
    })
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

