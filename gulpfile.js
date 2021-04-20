// ------------gulp4.0 之前的写法
// const gulp = require('gulp')

// gulp.task('sayHi', cb => {
//   console.log('hello gulp')
//   cb()
// })

// ------------gulp4.0 之后的写法
// const sayHi = cb => {
//   console.log('hello gulp')
//   cb()
// }

// module.exports = {
//   sayHi
// }

// ------------series()：串行任务组合
// const { series } = require('gulp')

// const task1 = cb => {
//   console.log('task-1')
//   cb()
// }
// const task2 = cb => {
//   console.log('task-2')
//   cb()
// }
// const task3 = cb => {
//   console.log('task-3')
//   cb()
// }

// const seriesTask = series(task1, task2, task3)

// module.exports = {
//   seriesTask
// }

// ------------parallel()：并行任务组合
// const { parallel } = require('gulp')

// const task1 = cb => {
//   console.log('task-1')
//   cb()
// }
// const task2 = cb => {
//   console.log('task-2')
//   cb()
// }
// const task3 = cb => {
//   console.log('task-3')
//   cb()
// }

// const parallelTask = parallel(task1, task2, task3)

// module.exports = {
//   parallelTask
// }

// ------------series() 和 parallel() 结合
// const { series, parallel } = require('gulp')

// const task1 = cb => {
//   console.log('task-1')
//   cb()
// }
// const task2 = cb => {
//   console.log('task-2')
//   cb()
// }
// const task3 = cb => {
//   console.log('task-3')
//   cb()
// }
// const task4 = cb => {
//   console.log('task-3')
//   cb()
// }

// const seriesTask = series(task1, task2)
// const parallelTask = parallel(task3, task4)

// const composeTask = series(seriesTask, parallelTask)

// module.exports = {
//   composeTask
// }

// ------------文件流读写
// const { src, dest } = require('gulp')

// const fileStream = () => {
//   return src('./src/index.js')
//     .pipe(dest('./dist'))
// }

// module.exports = {
//   fileStream
// }

// ------------文件监听 watch
// const { src, dest, watch } = require('gulp')

// const fileStream = () => {
//   return src('./src/index.js')
//     .pipe(dest('./dist'))
// }

// watch('./src/**/*.js', fileStream)

// module.exports = {
//   fileStream
// }

// 使用 gulp-babel 转换成浏览器兼容代码，使用 terser 压缩代码
// const { src, dest } = require('gulp')
// const gulpBabel = require('gulp-babel')
// const gulpTerser = require('gulp-terser')

// const jsTask = () => {
//   return src('./src/**/*.js')
//     .pipe(gulpBabel({ presets: ['@babel/preset-env'] }))
//     .pipe(gulpTerser())
//     .pipe(dest('./dist'))
// }

// module.exports = {
//   jsTask
// }


//----------------------- 案例
const { src, dest, series, parallel, watch } = require('gulp')
const gulpHtmlmin = require('gulp-htmlmin')
const gulpBabel = require('gulp-babel')
const gulpTerser = require('gulp-terser')
const gulpLess = require('gulp-less')
const gulpPostcss = require('gulp-postcss')
const postcssPresetEnv = require('postcss-preset-env')
const gulpMinifyCss = require('gulp-minify-css')
const gulpImagemin = require('gulp-imagemin')
const gulpInject = require('gulp-inject')
const browserSync = require('browser-sync')

const del = require('del')

// 处理 html 任务
// src 中传入参数 { base: './src' } 代表以 src 为基础目录
// 在输出的时候，会按照 src 下面的目录结构输出到指定的输出目录
// 比如，src/utils/tool.js，在指定输出的时候，只需要制定 dest('./dist')
// 最后会输出到 dist/utils/tools，跟 src 下的目录结构一一对应
const htmlTask = () => {
  return src('./src/**/*.html', { base: './src' })
    .pipe(gulpHtmlmin({ collapseWhitespace: true }))
    .pipe(dest('./dist'))
}

// 处理 js 任务
const jsTask = () => {
  return src('./src/**/*.js', { base: './src' })
    .pipe(gulpBabel({ presets: ['@babel/preset-env'] }))
    .pipe(gulpTerser())
    .pipe(dest('./dist'))
}

// 处理 less 任务
const lessTask = () => {
  return src('./src/style/*.less', { base: './src' })
    .pipe(gulpLess())
    .pipe(gulpPostcss([postcssPresetEnv({ browsers: ['last 2 version'] })]))
    .pipe(gulpMinifyCss())
    .pipe(dest('./dist'))
}

// 处理图片任务
// const imgTask = () => {
//   return src('./src/assets/**', { base: './src' })
//     .pipe(gulpImagemin())
//     .pipe(dest('./dist'))
// }

// 将资源注入到 html，在 html 文件中需要写入魔法注释，让其知道注入到 html 哪里
// 此时需要读取 dist 目录下的
const injectTask = () => {
  return src('./dist/*.html')
    // { relative: true } 代表使用相对路径
    .pipe(gulpInject(src(['./dist/**/*.{js,css}']), { relative: true }))
    .pipe(dest('./dist'))
}

// 删除文件夹
const cleanTask = () => {
  return del(['dist'])
}

// 搭建本地服务
const bs = browserSync.create()
const serveTask = () => {
  // 文件发生变化，重新打包
  watch('./src/*.html', series(htmlTask, injectTask))
  watch('./src/*.js', series(jsTask, injectTask))
  watch('./src/style/*.less', series(lessTask, injectTask))

  bs.init({
    port: 9000, // 监听端口
    open: true, // 自动打开浏览器
    files: './dist/*', // 监听哪些文件
    server: {
      baseDir: './dist'
    }
  })
}

// 生产环境打包
const buildTask = series(cleanTask, parallel(htmlTask, jsTask, lessTask), injectTask)

// 开发环境打包
const devTask = series(buildTask, serveTask)

module.exports = {
  devTask,
  buildTask
}
