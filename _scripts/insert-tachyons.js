const fs = require('fs');
const {JSDOM} = require('jsdom');
const yaml = require('js-yaml');
const argv = require('minimist')(process.argv.slice(2), {
});
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
