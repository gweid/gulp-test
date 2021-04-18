# 认识 Gulp



## gulp 是什么

官方文档的定义：一个工具包，可以帮助自动化和增强工作流

![](/imgs/img1.png)

也就是说，gulp 实际上也是一个自动化构建工具，用于增强工作流，进行各种各样的转换等一系列操作

例如官方图中的：`ts -->js、png-->webp、md -->html`



## gulp 与 webpack

 ### gulp

gulp 的核心理念是 task runner（任务执行器）

- 可以定义自己的一系列任务，等待任务被执行
- 基于文件 Stream 的构建流
- 可以使用 gulp 的插件体系来完成某些任务

### webpack

webpack 的核心理念是 module bundler（模块打包）

- webpack 是一个模块化的打包工具
- 可以使用各种各样的 loader 来加载不同的模块
- 可以使用各种各样的 plugin 在打包的生命周期完成其他的任务

### gulp 相对于 webpack 的优缺点

- gulp 是一个工具包，可以进行js，html，css，img 的压缩打包，可以将多个 js 文件或是 css 压缩成一个文件， 并且可以压缩为一行，以此来减少文件体积，加快请求速度和减少请求次数。它更适合编写一些自动化的任务，定义一系列的任务，让它逐一执行
- 但是 gulp 默认是不支持模块化的，目前对于大型项目（Vue、React、Angular）一般不会使用 gulp 来构建



## gulp 基本使用

### 安装 gulp

首先要使用 gulp，先安装

```js
npm init -y

npm i gulp -D
```



### 创建一个 gulp 任务

在根目录创建一个 `gulpfile.js` 文件，然后在里面创建 gulp 任务

**在 gulp4.0 之前，编写 gulp 任务的方式：**

```js
const gulp = require('gulp')

gulp.task('sayHi', cb => {
  console.log('hello gulp')
  cb()
})
```

**在 gulp4.0 之后，编写 gulp 任务的方式：**

```js
const sayHi = cb => {
  console.log('hello gulp')
  cb()
}

module.exports = {
  sayHi
}
```

然后通过 `npx gulp sayHi` 就可以执行，输出结果：

![](/imgs/img2.png)



每个 gulp 任务都是一个异步的 JavaScrip t函数

- 此函数可以接受一个 callback 作为参数，调用 callback 函数那么任务会结束
- 或者是一个返回 stream（常用）、promise、event emitter、child process 或 observable 类型的函数
- 如果既没有调用 callback ，也没有返回规定类型函数，那么会报错

gulp 任务类型：

- 公开任务：从 gulpfile 文件中**被导出**（export），可以通过 gulp 命令直接调用
- 私有任务：被设计为在内部使用，**没有被导出**，通常作为 series() 或 parallel() 组合的组成部分



### 任务组合 series() 和 parallel() 

gulp 有两种任务组合方式：

- series()：串行任务组合（同步，任务按照顺序执行，一个执行完以后再执行下一个）

  ```js
  const { series } = require('gulp')
  
  const task1 = cb => {
    console.log('task-1')
    cb()
  }
  const task2 = cb => {
    console.log('task-2')
    cb()
  }
  const task3 = cb => {
    console.log('task-3')
    cb()
  }
  
  const seriesTask = series(task1, task2, task3)
  
  module.exports = {
    seriesTask
  }
  ```

  然后 `npx gulpseriesTask ` 得到结果，是顺序的 `task1 --> task2 --> task3`:

  ![](/imgs/img3.png)

- parallel()：并行任务组合（多个任务同时执行）

  ```js
  const { parallel } = require('gulp')
  
  const task1 = cb => {
    console.log('task-1')
    cb()
  }
  const task2 = cb => {
    console.log('task-2')
    cb()
  }
  const task3 = cb => {
    console.log('task-3')
    cb()
  }
  
  const parallelTask = parallel(task1, task2, task3)
  
  module.exports = {
    parallelTask
  }
  ```

  执行 `npx gulp parallelTask ` 的结果，可以发现，三个任务同时开始执行：

  ![](/imgs/img4.png)

除了上面的执行方法，这两者还可以结合使用：

```js
const { series, parallel } = require('gulp')

const task1 = cb => {
  console.log('task-1')
  cb()
}
const task2 = cb => {
  console.log('task-2')
  cb()
}
const task3 = cb => {
  console.log('task-3')
  cb()
}
const task4 = cb => {
  console.log('task-3')
  cb()
}

const seriesTask = series(task1, task2)
const parallelTask = parallel(task3, task4)

const composeTask = series(seriesTask, parallelTask)

module.exports = {
  composeTask
}
```



