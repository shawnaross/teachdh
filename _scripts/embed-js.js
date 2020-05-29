const fs = require('fs');
const path = require('path');
const {JSDOM} = require('jsdom');
const yaml = require('js-yaml');
const argv = {
  inline: process.argv.slice(2).indexOf('--inline') >= 0,
  _: process.argv.slice(2).filter(x => x !== '--inline'),
}
// Use with --inline to replace inclusions with their file source

const config = yaml.safeLoad(fs.readFileSync(__dirname + '/../_config.yml'));
config.baseurl = config.baseurl || '';
config.url = config.url || '';

const processInclude = (el, type, files) => {
  const src = el.getAttribute(type === 'css' ? 'href' : 'src');
  if (src.indexOf('cdnjs.cloudflare.com') >= 0) return;
  if (src.indexOf('unpkg.com') >= 0) return;
  if (src.indexOf('rawgit.com') >= 0) return;
  if (src.indexOf('jsdelivr.net') >= 0) return;
  if (!files.has(src)) {
    const fileName = path.join(...src.replace(`${config.url}${config.baseurl}/`, './_site/').split('/'));
    const fileSrc = fs.readFileSync(fileName).toString();
    files.addFile(src, fileSrc);
    fs.unlinkSync(fileName);
  }
  if (argv.inline) {
    // Write the file as an inline inclusion:
    el.outerHTML = (type === 'css' ? `<style>${files.getFile(src)}</style>` : `<script>${files.getFile(src)}</script>`);
  } else {
    // Remove the element from the document:
    el.parentNode.removeChild(el);
  }
}

const Files = function () {this.files = {};};
Files.prototype.addFile = function (src, fileSrc) {this.files[src] = fileSrc;};
Files.prototype.has = function (src) {return Object.prototype.hasOwnProperty.call(this.files, src);}
Files.prototype.getFile = function (src) {
  return this.files[src];
}
Files.prototype.getFiles = function (filter = undefined) {
  if (filter === undefined) return Object.values(this.files);
  return this.getNames(filter)
    .reduce((acc, cur) => ([
      ...acc,
      this.files[cur],
    ]), []);
}
Files.prototype.getNames = function (filter = undefined) {
  const keys = Object.keys(this.files);
  if (filter === undefined) return keys;
  return Object.keys(this.files)
    .filter(path => path.match(filter));
}

const files = new Files();
argv._.forEach((file) => {
  const html = fs.readFileSync(file);
  const dom = (new JSDOM(html))
  const document = dom.window.document;
  const seenCss = Array.from(document.querySelectorAll('link[href]')).reduce((seen, el) => {
    processInclude(el, 'css', files);
    return true;
  }, false);
  const seenJs = Array.from(document.querySelectorAll('script[src]')).reduce((seen, el) => {
    processInclude(el, 'js', files);
    return true;
  }, false);
  if (!argv.inline) {
    // If the site had CSS assets, we write the packed CSS file:
    if (seenCss) {
      const cssPath = `${config.url}${config.baseurl}/packed.css`;
      document.querySelector('head').insertAdjacentHTML('beforeend', `<link rel="stylesheet" href="${cssPath}" />`);
    }
    // If the site had JS assets, we write the packed JS file:
    if (seenJs) {
      const jsPath = `${config.url}${config.baseurl}/packed.js`;
      document.querySelector('body').insertAdjacentHTML('beforeend', `<script src="${jsPath}" />`);
    }
  }
  fs.writeFileSync(file, dom.serialize());
});
if (!argv.inline) {
  // Write the packed CSS file:
  fs.writeFileSync(
    path.join('_site', 'packed.css'),
    files.getFiles(/\.css$/).join(''),
  );
  // Write the packed JS file:
  fs.writeFileSync(
    path.join('_site', 'packed.js'),
    files.getFiles(/\.js$/).join(''),
  );
}
