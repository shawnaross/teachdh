const LoremIpsum = require('lorem-ipsum').LoremIpsum;
const fs = require('fs');
const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

function makePost() {
  const categories = 1 + Math.floor(Math.random() * 6);
  const paragraphs = 1 + Math.floor(Math.random() * 10);
  const year = 2000 + Math.floor(Math.random() * 20);
  const month = 1 + Math.floor(Math.random() * 12);
  const day = 1 + Math.floor(Math.random() * 28);
  fs.writeFileSync(`_posts/${year}-${month}-${day}-${lorem.generateWords(1)}.md`, `---
title: "${lorem.generateWords(15)}"
categories:
  - ${lorem.generateWords(categories).split(' ').join('\n  - ')}
---
${lorem.generateParagraphs(paragraphs).split('\n').join('\n\n')}
`);
}

makePost();
makePost();
makePost();
makePost();
makePost();
