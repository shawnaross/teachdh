$(function () {
  function filterQuestions(results) {
    if (results.length === 0) {
      $('article').each(function (_i, article) {
        $(article).show();
      });
    } else {
      var ids = R.pluck('id', results);
      $('article').each(function (_i, article) {
        ids.indexOf($(article).attr('id')) >= 0 ? $(article).show() : $(article).hide()
      });
    }
  }
  var fuseData = [];
  $('article').each(function (_i, article) {
    var $article = $(article);
    fuseData.push({
      id: $article.attr('id'),
      title: $article.find('h1').text(),
      content: $article.find('main').text(),
      categories: $article.find('header li').map(function (_i, li) {return $(li).text();}),
    });
  });
  var fuse = {
    questions: new Fuse(fuseData, {
      keys: [
        'title',
        'content',
      ],
    }),
    categories: new Fuse(fuseData, {
      keys: [
        'categories',
      ],
    })
  };
  var $searchBar = $('#searchBar');
  var results = [];
  $searchBar.on('change', function (ev) {
    ev.preventDefault();
    results = fuse.questions.search(ev.target.value);
    filterQuestions(results);
  });
})
