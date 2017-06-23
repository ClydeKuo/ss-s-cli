const fs = require('fs')
const stylefmt = require('./lib/stylefmt.js')
const Reporter = require('../util/Reporter.js')

module.exports = function (filePath) {
  return new Promise((resolve) => {
    let fileContent // 文件内容
    let lintError // 错误报告
    setTimeout(() => {
      lintError = {
        filePath: filePath,
        messages: []
      }
      fileContent = fs.readFileSync(filePath, 'utf-8')
      stylefmt(fileContent).then((report) => {
        // 收集错误消息
        Reporter.collectStyle({
          report: report,
          lineOffset: 0,
          lintError
        })
        // 写入格式化的内容
        fs.writeFileSync(filePath, report.css)
        console.log(`${filePath} has formated`)
        // 上报错误
        resolve(lintError)
      })
    })
  })
}
