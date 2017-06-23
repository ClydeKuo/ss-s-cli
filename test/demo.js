/*var inquirer = require('inquirer');
inquirer.prompt([{
  type: 'confirm',
  message: 'Target directory exists. Continue?',
  name: 'ok'
},{
  type: 'confirm',
  message: 'Target directory exists. Continue?',
  name: 'ok2'
}]).then(function (answers) {
	console.log(answers)
});*/
var fs= require("fs")
var path=require('path')
var temp=path.resolve(process.cwd(),'ll')
fs.exists(temp,(val)=>{
  if(val){
    console.log(111)
  }else{
    console.log(222)
  }
})
console.log('aaaaa')
