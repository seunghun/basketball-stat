var gulp = require('gulp'),
	sass = require('gulp-sass'), 
	browserSync = require('browser-sync').create(), 
	concat = require('gulp-concat'), 
	uglify = require('gulp-uglify'), 
	jshint = require('gulp-jshint'); 

var cssmin = require('gulp-cssmin'), 
    autoprefixer = require('gulp-autoprefixer'), // -webkit- 등 벤터 접두사 삽입
    csscomb = require('gulp-csscomb'); // css코드를 아름답게

var sourcemaps = require('gulp-sourcemaps'), // 소스맵 (chrome setting 소스맵 설정)
    rename = require('gulp-rename'), // 이름변경
    plumber = require('gulp-plumber'); // error 발생시 프로세스 종료 방지

var include = require('gulp-html-tag-include');


// var spritesmith = require('gulp-spritesmith'), // 이미지 스프라이드
//     imagemin = require('gulp-imagemin'); // 이미지 압축

var src = 'public/src';
var demo = 'public/demo';
var dist = 'public/dist';

var asset = "public/dist/asset";
//var distCssFileName = "common.css";

function errorHandler(err) {
    console.log(err);
    this.emit('end');
}

var paths = {
    script : src + '/script/**/*',
    style : src + '/style/**/*',
    image : src + '/image/',
    sprite : src + '/image/sprite/'
};

// sass task
gulp.task('sass', function(){
	return gulp.src(src + '/style/scss/**/*.scss')
        .pipe(plumber({ errorHandler: errorHandler }))
        .pipe(sourcemaps.init({loadMaps: true}))
		.pipe(sass())
        .pipe(sourcemaps.write('./maps', {sourceRoot : src + '/style/scss/**/*.scss'}))
        .pipe(gulp.dest(demo + '/css'))
		.pipe(browserSync.reload({
			stream:true
		}))
});


gulp.task('style', function() {
    return gulp.src(demo + '/css/**/*')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(csscomb())
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
             .pipe(sourcemaps.write('./maps', {sourceRoot : src + '/style/scss/**/*.scss'}))
        .pipe(gulp.dest(asset + '/css'));
});

// js task
gulp.task('lint', function() {
    return gulp.src(paths.script)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
});

// working task
gulp.task('browserSync', function(){
	browserSync.init({
		server:{
			baseDir: demo 
		}
	})

});
// include file for html
gulp.task('html-include', function(){
    return gulp.src(src + '/html/**/*.html')
    .pipe(include())
    .pipe(gulp.dest(demo + '/html/'))
    .pipe(browserSync.reload({
            stream:true
        }))
});


gulp.task('watch',['html-include', 'browserSync','sass'], function(){
    gulp.watch(src + '/html/**/*.html',['html-include']);
	gulp.watch(src +'/style/scss/**/*.scss', ['sass']);
	gulp.watch(demo + '/js/*.js', browserSync.reload);
	gulp.watch(src +'/html/*.html', ['sass']);
   
});


// bundle task
gulp.task('build',['sass','style'], function(){

});


