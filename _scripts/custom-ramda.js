const {execSync} = require('child_process');
const fs = require('fs');
const {JSDOM} = require('jsdom');
const yaml = require('js-yaml');
const argv = require('minimist')(process.argv.slice(2), {
  boolean: [
    'insert',
  ],
  default: {
    'insert': false,
  },
});
const jekyllConfig = yaml.safeLoad(fs.readFileSync('./_config.yml'))
if (argv.insert) {
  if (fs.existsSync('_site/custom-ramda.js')) {
    argv._.forEach((file) => {
      const html = fs.readFileSync(file);
      const dom = (new JSDOM(html))
      const document = dom.window.document;
      const ramdaInclude = document.querySelector('script[src*=ramda]')
      if (ramdaInclude !== null) {
        ramdaInclude.src = jekyllConfig.url + jekyllConfig.baseurl + '/custom-ramda.js'
        fs.writeFileSync(file, dom.serialize());
      }
    });
  }
} else {
  const flatten = (list, d) => {
    d = d || Infinity;
    return d > 0 ? list.reduce(function (acc, val) {return acc.concat(Array.isArray(val) ? flatten(val, d - 1) : val)}, []) : list.slice();
  }
  const ramdaMatcher = new RegExp('R\\.([a-zA-Z]+)', 'gm')
  const methods = Array.from(new Set(flatten(argv._.map(file => fs.readFileSync(file).toString().match(ramdaMatcher)), 1)))
  if (methods.length > 0) {
    console.log(execSync(`npx @oncomouse/custom-ramda ${methods.map(x => x.replace(/R./, '')).join(' ')}`).toString())
  }
}

