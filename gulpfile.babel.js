'use strict';

/** globals */
import gulp from 'gulp';
import os from 'os';
import pkg from './package.json';

/** plug-ins */
import addSrc from 'gulp-add-src';
import autoprefixer from 'gulp-autoprefixer';
import babel from 'gulp-babel';
import browserSync from 'browser-sync';
import clean from 'gulp-clean';
import concat from 'gulp-concat';
import cssmin from 'gulp-cssmin';
import gnf from 'gulp-npm-files';
import gulpCopy from 'gulp-copy';
import header from 'gulp-header';
import jshint from 'gulp-jshint';
import open from 'gulp-open';
import order from 'gulp-order';
import plumber from 'gulp-plumber';
import sass from 'gulp-sass';
import uglify from 'gulp-uglify';

/** dependencies */
import pump from 'pump';
import rename from 'gulp-rename';

/*========================================================
=            Global path and config variables            =
========================================================*/

const root = {
    app: 'app/',
    src: 'src/'
};
const app = {
    assets: root.app + 'assets/',
    components: root.app + 'assets/components/',
    css: root.app + 'assets/css/',
    js: root.app + 'assets/js/',
    templates: root.app + 'templates/'
};
const src = {
    components: root.src + 'components/',
    js: root.src + 'js/',
    scss: root.src + 'scss/'
};

const options = {
    browser: os.platform() === 'linux' ? 'google-chrome' : (
        os.platform() === 'darwin' ? 'google chrome' : (
            os.platform() === 'win32' ? 'chrome' : 'firefox')),
    browsers: [
        '> 1%',
        'last 2 versions',
        'Firefox ESR',
        'Opera 12.1'
    ],
    browserSync: {
        files: [app + '**'],
        port: 9992,
        server: {
            baseDir: root.app
        }
    },
    connect: {
        root: root.app,
        port: 9992
    },
    header: [
        '/**',
        ' * <%= pkg.name %>',
        ' * <%= pkg.title %>',
        ' * <%= pkg.url %>',
        ' * @author <%= pkg.author %>',
        ' * @version v<%= pkg.version %>',
        ' * @license <%= pkg.license %>',
        ' */',
        ''
    ].join('\n')
};

/**
 * Clean files and folders, remove generated files for clean deploy
 * https://github.com/peter-vilja/gulp-clean
 */

gulp.task('clean', () => {
    return gulp.src([
            app.assets + 'css/style.min.css',
            app.assets + 'css/style.min.css',
            app.templates
        ], {
            read: false
        })
        .pipe(clean());
});

/**
 * Concatenate JavaScript files, imports all .js files and appends project banner
 * https://github.com/contra/gulp-concat
 */

gulp.task('concat', () => {
    return gulp.src([])
        .pipe(addSrc.append(src.js + 'app.babel.js'))
        .pipe(addSrc.append(src.js + 'app.controller.babel.js'))
        .pipe(addSrc.append(src.js + 'utils/lodash.service.babel.js'))
        .pipe(addSrc.append(src.js + 'utils/app-blobal.service.babel.js'))
        .pipe(addSrc.append(src.js + 'services/**/*.babel.js'))
        .pipe(addSrc.append(src.js + 'components/**/*.babel.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('scripts.min.js'))
        .pipe(gulp.dest(app.js));
});

/**
 * Connect port, starts a local webserver
 * https://github.com/BrowserSync/browser-sync
 */

gulp.task('connect', () => {
    browserSync.init(options.browserSync);
});

/**
 * Build npm components
 * https://www.npmjs.com/package/gulp-npm-files
 */

gulp.task('copyNpmDeps', () => {
    return gulp.src(gnf(), { base: './' })
        .pipe(gulp.dest(app.assets));
});

/**
 * Copy template html files
 * https://www.google.com/search?q=gulp-copy&oq=gulp-copy&aqs=chrome.0.0l6.2864j0j4&sourceid=chrome&ie=UTF-8&safe=active
 */

gulp.task('copyTemplates', () => {
    gulp.src(src.js + '**/*.tmpl.html')
        .pipe(gulp.dest(app.templates));
});

/**
 * * Compile Sass/SCSS files
 * https://github.com/dlmanning/gulp-sass
 * Adds vendor prefixes automatically
 * https://github.com/sindresorhus/gulp-autoprefixer
 * CSS minification
 * https://github.com/chilijung/gulp-cssmin
 */

gulp.task('css', () => {
    return gulp.src([
            src.components + 'normalize-css/normalize.css',
            src.scss + 'style.scss'
        ])
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: options.browsers
        }))
        .pipe(cssmin())
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest(app.css))
        .pipe(browserSync.stream());
});

/**
 * Project banner, dynamically prepand to CSS/JS files
 * Inherits text from package.json
 * https://github.com/tracker1/gulp-header
 */

gulp.task('header', () => {
    return gulp.src([
            app.css + 'style.min.css',
            app.js + 'scripts.min.js'
        ])
        .pipe(header(options.header, { pkg: pkg }));
});

/**
 * JavaScript linter, manage the options inside .jshintrc file
 * https://github.com/spalger/gulp-jshint
 */

gulp.task('jshint', () => {
    return gulp.src([
            src.js + '*.js',
            'gulpfile.babel.js'
        ])
        .pipe(jshint())
        .pipe(jshint.reporter('default', { verbose: true }));
});

/**
 * Opens the web server in the browser
 * https://github.com/stevelacy/gulp-open
 */

gulp.task('open', () => {
    return gulp.src(__filename)
        .pipe(open({
            app: options.browser,
            uri: 'http://localhost:' + options.connect.port
        }));
});

/**
 * Compresses and minifies all JavaScript files into one
 * https://github.com/terinjokes/gulp-uglify
 */

gulp.task('uglify', (cb) => {
    return pump([
        gulp.src(src.js),
        uglify(),
        gulp.dest(app.js)
    ], cb);
});

/**
 * Runs tasks against changed watched files
 * https://github.com/floatdrop/gulp-watch
 */

gulp.task('watch', () => {
    gulp.watch(root.app + '*.html').on('change', browserSync.reload);
    gulp.watch(src.js + '**/*.js', ['concat', 'jshint', 'header']);
    gulp.watch(src.scss + '**/*.scss', ['css', 'header']);
});

/*======================================
=            Compiled Tasks            =
======================================*/

/**
 * Default task
 * Compile Sass, concatenate scripts, start local server
 */
gulp.task('default', [
    'copyNpmDeps',
    'css',
    'jshint',
    'concat',
    'header',
    'copyTemplates',
    'connect',
    'watch'
]);

/**
 * Build task
 * Compresses all JS/CSS files
 */
gulp.task('build', [
    'copyNpmDeps',
    'sass:dist',
    'autoprefixer:dist',
    'clean',
    'jshint',
    'uglify',
    'header',
    'copyTemplates'
]);