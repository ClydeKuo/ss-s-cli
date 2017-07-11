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
var compileConfig=`
{
    "host": "localhost:10240",
    "hostname": "localhost",
    "port": "10240",
    "server": {
      "core":true,
      "module_base":true,
      ${Str}
    }
}
`
fs.writeFileSync(`${process.cwd()}/${answers.name}/build/server.config.json`, compileConfig)

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
  promiseArr.push(download('ClydeKuo/ss-s.base', path.resolve(process.cwd(),answers.name,'packages','ss-s.base'),{ clone: false }))
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
