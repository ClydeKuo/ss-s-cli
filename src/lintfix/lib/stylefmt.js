const postcss = require('postcss')
const scss = require('postcss-scss') // when you use scss syntax
const stylefmt = require('stylefmt')
const stylelint = require('stylelint')
let stylelintrc = require('./stylelintrc.js')

module.exports = function (input) {
  return new Promise((resolve, reject) => {
    postcss([
      stylefmt({
        configBasedir: __dirname,
        config: stylelintrc
      })
    ]).process(input, {
      syntax: scss
    }).then((result) => {
      stylelint.lint({
        code: result.css,
        configBasedir: __dirname,
        config: stylelintrc,
        syntax: 'scss'
      }).then((output) => {
        output.css = result.css
        resolve(output)
      })
    })
  })
}
