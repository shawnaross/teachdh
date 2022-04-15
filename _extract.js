const { add } = require('date-fns');
const cheerio = require('cheerio');
const fs = require('fs');
const TurndownService = require('turndown');
const turndown = new TurndownService();

fs.readFile('WebCompanion2.0Text.html', (err, buf) => {
  let d = new Date(2014, 1, 1);
  const $ = cheerio.load(buf.toString());
  $('.question').get().map(elem => {
    const question = $(elem).find('h1').text();
    const tags = $(elem).find('ol.li').map(x => $(x).text());
    const contents = turndown.turndown($(elem).find('.content').html());
  })
})
