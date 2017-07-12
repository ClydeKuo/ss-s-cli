const inquirer = require('inquirer');
const path=require('path')
const fs= require("fs")
const ora = require('ora')
const cmd = require('./util/cmd.js')
const download = require('./util/download.js')
const ui = new inquirer.ui.BottomBar();
const program = require('commander')

program
    .arguments('[name]')
    .action(val => {
      name = val
    })
    .parse(process.argv)


var answers={
  name:"ww",
  names:["module1","module2"]
}
function generate(answers){
// package.json
fs.writeFileSync(`${process.cwd()}/${answers.name}/package.json`, `
{
    "name": "${answers.name}",
    "description": "主系统框架",
    "version": "1.0.0",
    "scripts": {
        "dev": "ss update && ss build dev",
        "test": "ss update && ss build test",
        "uat": "ss update && ss build uat",
        "pd": "ss update && ss build pd",
        "precommit": "ss lint --commit"
    },
    "dependencies": {
    },
    "devDependencies": {
        "ss-s-devdep": "^1.0.0",
        "ss-s.dll": "^1.0.1"
    }
}
`)


// server.config.json
var Str=''
for (var i = 0,len=answers.names.length; i <len; i++) {
  Str +=`"module_${answers.names[i]}":true`;
  if(i<len-1){
    Str+=`,
  `
  }
}
var compileConfig=`{
    "host": "localhost:10240",
    "hostname": "localhost",
    "port": "10240",
    "server": {
      "core":true,
      "module_base":true,
      ${Str}
    }
}`
fs.writeFileSync(`${process.cwd()}/${answers.name}/build/server.config.json`, compileConfig)

// ss-s.base

var Str2=''
answers.names.forEach((item)=>{
  Str2+=`
  <Menu-item name="${item}">
      <icon type="ios-navigate"></icon>
      <span>${item}</span>
  </Menu-item>`
})
fs.writeFileSync(`${process.cwd()}/${answers.name}/packages/ss-s.base/src/view/main/main.vue`, `
<template>
    <div class="layout">
        <Menu mode="horizontal" theme="dark" active-name="${answers.names[0]}" @on-select="toRoute">
            <div class="layout-logo"></div>
            <div class="layout-nav">
                ${Str2}
            </div>
        </Menu>
        <div class="layout-content">
            <router-view></router-view>
        </div>
        <div class="layout-copy">
            2011-2016 © TalkingData
        </div>
    </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  methods: {
      toRoute(routeName){
          this.$router.push({ name: routeName})
      },
  }
}
</script>
<style src="./main.scss"></style>
`)


// 子模块
answers.names.forEach((item)=>{
  generateSub(item,answers)
})
}


function generateSub(item,answers){
fs.writeFileSync(`${process.cwd()}/${answers.name}/packages/${item}/src/main/index.vue`, `
<template>
<div class="panel home-panel">
    {{name}}
</div>
</template>

<script>
export default {
  computed:{
    name(){
      return this.$store.state.${item}.name
    }
  },
  created(){
  }
}
</script>
<style>
</style>
`)

fs.writeFileSync(`${process.cwd()}/${answers.name}/packages/${item}/src/routerConfig.js`, `
export default {
  init () {
    return {
      route:[{
          path: '${item}',
          component: r => require.ensure([], () => r(require('./index.vue')), '${item}'),
          children: [{
            path: '',
            title: '${item}',
            name: '${item}',
            component: r => require.ensure([], () => r(require('./main/index.vue')), '${item}')
          }]
        }]
    }
  }
}
`)

fs.writeFileSync(`${process.cwd()}/${answers.name}/packages/${item}/store/index.js`, `
export default{
  init(store){
    store.registerModule('${item}', { //模块动态注册
     namespaced: true,
     state: {
       name:'${item}'
     },
     mutations: {},
     actions: {},
   })
  }
}
`)
}
// generate()

//单步问题
inquirer.prompt([{
  type: 'input',
  default:name,
  message: 'Project name',
  name: 'name',
  validate:(name)=>{
    var temp=path.resolve(process.cwd(),name)
    return new Promise(function(resolve, reject) {
    // ui.log.write('\nvalidating name: ' + name + '\n');
    fs.exists(temp,(val)=>{
        if(val){
          resolve(`${name} already existed,please provide another project name`)
        }
        resolve(true)
      })
    })
  }
},{
  type: 'input',
  default:'module1,module2',
  message: 'Subsystem names(separate by comma)',
  name: 'names'
}]).then((answers)=>{
  downloader(answers)
});


function downloader(answers){
  var spinner = ora('downloading template')
  // cmd.exec(`mkdir ${answers.name}`)
  answers.names=answers.names.split(',')
  let promiseArr=[]
  promiseArr.push(download('ClydeKuo/template.main', path.resolve(process.cwd(),answers.name),{ clone: false }))
  promiseArr.push(download('ClydeKuo/ss-s.core', path.resolve(process.cwd(),answers.name,'packages','ss-s.core'),{ clone: false }))
  promiseArr.push(download('ClydeKuo/template.base', path.resolve(process.cwd(),answers.name,'packages','ss-s.base'),{ clone: false }))
  answers.names.forEach((item)=>{
    promiseArr.push(download('ClydeKuo/template.submodule', path.resolve(process.cwd(),answers.name,'packages',item),{ clone: false }))
  })
  spinner.start()
  Promise.all(promiseArr).then(()=>{
    spinner.stop()
    generate(answers)
    console.log(6666)
  },(err)=>{
    console.log("err:"+err)
  })
}
