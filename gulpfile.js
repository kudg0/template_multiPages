'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const sass = require('gulp-sass');
const del = require('del');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const babel = require('gulp-babel');
const minify = require('gulp-minify');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const changed = require('gulp-changed');
const prettier = require('gulp-prettier');
const beautify = require('gulp-jsbeautifier');
const sourcemaps = require('gulp-sourcemaps');
const hash_src = require('gulp-hash-src');
const posthtml = require('gulp-posthtml');
const htmlmin = require('gulp-htmlmin');
const include = require('posthtml-include');
const richtypo = require('posthtml-richtypo');
const expressions = require('posthtml-expressions');
const removeAttributes = require('posthtml-remove-attributes');
const { quotes, sectionSigns, shortWords } = require('richtypo-rules-ru');
var filejsInclude = require('gulp-include');
var inlinesource = require('gulp-inline-source');

/**
 * Основные переменные
 Если нужно добавить/переменовать еще одну страницу, то нужно добавлять путь к ней по аналогии
 */
const paths = {
  dist: './public/',
  src: './src/',
};
const src = {
  html: {
    main: paths.src + 'pages/main/',
    page_1: paths.src + 'pages/page_1/',
    page_2: paths.src + 'pages/page_2/',
  },
  partials: paths.src + 'partials/',
  img: {
    global: paths.src + 'img/global/',
    main: paths.src + 'img/main/',
    page_1: paths.src + 'img/page_1',
    page_2: paths.src + 'img/page_2',
  },
  scss: {
    main: paths.src + 'sass/main/',
    page_1: paths.src + 'sass/page_1/',
    page_2: paths.src + 'sass/page_2/',
  },
  js: {
    main: paths.src + 'js/main/',
    page_1: paths.src + 'js/page_1/',
    page_2: paths.src + 'js/page_2/',
  },
  fonts: paths.src + '/fonts',
};
const dist = {
  html: {
    main: paths.dist + '/',
    page_1: paths.dist + '/page_1/',
    page_2: paths.dist + '/page_2/',
  },
  img: {
    global: paths.dist + '/img/global/',
    main: paths.dist + '/img/',
    page_1: paths.dist + '/page_1/img/',
    page_2: paths.dist + '/page_2/img/',
  },
  css: {
    main: paths.dist + '/',
    page_1: paths.dist + '/page_1/',
    page_2: paths.dist + '/page_2/',
  },
  js: {
    main: paths.dist + '/',
    page_1: paths.dist + '/page_1/',
    page_2: paths.dist + '/page_2/',
  },
  fonts: paths.dist + '/fonts/',
};

/**
 * Получение аргументов командной строки
 * @type {{}}
 */
const arg = ((argList) => {
  let arg = {},
    a,
    opt,
    thisOpt,
    curOpt;
  for (a = 0; a < argList.length; a++) {
    thisOpt = argList[a].trim();
    opt = thisOpt.replace(/^\-+/, '');

    if (opt === thisOpt) {
      // argument value
      if (curOpt) arg[curOpt] = opt;
      curOpt = null;
    } else {
      // argument name
      curOpt = opt;
      arg[curOpt] = true;
    }
  }

  return arg;
})(process.argv);

/**
 * Очистка папки dist перед сборкой
 * @returns {Promise<string[]> | *}
 */
function clean() {
  return del([paths.dist]);
}
function cleanJsAndCss() {
  if (arg.production === 'true') {
    return del([
      './public/app.js',
      './public/app-min.js',
      './public/index.css',

      './public/**/app.js',
      './public/**/app-min.js',
      './public/**/index.css',
    ]);
  }
}

/**
 * Инициализация веб-сервера browserSync
 * @param done
 */
function browserSyncInit(done) {
  browserSync.init({
    server: {
      baseDir: paths.dist,
    },
    host: 'localhost',
    port: 9000,
    logPrefix: 'log',
  });
  done();
}

/**
 * Функция перезагрузки страницы при разработке
 * @param done
 */
function browserSyncReload(done) {
  browserSync.reload();
  done();
}

/**
 * Копирование шрифтов
 * @returns {*}
 */
function copyFonts() {
  return gulp.src([src.fonts + '/**/*']).pipe(gulp.dest(dist.fonts));
}

/**
 * Шаблонизация и склейка HTML главной страницы
 * @returns {*}
 */
