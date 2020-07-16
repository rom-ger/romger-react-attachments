const gulp = require('gulp');
const gutil = require('gulp-util');
const concat = require('gulp-concat');
const tslint = require('gulp-tslint');
const eslint = require('gulp-eslint');
const lazyLoad = require('gulp-load-plugins')();
const cleanCSS = require('gulp-clean-css');
const path = require('path');
const sassGlob = require('gulp-sass-glob');
const del = require('del');
const babel = require('gulp-babel');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const ts = require('gulp-typescript');

let APPLICATION_DIST_PATH = './lib';

const externalCss = [
    './node_modules/sanitize.css/sanitize.css',
    './node_modules/@romger/react-flex-layout/lib/index.min.css',
    './node_modules/@romger/react-spinner/lib/index.css',
    './node_modules/react-toastify/dist/ReactToastify.css',
];

const buildWithBabel = () => {
    return gulp.src(['./source/**/*.js', './source/**/*.jsx'])
        .pipe(babel())
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(APPLICATION_DIST_PATH));
};

const buildWithBabelTS = () => {
    const options = {
        jsx: 'react',
        moduleResolution: 'node',
        target: 'esNext',
        experimentalDecorators: true,
    };
    return gulp.src(['./source/**/*.ts', './source/**/*.tsx'])
        .pipe(ts(options))
        .pipe(babel())
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(APPLICATION_DIST_PATH));
};

const errorHandler = title => {
    return err => {
        gutil.log(gutil.colors.red(`[${title}]`), err.toString());
        this.emit('end');
    };
};

const buildExternalStyles = (serve = false) => {
    let result = gulp.src(externalCss);
    if (!serve) {
        result = result.pipe(cleanCSS({
            compatibility: 'ie9',
            rebase: false,
        }));
    }
    result = result.pipe(concat('external.css'))
        .pipe(gulp.dest(APPLICATION_DIST_PATH));
    return result;
};

const buildStyles = (serve = false) => {
    let result = gulp.src('./source/styles/common.scss')
        .pipe(sassGlob())
        .pipe(lazyLoad.sourcemaps.init())
        .pipe(lazyLoad.sass({ style: 'expanded' }))
        .on('error', errorHandler('Sass'))
        .pipe(lazyLoad.autoprefixer())
        .on('error', errorHandler('Autoprefixer'));
    if (!serve) {
        result = result.pipe(cleanCSS({
            compatibility: 'ie9',
            rebase: false,
        }));
    }
    result = result.pipe(lazyLoad.sourcemaps.write())
        .pipe(concat('index.css'))
        .pipe(gulp.dest(`${APPLICATION_DIST_PATH}`));
    return result;
};

/** GULP TASKS */

gulp.task('clean', callback => del(APPLICATION_DIST_PATH, callback));

gulp.task('ts-lint', () => {
    return gulp
        .src(['./source/**/*.ts', './source/**/*.tsx', '!./source/**/*.spec.ts', '!./source/**/*.spec.tsx'])
        .pipe(
            tslint({
                program: require('tslint')
                    .Linter
                    .createProgram('./tsconfig.json'),
            }),
        )
        .pipe(
            tslint.report({
                summarizeFailureOutput: true,
            }),
        );
});

gulp.task('lint', () => {
    return gulp
        .src(['./source/**/*.js', './source/**/*.jsx'])
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('sass', () => {
    return buildStyles();
});

gulp.task('js', gulp.series(
    gulp.parallel('ts-lint', 'lint'),
    callback => {
        buildWithBabel();
        buildWithBabelTS();
        return callback();
    },
));

gulp.task('css-external', () => {
    return buildExternalStyles();
});

gulp.task('scss-external', () => {
    return gulp.src('./source/scss/**/*')
        .pipe(gulp.dest(`${APPLICATION_DIST_PATH}`));
});

gulp.task('assets-files', () => {
    return gulp.src('./source/assets/**/*')
        .pipe(gulp.dest(`${APPLICATION_DIST_PATH}/assets`));
});

gulp.task('d.ts', () => {
    return gulp.src('./source/*.d.ts')
        .pipe(gulp.dest(`${APPLICATION_DIST_PATH}`));
});

gulp.task('build',
    gulp.series('clean',
        gulp.parallel('assets-files', 'scss-external', 'css-external', 'sass', 'js', 'd.ts'),
        callback => {
            callback();
        },
    ),
);
