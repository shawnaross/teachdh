const fs = require('fs')
const postcss = require('postcss')
const {execSync} = require('child_process')
const {JSDOM} = require('jsdom')
const yaml = require('js-yaml')
const argv = require('minimist')(process.argv.slice(2), {
  boolean: [
    'insert',
  ],
  default: {
    'insert': false,
  },
});
if (!argv.insert) {
  // Read CSS files as text:
  require.extensions['.css'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8')
  }
  const tachyonsCSS = require('tachyons-custom/css/tachyons.css')
  const tachyonsAST = postcss.parse(tachyonsCSS)
  // Extract a list of all classes in Tachyons:
  const tachyonsAllClasses = []
  tachyonsAST.walkRules(/^\./, (rule) => {
    const outRule = rule.selector.replace(/\s+$/, '').replace(/^\./, '').replace(/:.*$/, '')
    if (tachyonsAllClasses.indexOf(outRule) === -1) {
      tachyonsAllClasses.push(outRule)
    }
  })
  const tachyonsRegex = new RegExp(`["' ](${tachyonsAllClasses.sort((a, b) => b.length - a.length).join('|')})`, 'gm')
  const tachyonsClasses = Array.from(argv._.reduce((classes, file) => {
    const fileSrc = fs.readFileSync(file).toString()
    const matches = fileSrc.match(tachyonsRegex)
    if (matches !== null) {
      matches.forEach(match => classes.add(match.replace(/['" ]/g, '')))
    }
    return classes
  }, new Set()))
  console.log(execSync(`npx --no-install @oncomouse/extract-tachyons \`find _site -name "*.html"\` --always "${tachyonsClasses.join(',')}" --compress`).toString())
} else {
  const jekyllConfig = yaml.safeLoad(fs.readFileSync('./_config.yml'))
  if (fs.existsSync('_site/custom-tachyons.css')) {
    argv._.forEach((file) => {
      const html = fs.readFileSync(file);
      const dom = (new JSDOM(html))
      const document = dom.window.document;
      const tachyonsInclude = document.querySelector('link[href*=tachyons]')
      if (tachyonsInclude !== null) {
        tachyonsInclude.href = jekyllConfig.url + jekyllConfig.baseurl + '/custom-tachyons.css'
        fs.writeFileSync(file, dom.serialize());
      }
    });
  }
}
