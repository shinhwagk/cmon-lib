"use strict";

const gulp = require('gulp');
const ts = require('gulp-typescript');
const del = require('del');

const tsProject = ts.createProject("tsconfig.json");

gulp.task("clean:dist", () => {
    return del(['dist/**/*']);
});

gulp.task("tsc", () => {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});

gulp.task("default", ["clean:dist", "tsc"], () => { });