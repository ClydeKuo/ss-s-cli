# ss-s-cli
本项目是一个子系统分离项目的脚手架，子系统按需加载，当不需要开发改子系统时，将自动以编译后的安装包的形式引入系统，解决多个子项目开发时，开发人员之间的代码冲突，项目过于庞大导致编译时间过长，权限分配不明等问题

## help

```shelljs
Usage: ss [options] [command]


  Commands:

    install        安装依赖
    update         更新依赖
    start          启动服务 compile-pre => start
    build          构建 compile-pre -> compile -> compile-post
    compile-pre    编译前置钩子
    compile        编译处理钩子
    compile-post   编译后置钩子
    help [cmd]     display help for [cmd]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```
## 全局安装 ss-s-cli
```js
npm install ss-s-cli -g --registry=https://registry.npm.taobao.org
```
## 创建一个新项目
```shelljs
# 初始化项目
ss init my-project

# 设置子模块的名字(逗号分隔)
Subsystem names(separate by comma) (module1,module2) module1,module2

# 安装依赖，走你
cd my-project
ss install
ss start
```

## 按需启动项目
```shelljs
# 将每个子系统的git地址填在主项目的package.json文件的dependencies中
"dependencies": {
    "ss-s.base": "git+ssh://git@github.com/ClydeKuo/ss-s.base.git#master",
    "ss-s.core": "git+ssh://git@github.com/ClydeKuo/ss-s.core.git#master",
    "ss-s.hotel": "git+ssh://git@github.com/ClydeKuo/ss-s.hotel.git#master",
    "ss-s.ticket": "git+ssh://git@github.com/ClydeKuo/ss-s.ticket.git#master"
}

# 将开发完的项目打包，上传
ss build dev,pd

# 更新依赖
ss update

# 开启模块
打开my-project/build/server.config.json
按需开启所需的项目
重新启动项目
ss start

```
