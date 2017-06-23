const fs = require('fs')
const parser = require('parse5')
const Reporter = require('../util/Reporter.js')
const stylefmt = require('./lib/stylefmt.js')
const esfmt = require('./lib/esfmt.js')
const parseVueTemplate = require('./lib/parseVueTemplate.js')
const getLineOffset = function (needle, haystack) { // 获取行号
  const targetPosition = haystack.indexOf(needle)
  const untilTargetPosition = haystack.substring(0, targetPosition)
  return untilTargetPosition.split(/\r?\n/).length - 1
}

module.exports = function (filePath) {
  return new Promise((resolve, reject) => {
    let fileContent // 文件内容
    let lintError // 错误报告
    let fragment // dom
    let childNodes // dom子节点组
    let processQueue // 处理队列
    setTimeout(() => {
      lintError = {
        filePath: filePath,
        messages: []
      }
      fileContent = fs.readFileSync(filePath, 'utf-8')
      fragment = parser.parseFragment(fileContent)
      childNodes = fragment.childNodes
      processQueue = parseVueTemplate(childNodes)

      Promise.all([new Promise((resolve) => {
          // 处理es
        if (processQueue.script) {
          let scriptString = parser.serialize(processQueue.script)
          let report = esfmt(scriptString)
            // 收集错误消息
          Reporter.collectES({
            report: report,
            lineOffset: getLineOffset(scriptString, fileContent),
            lintError
          })
            // 将lint后的值写入dom
          processQueue.script.childNodes[0].value = report.results[0].output || scriptString
        }
        resolve(true)
      }), new Promise((resolve) => {
        // 处理style
        if (processQueue.style && processQueue.style.childNodes.length) {
          let styleString = parser.serialize(processQueue.style)

          stylefmt(styleString).then((report) => {
            // 收集错误消息
            Reporter.collectStyle({
              report: report,
              lineOffset: getLineOffset(styleString, fileContent) + 1,
              lintError
            })
            processQueue.style.childNodes[0].value = ((report.css.indexOf('\n') === 0) ? '' : '\n') + report.css
            resolve(true)
          })
        } else {
          resolve(true)
        }
      })]).then(() => {
        // 写入格式化的内容
        fs.writeFileSync(filePath, parser.serialize(fragment))
        console.log(`${filePath} has formated`)
        // 上报错误
        resolve(lintError)
      })
    })
  })
}
