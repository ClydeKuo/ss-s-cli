# ss-s-cli
格式化lint、打包等脚本集成

## install
```js
npm install ss-s-cli -g --registry=https://registry.npm.taobao.org
```

## help

```shelljs
Usage: ss [options] [command]


  Commands:

    install        安装依赖
    update         更新依赖
    lint           格式化&&eslint
    tag            tag处理
    start          启动服务 compile-pre => start
    build          构建 compile-pre -> compile -> compile-post
    pack           打包 update -> lint -> build -> tag -> push
    compile-pre    编译前置钩子
    compile        编译处理钩子
    compile-post   编译后置钩子
    help [cmd]     display help for [cmd]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```
