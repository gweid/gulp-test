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
const { src, dest, watch } = require('gulp')

const fileStream = () => {
  return src('./src/index.js')
    .pipe(dest('./dist'))
}

watch('./src/**/*.js', fileStream)

module.exports = {
  fileStream
}