const postcss = require('postcss')
const {execSync} = require('child_process')
const fs = require('fs')
const files = process.argv.slice(2)
// Read CSS files as text:
require.extensions['.css'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8')
}
const tachyonsCSS = require('tachyons-custom/css/tachyons.css')
const tachyonsAST = postcss.parse(tachyonsCSS)
// Extract a list of all classes in Tachyons:
const tachyonsAllClasses = []
tachyonsAST.walkRules(/^\./, (rule) => {
  const outRule = rule.selector.replace(/\s+$/, '').replace(/^\./, '')
  if (tachyonsAllClasses.indexOf(outRule) === -1) {
    tachyonsAllClasses.push(outRule)
  }
})
const tachyonsRegex = new RegExp(`["' ](${tachyonsAllClasses.join('|')})["' ]`, 'gm')
const tachyonsClasses = Array.from(files.reduce((classes, file) => {
  const fileSrc = fs.readFileSync(file).toString()
  const matches = fileSrc.match(tachyonsRegex)
  if (matches !== null) {
    matches.forEach(match => classes.add(match.replace(/['" ]/g, '')))
  }
  return classes
}, new Set()))
execSync(`npx --no-install @oncomouse/extract-tachyons \`find _site -name "*.html"\` --always "${tachyonsClasses.join(',')}" --compress --output _site/custom-tachyons.css`)
