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

function generate(){
  fs.readFile(path.resolve(process.cwd(),'o','package.json') , {flag: 'r+', encoding: 'utf8'}, function (err, data) {
      if(err) {
       console.error("err:"+err);
       return;
      }
      console.log('success:'+data);
  });
}
generate()
console.log(111)

//单步问题
// inquirer.prompt([{
//   type: 'input',
//   default:name,
//   message: 'Project name',
//   name: 'name',
//   validate:(name)=>{
//     var temp=path.resolve(process.cwd(),name)
//     return new Promise(function(resolve, reject) {
//     ui.log.write('\nvalidating name: ' + name + '\n');
//     fs.exists(temp,(val)=>{
//         if(val){
//           resolve(`${name} already existed,please provide another project name`)
//         }
//         resolve(true)
//       })
//     })
//   }
// },{
//   type: 'input',
//   default:'module1,module2',
//   message: 'Subsystem names(separate by comma)',
//   name: 'names'
// }]).then((answers)=>{
//   downloader(answers)
// });
//
//
// function downloader(answers){
//   var spinner = ora('downloading template')
//   // cmd.exec(`mkdir ${answers.name}`)
//
//   let promiseArr=[]
//   promiseArr.push(download('ClydeKuo/template.main', path.resolve(process.cwd(),answers.name),{ clone: false }))
//   promiseArr.push(download('ClydeKuo/ss-s.core', path.resolve(process.cwd(),answers.name,'packages','ss-s.core'),{ clone: false }))
//   promiseArr.push(download('ClydeKuo/ss-s.base', path.resolve(process.cwd(),answers.name,'packages','ss-s.base'),{ clone: false }))
//   answers.names.split(',').forEach((item)=>{
//     promiseArr.push(download('ClydeKuo/template.submodule', path.resolve(process.cwd(),answers.name,'packages',item),{ clone: false }))
//   })
//   spinner.start()
//   Promise.all(promiseArr).then(()=>{
//     spinner.stop()
//     console.log(6666)
//   },(err)=>{
//     console.log("err:"+err)
//   })
// }
