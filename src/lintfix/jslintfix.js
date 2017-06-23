const fs = require('fs')
const esfmt = require('./lib/esfmt.js')
const Reporter = require('../util/Reporter.js')

module.exports = function (filePath) {
  return new Promise((resolve, reject) => {
    let fileContent // 文件内容
    let report // 格式报告
    let lintError // 错误报告
    setTimeout(() => {
      lintError = {
        filePath: filePath,
        messages: []
      }
      fileContent = fs.readFileSync(filePath, 'utf-8')
      report = esfmt(fileContent)
      // 收集错误消息
      Reporter.collectES({
        report: report,
        lineOffset: 0,
        lintError
      })
      // 写入格式化的内容
      fs.writeFileSync(filePath, report.results[0].output || fileContent)
      console.log(`${filePath} has formated`)
      // 上报错误
      resolve(lintError)
    })
  })
}