function htmlProcess_main() {
  return gulp
    .src(src.html.main + '**/index.html')
    .pipe(
      posthtml([
        include({ encoding: 'utf8' }),
        expressions(),
        richtypo({
          attribute: 'data-typo',
          rules: [quotes, sectionSigns, shortWords],
        }),
        removeAttributes([
          // The only non-array argument is also possible
          'data-typo',
        ]),
      ]),
    )
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(dist.html.main));
}
/**
 * Шаблонизация и склейка HTML страницы кейсов
 * @returns {*}
 */
function htmlProcess_page_1() {
  return gulp
    .src(src.html.page_1 + '**/index.html')
    .pipe(
      posthtml([
        include({ encoding: 'utf8' }),
        expressions(),
        richtypo({
          attribute: 'data-typo',
          rules: [quotes, sectionSigns, shortWords],
        }),
        removeAttributes([
          // The only non-array argument is also possible
          'data-typo',
        ]),
      ]),
    )
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(dist.html.page_1));
}

/**
 * Шаблонизация и склейка HTML страницы услуг
 * @returns {*}
 */
function htmlProcess_page_2() {
  return gulp
    .src(src.html.page_2 + '**/index.html')
    .pipe(
      posthtml([
        include({ encoding: 'utf8' }),
        expressions(),
        richtypo({
          attribute: 'data-typo',
          rules: [quotes, sectionSigns, shortWords],
        }),
        removeAttributes([
          // The only non-array argument is also possible
          'data-typo',
        ]),
      ]),
    )
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(dist.html.page_2));
}

/**
 * Копирование картинок в dist или оптимизация при финишной сборке (GLOBAL)
 * @returns {*}
 */
function imgProcess_global() {
  return gulp
    .src(src.img.global + '**/*')
    .pipe(changed(dist.img.global))
    .pipe(gulp.dest(dist.img.global));
}
/**
 * Копирование картинок в dist или оптимизация при финишной сборке (Главная страница)
 * @returns {*}
 */
function imgProcess_main() {
  return gulp
    .src(src.img.main + '**/*')
    .pipe(changed(dist.img.main))
    .pipe(gulp.dest(dist.img.main));
}
/**
 * Копирование картинок в dist или оптимизация при финишной сборке (Страница кейсов)
 * @returns {*}
 */
function imgProcess_page_1() {
  return gulp
    .src(src.img.page_1 + '**/*')
    .pipe(changed(dist.img.page_1))
    .pipe(gulp.dest(dist.img.page_1));
}
/**
 * Копирование картинок в dist или оптимизация при финишной сборке (Страница услуг)
 * @returns {*}
 */
function imgProcess_page_2() {
  return gulp
    .src(src.img.page_2 + '**/*')
    .pipe(changed(dist.img.page_2))
    .pipe(gulp.dest(dist.img.page_2));
}

/**
 * Склейка и обработка scss файлов (Либы)
 * @returns {*}
 */
function scssProcess_libs() {
  return gulp
    .src(paths.src + 'sass/libs/**/*')
    .pipe(changed(paths.dist + 'css/libs/'))
    .pipe(gulp.dest(paths.dist + 'css/libs/'));
}
/**
 * Склейка и обработка scss файлов (Главная страница)
 * @returns {*}
 */
function scssProcess_main() {
  const plugins = [autoprefixer({ grid: true }), cssnano()];

  return gulp
    .src([src.scss.main + 'index.scss'])
    .pipe(sass())
    .pipe(postcss(plugins))
    .pipe(prettier())
    .pipe(cleanCSS())
    .pipe(gulp.dest(dist.css.main));
}
/**
 * Склейка и обработка scss файлов (Страница кейсов)
 * @returns {*}
 */
function scssProcess_page_1() {
  const plugins = [autoprefixer({ grid: true }), cssnano()];

  return gulp
    .src(src.scss.page_1 + '**/index.scss')
    .pipe(sass())
    .pipe(postcss(plugins))
    .pipe(prettier())
    .pipe(cleanCSS())
    .pipe(gulp.dest(dist.css.page_1));
}
/**
 * Склейка и обработка scss файлов (Страница услуг)
 * @returns {*}
 */
function scssProcess_page_2() {
  const plugins = [autoprefixer({ grid: true }), cssnano()];

  return gulp
    .src(src.scss.page_2 + '**/index.scss')
    .pipe(sass())
    .pipe(postcss(plugins))
    .pipe(prettier())
    .pipe(cleanCSS())
    .pipe(gulp.dest(dist.css.page_2));
}

