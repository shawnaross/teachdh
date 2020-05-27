$(function () {
  // Utility functions:
  function pluck(key, list) {
    return $.map(list, function (item) {return item[key];});
  }

  function search(fuse, target) {
    return pluck('item', fuse.search(target));
  }

  // Data structures:
  var fuseData = $('article').map(function (_i, article) {
    var $article = $(article);
    return {
      id: $article.attr('id'),
      title: $article.find('h1').text(),
      content: $article.find('main').text(),
      categories: $article.find('header li').map(function (_i, li) {return $(li).text();}).get(),
    };
  }).get();
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
  // Filter event handler:
  $('#questions').on('filter', function (_ev, extra) {
    var input = extra.input;
    var results = extra.results;
    if (results.length === 0 && input.length === 0) {
      $('article').show();
    } else {
      var ids = pluck('id', results);
      $('article').each(function (_i, article) {
        ids.indexOf($(article).attr('id')) >= 0 ? $(article).show() : $(article).hide()
      });
    }
  });
  // Filters as the user types in the search bar:
  $('#searchBar').on('input', function (ev) {
    ev.preventDefault();
    var value = ev.target.value;
    $('#questions').trigger('filter', {
      results: search(fuse.questions, value),
      input: value,
    });
  });
  // Filters as the user clicks category buttons:
  $('#categories button').on('click', function (ev) {
    ev.preventDefault();
    var value = $(ev.target).attr('data-target');
    $('#questions').trigger('filter', {
      results: search(fuse.categories, value),
      input: value,
    });
  });
});
