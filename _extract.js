const { sub } = require('date-fns');
const cheerio = require('cheerio');
const yaml = require('js-yaml');
const dashify = require('dashify');
const fs = require('fs');
const TurndownService = require('turndown');

const turndown = new TurndownService();

fs.readFile('WebCompanion2.0Text.html', (err, buf) => {
  let d = new Date();
  const $ = cheerio.load(buf.toString());
  $('.question').get().map(elem => {
    const question = $(elem).find('h1').text();
    const tags = $(elem).find('ol li').get().map(x => $(x).text());
    const contents = turndown.turndown($(elem).find('.content').html());
    const stub = dashify(question.substring(0,40));
    const header = yaml.dump({
      title: question,
      categories: tags,
    });
    const output = `---
${header}
---
${contents}`;
    fs.writeFileSync(`_posts/${d.getFullYear()}-${('00' + d.getMonth()).slice(-2)}-${('00' + d.getDate()).slice(-2)}-${stub}.md`, output);
    d = sub(d, { days: 1 });
  })
})