/**
 * Работа с пользовательским js (Либы)
 * @returns {*}
 */
function jsProcess_libs() {
  return gulp
    .src(paths.src + 'js/libs/*')
    .pipe(changed(paths.dist + 'js/libs/'))
    .pipe(gulp.dest(paths.dist + 'js/libs/'));
}
/**
 * Работа с пользовательским js (Главная страница)
 * @returns {*}
 */
function jsProcess_main() {
  return gulp
    .src(src.js.main + '**/app.js')
    .pipe(
      filejsInclude({
        extensions: 'js',
        hardFail: true,
        separateInputs: true,
        includePaths: [__dirname + '/bower_components', __dirname + '/src/js'],
      }),
    )
    .pipe(prettier({ singleQuote: true }))
    .pipe(minify())
    .pipe(gulp.dest(dist.js.main));
}

/**
 * Работа с пользовательским js (Страница кейсов)
 * @returns {*}
 */
function jsProcess_page_1() {
  return gulp
    .src(src.js.page_1 + '**/app.js')
    .pipe(
      filejsInclude({
        extensions: 'js',
        hardFail: true,
        separateInputs: true,
        includePaths: [__dirname + '/bower_components', __dirname + '/src/js'],
      }),
    )
    .pipe(prettier({ singleQuote: true }))
    .pipe(minify())
    .pipe(gulp.dest(dist.js.page_1));
}

/**
 * Работа с пользовательским js (Страница услуг)
 * @returns {*}
 */

function jsProcess_page_2() {
  return gulp
    .src(src.js.page_2 + '**/app.js')
    .pipe(
      filejsInclude({
        extensions: 'js',
        hardFail: true,
        separateInputs: true,
        includePaths: [__dirname + '/bower_components', __dirname + '/src/js'],
      }),
    )
    .pipe(prettier({ singleQuote: true }))
    .pipe(minify())
    .pipe(gulp.dest(dist.js.page_2));
}

// Inline sources (Главная страница)
function inlineSource() {
  if (arg.production === 'true') {
    return gulp
      .src(paths.dist + '**/index.html')
      .pipe(
        inlinesource({
          compress: false,
        }),
      )
      .pipe(gulp.dest(paths.dist))
      .pipe(browserSync.stream());
  }
}

/**
 * Наблюдение за изменениями в файлах
 */
function watchFiles() {
  gulp.watch(
    paths.src + 'pages/**/*.*',
    gulp.series(
      htmlProcess_main,
      htmlProcess_page_1,
      htmlProcess_page_2,
      browserSyncReload,
    ),
  );

  gulp.watch(
    src.partials + '**/*.*',
    gulp.series(
      htmlProcess_main,
      htmlProcess_page_1,
      htmlProcess_page_2,
      browserSyncReload,
    ),
  );

  gulp.watch(
    paths.src + 'sass/' + '**/*.*',
    gulp.series(
      scssProcess_main,
      scssProcess_page_1,
      scssProcess_page_2,
      scssProcess_libs,
      browserSyncReload,
    ),
  );

  gulp.watch(
    paths.src + 'js/' + '**/*.*',
    gulp.series(
      jsProcess_main,
      jsProcess_page_1,
      jsProcess_page_2,
      jsProcess_libs,
      browserSyncReload,
    ),
  );

  gulp.watch(
    paths.src + 'img/' + '**/*.*',
    gulp.series(
      imgProcess_global,
      imgProcess_main,
      imgProcess_main,
      imgProcess_page_1,
      imgProcess_page_2,
      browserSyncReload,
    ),
  );

  gulp.watch(src.fonts, gulp.series(copyFonts, browserSyncReload));
}

const build = gulp.series(
  clean,
  gulp.parallel(
    htmlProcess_main,
    htmlProcess_page_1,
    htmlProcess_page_2,

    jsProcess_main,
    jsProcess_page_1,
    jsProcess_page_2,
    jsProcess_libs,

    scssProcess_main,
    scssProcess_page_1,
    scssProcess_page_2,
    scssProcess_libs,

    imgProcess_global,
    imgProcess_main,
    imgProcess_page_1,
    imgProcess_page_2,

    copyFonts,
  ),

  inlineSource,

  cleanJsAndCss,
);

const watch = gulp.parallel(build, watchFiles, browserSyncInit);

exports.build = build;
exports.default = watch;
