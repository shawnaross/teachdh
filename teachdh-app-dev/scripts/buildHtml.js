const cheerio = require('cheerio')
const fs = require('fs')

const $ = cheerio.load(fs.readFileSync(__dirname + '/../build/index.html'))

console.log(`---
layout: teachdh
---
${$('body').html()}
`)
