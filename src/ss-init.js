var inquirer = require('inquirer');
var path=require('path')
var fs= require("fs")
var ui = new inquirer.ui.BottomBar();
const program = require('commander')

program
    .arguments('[name]')
    .action(val => {
      name = val
    })
    .parse(process.argv)

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
}]).then((answers)=>{
	console.log(answers)
});
