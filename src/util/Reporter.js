const table = require('text-table')
const chalk = require('chalk')

module.exports = {
  /*
   *收集ES错误消息
   */
  collectES ({
    report,
    lineOffset,
    lintError
  }) {
    if (report.errorCount || report.warningCount) {
      lintError.messages.push(table(report.results[0].messages.map((msg) => {
        return [
          '',
          `${msg.line + lineOffset}:${msg.column}`,
          (msg.severity === 2) ? chalk.red(msg.ruleId) : chalk.yellow(msg.ruleId),
          msg.message
        ]
      })) + '\n')
    }
  },
  /*
   *收集样式错误消息
   */
  collectStyle ({
    report,
    lineOffset,
    lintError
  }) {
    if (report.errored) {
      let messages = []
      JSON.parse(report.output)[0].warnings.map((msg) => {
        messages.push([
          '',
          `${msg.line + lineOffset}:${msg.column}`,
          (msg.severity === 'error') ? chalk.red(msg.rule) : chalk.yellow(msg.rule),
          msg.text
        ])
      })
      lintError.messages.push(table(messages))
    }
  },
  /*
   *打印报告
   */
  report (lintErrors) {
    let output = ''
    lintErrors.map((lintError) => {
      if (lintError && lintError.filePath && lintError.messages.length) {
        output += chalk.underline(lintError.filePath) + '\n'
        lintError.messages.map((message) => {
          output += message
        })
        output += '\n'
      }
    })
    if (output) {
      console.log(output)
      process.exit(1)
    }
  }
}
