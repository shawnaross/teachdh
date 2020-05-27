var ACTIVE_CLASS = 'active';

function search(fuse, target) {
  return pluck('item', fuse.search(target));
}

document.addEventListener('DOMContentLoaded', function () {
  // Data structures:
  var fuseData = nl2array(document.querySelectorAll('article')).map(function (article) {
    return {
      id: article.getAttribute('id'),
      title: article.querySelector('h1').innerText,
      content: article.querySelector('main').innerText,
      categories: nl2array(article.querySelectorAll('header li')).map(function (li) {return li.innerText;}),
    };
  });
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
  document.querySelector('#titleList').addEventListener('results', function (ev) {
    var input = ev.detail.input;
    var results = ev.detail.results;
    if (results.length === 0 && input.length === 0) {
      document.querySelector('#titleList').innerHTML = '';
    } else {
      document.querySelector('#titleList').innerHTML = '<ul></ul>';
      results.map(function (result) {
        var link = document.createElement('A');
        link.href = '#';
        link.innerHTML = result.title;
        link.addEventListener('click', function (ev) {
          ev.preventDefault();
          document.querySelector('#' + result.id).scrollIntoView({behavior: 'smooth'});
        });
        var item = document.createElement('LI');
        item.insertAdjacentElement('beforeend', link);
        document.querySelector('#titleList ul').insertAdjacentElement('beforeend', item);
      });
    }
  })
  // Filter event handler:
  document.querySelector('#questions').addEventListener('filter', function (ev) {
    var input = ev.detail.input;
    var results = ev.detail.results;
    if (results.length === 0 && input.length === 0) {
      nl2array(document.querySelectorAll('article')).forEach(function (article) {
        show(article)
      });
    } else {
      var ids = pluck('id', results);
      nl2array(document.querySelectorAll('article')).forEach(function (article) {
        ids.indexOf(article.getAttribute('id')) >= 0 ? show(article) : hide(article)
      });
    }
  });
  // Filters as the user types in the search bar:
  document.querySelector('#searchBar').addEventListener('input', function (ev) {
    ev.preventDefault();
    var value = ev.target.value;
    var results = search(fuse.questions, value);
    document.querySelector('#questions').dispatchEvent(new CustomEvent('filter', {
      detail: {
        results: results,
        input: value,
      }
    }));
    document.querySelector('#titleList').dispatchEvent(new CustomEvent('results', {
      detail: {
        results: results,
        input: value,
      }
    }));
  });
  // Filters as the user clicks category buttons:
  categories.map(function (category) {
    var button = document.createElement('BUTTON');
    button.innerHTML = category;
    button.setAttribute('data-target', category);
    button.addEventListener('click', function (ev) {
      ev.preventDefault();
      var value = ev.target.getAttribute('data-target');
      var isActive = hasClass(ev.target, ACTIVE_CLASS);
      toggleClass(ev.target, ACTIVE_CLASS);
      nl2array(document.querySelector('.active'))
        .filter(function (element) {return element !== ev.target})
        .forEach(function (element) {
          toggleClass(element, ACTIVE_CLASS);
        });
      document.querySelector('#questions').dispatchEvent(new CustomEvent('filter', {
        detail: {
          results: isActive ? [] : search(fuse.categories, value),
          input: isActive ? '' : value,
        }
      }));
    });
    var item = document.createElement('LI');
    item.insertAdjacentElement('beforeend', button);
    document.querySelector('#categories ul').insertAdjacentElement('beforeend', item);
  });
});
