var gulp = require('gulp'),
  watch = require('gulp-watch'),
  prefixer = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  nunjucks = require('gulp-nunjucks'),
  rigger = require('gulp-rigger'),
  twig = require("gulp-twig"),
  gcmq = require('gulp-group-css-media-queries'),
  csscomb = require('gulp-csscomb'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  browsersync = require("browser-sync"),
  changed = require('gulp-changed'),
  svgSprite = require('gulp-svg-sprite'),
  del = require("del"),
  reload = browsersync.reload;

var path = {
  build: {
    html: 'build/',
    js: 'build/js/',
    css: 'build/css/',
    img: 'build/img/',
    svg: 'build/img/svg'
  },
  src: {
    html: 'src/*.html',
    js: 'src/js/*.js',
    style: 'src/style/*.scss',
    img: 'src/img/**/*.*',
    svg: 'src/img/svg/*.svg'
  },
  watch: {
    html: 'src/**/*.html',
    js: 'src/js/**/*.js',
    style: 'src/style/**/*.scss',
    img: 'src/img/**/*.*',
    svg: 'src/img/svg/*.svg'
  },
  clean: './build'
};

function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./build"
    },
    port: 3000
  });
  done();
}

function browserSyncReload(done) {
  browsersync.reload();
  done();
}

function clean() {
  return del(path.clean);
}

function html() {
  return gulp
    .src(path.src.html)
    .pipe(twig())
    .pipe(nunjucks.compile())
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({ stream: true }));
}

function js() {
  return gulp
    .src(path.src.js)
    .pipe(rigger())
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({ stream: true }));
}

function style() {
  return gulp
    .src(path.src.style)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(prefixer())
    .pipe(gcmq())
    .pipe(csscomb())
    .pipe(sourcemaps.write('/sourcemaps'))
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({ stream: true }));
}

function image() {
  return gulp
    .src(path.src.img)
    .pipe(changed(path.build.img))
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({ stream: true }));
}

var svgConfig = {
  mode: {
    stack: {
      sprite: "../sprite.svg"
    }
  }
};

function svg() {
  return gulp
    .src(path.src.svg)
    .pipe(cheerio({
      run: function ($) {
        $('[fill]').removeAttr('fill');
        $('[stroke]').removeAttr('stroke');
        $('[style]').removeAttr('style');
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(svgSprite(svgConfig))
    .pipe(gulp.dest(path.build.svg))
    .pipe(reload({ stream: true }));
};

function watchFiles() {
  gulp.watch([path.watch.style], style);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.img], image);
  gulp.watch([path.watch.svg], svg);
}

gulp.task("image", image);
gulp.task("style", style);
gulp.task("js", js);
gulp.task("html", html);
gulp.task("clean", clean);
gulp.task('svg', svg);

gulp.task("build", gulp.series(clean, gulp.parallel(style, image, html, js, svg)));

gulp.task("watch", gulp.parallel(watchFiles, browserSync));