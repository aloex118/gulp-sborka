// Fonts, JQuery, Bootstrap, Webp
// Подключенные плагины
const gulp = require('gulp');
const del = require('del');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass')(require('sass'));
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const size = require('gulp-size');
const htmlmin = require('gulp-htmlmin');
const newer = require('gulp-newer');
const gulppug = require('gulp-pug');
const browserSync = require('browser-sync');
const browsersync = require('browser-sync').create();

// Пути
const path = {
    html: {
        src: 'src/*.html',
        dest: 'public'
    },

    styles: {
        src: ['src/styles/**/*.sass', 'src/styles/**/*.scss'],
        dest: 'public/css'
    },

    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'public/js/'
    },

    img: {
        src: 'src/img/**',
        dest: 'public/img'
    },

    pug: {
        src: 'src/*.pug',
        dest: 'public/'
    }
}

// Очистка
function clean() {
    return del(['dist/*', '!dist/img'])
}

// HTML
function html() {
    return gulp.src(path.html.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(size())
    .pipe(gulp.dest(path.html.dest))
    .pipe(browsersync.stream())
}

// Pug
function pug() {
    return gulp.src(path.pug.src)
    .pipe(gulppug())
    .pipe(size())
    .pipe(gulp.dest(path.pug.dest))
    .pipe(browsersync.stream())
}

// Картинки
function img() {
    return gulp.src(path.img.src)
    .pipe(newer(path.img.dest))
    .pipe(imagemin({
        progressive: true
    }))
    .pipe(size())
    .pipe(gulp.dest(path.img.dest))
}

// Обработка стилей
function styles() {
    return gulp.src(path.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        cascade: false
    }))
    .pipe(cleanCSS({
        level: 2
    }))
    .pipe(rename({
        basename: 'main',
        suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(size())
    .pipe(gulp.dest(path.styles.dest))
    .pipe(browsersync.stream())
}

// Обработка JS
function scripts() {
    return gulp.src(path.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(size())
    .pipe(gulp.dest(path.scripts.dest))
    .pipe(browsersync.stream())
}

// Наблюдатель
function watch() {
    browsersync.init({
        server: {
            baseDir: "./public/"
        }
    })
    gulp.watch(path.html.dest).on('change', browsersync.reload)
    gulp.watch(path.html.src, html)
    gulp.watch(path.styles.src, styles)
    gulp.watch(path.scripts.src, scripts)
    gulp.watch(path.img.src, img)
}

// Сборка
const build = gulp.series(clean, html, gulp.parallel(styles, scripts, img), watch)

// Отдельные команды
exports.pug = pug
exports.build = build
exports.default = build