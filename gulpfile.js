var gulp = require('gulp'),

    copy = require('gulp-copy'),
    rename = require('gulp-rename'),

    uglify = require('gulp-uglify'),

    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),

    util = require('gulp-util'),
    notify = require('gulp-notify');

//【内部调用函数】控制台错误处理
function handleErrors () {
    var args = Array.prototype.slice.call(arguments);

    notify.onError({
        title : 'compile error',
        message : '<%=error.message %>'
    }).apply(this, args);//替换为当前对象

    this.emit();//提交
}

gulp.task('js', function () {
    var stream = gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.basename += ".min";
        }))
        .pipe(gulp.dest('dist/js'));

    return stream;
});

gulp.task('css', function () {
    var stream = gulp.src(['src/less/*.less'])
        .pipe(less())
        .on("error", handleErrors)
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .on('error', handleErrors)
        .pipe(minifycss({
            compatibility: 'ie7'//类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
        }))
        .pipe(rename(function (path) {
            path.basename += ".min";
        }))
        .pipe(gulp.dest('dist/css'));

    return stream;
});

gulp.task('copy', function () {
    var stream = gulp.src(['src/img/*', 'src/js/*', '!src/js/*.js'])
        .pipe(copy('dist', {
            prefix : 1
        }));

    return stream;
});

/*
 * 任务：dist 构建
 * */
gulp.task('dist', function () {
    gulp.start('js', 'css', 'copy');
});

gulp.task('watch:js', function () {
    gulp.watch(['src/js/*.js'], function(event){
        console.log('File ' + event.path + ' was ' + event.type + ', running js tasks...');
        gulp.start('js');
    });
});

gulp.task('watch:css', function () {
    gulp.watch('src/less/*.less', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running css tasks...');
        gulp.start('css');
    });
});

gulp.task('watch', function () {
    gulp.start('watch:js', 'watch:css');
});

/*
 * 任务：自定义任务
 * 描述：可根据自己需要自定义常用任务
 * */
gulp.task('default', function () {
    gulp.start('dist');
});


