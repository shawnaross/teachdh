$(function () {
  // Utility functions:
  function pluck(key, list) {
    return list.map(function (item) {return item[key];});
  }

  function uniq(list) {
    return list.filter(function (item, index) {return list.indexOf(item) === index});
  }

  function flatten(list, d) {
    var d = d || Infinity;
    return d > 0 ? list.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatten(val, d - 1) : val), []) : list.slice();
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
  // Extract categories from the above data:
  var categories = uniq(flatten(pluck('categories', fuseData)));
  // Generate fuse search objects:
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
  // Title List event handler:
  $('#titleList').on('results', function (_ev, extra) {
    var input = extra.input;
    var results = extra.results;
    if (results.length === 0 && input.length === 0) {
      $('#titleList').html('');
    } else {
      $('#titleList').html('<ul></ul>');
      results.map(function (result) {
        var link = $('<a href="#"></a>');
        link.html(result.title);
        link.on('click', function (ev) {
          ev.preventDefault();
          $.scrollTo('#' + result.id);
        });
        $('#titleList ul').append($('<li></li>').append(link));
      });
    }
  })
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
    var results = search(fuse.questions, value);
    $('#questions').trigger('filter', {
      results: results,
      input: value,
    });
    $('#titleList').trigger('results', {
      results: results,
      input: value,
    });
  });
  // Filters as the user clicks category buttons:
  categories.map(function (category) {
    var button = $('<button></button>');
    button.html(category);
    button.data('target', category);
    button.on('click', function (ev) {
      ev.preventDefault();
      var value = $(ev.target).data('target');
      var isActive = $(ev.target).hasClass('active');
      $(ev.target).toggleClass('active');
      $('.active').not(ev.target).removeClass('active');
      $('#questions').trigger('filter', {
        results: isActive ? [] : search(fuse.categories, value),
        input: isActive ? '' : value,
      });
    });
    $('#categories ul').append($('<li></li>').append(button));
  });
});
