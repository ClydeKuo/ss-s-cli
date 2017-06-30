//将download 包装成promise
const download = require('download-git-repo')
module.exports =function(...args){
  return new Promise(function(resolve, reject) {
    args.push(function (err) {
      if(err){
        reject(err)
      }else{
        resolve()
      }
    })
    download(...args)
  })
}
