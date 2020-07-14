/* globals Fuse, Stickyfill, pluck, nl2array, uniq, flatten, show, hide, hasClass, toggleClass */
document.addEventListener('DOMContentLoaded', function () {
  Stickyfill.add(document.querySelector('#controls'));
  var ACTIVE_CLASS = 'bg-moon-gray';
  var INACTIVE_CLASS = 'bg-white';
  var BUTTON_CLASS = 'f6 grow no-underline br-pill ba ph3 pv2 mb2 mr2 black bg-white b--black pointer';

  function search(fuse, target) {
    return pluck('item', fuse.search(target));
  }
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
  };
  // Title List event handler:
  document.querySelector('#titleList').addEventListener('results', function (ev) {
    var input = ev.detail.input;
    var results = ev.detail.results;
    if (results.length === 0 && input.length === 0) {
      document.querySelector('#titleList').innerHTML = '';
    } else {
      document.querySelector('#titleList').innerHTML = '<ul class="mw7 center db pl0"></ul>';
      results.map(function (result) {
        var link = document.createElement('A');
        link.href = '#';
        link.innerHTML = result.title;
        link.className = 'dark-blue no-underline underline-hover'
        link.addEventListener('click', function (ev) {
          ev.preventDefault();
          document.querySelector('#titleList').style.display = 'none';
          document.querySelector('#' + result.id).scrollIntoView({behavior: 'smooth'});
        });
        var item = document.createElement('LI');
        item.className = 'mv1'
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
  // Show TitleList on focus:
  document.querySelector('#searchBar').addEventListener('focus', function () {
    if (document.querySelector('#titleList').style.display === 'none') {
      document.querySelector('#titleList').style.display = 'block';
    }
  })

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
    button.className = BUTTON_CLASS;
    button.setAttribute('data-target', category);
    button.addEventListener('click', function (ev) {
      ev.preventDefault();
      var value = ev.target.getAttribute('data-target');
      var isActive = hasClass(ev.target, ACTIVE_CLASS);
      toggleClass(ev.target, ACTIVE_CLASS + ' ' + INACTIVE_CLASS);
      nl2array(document.querySelectorAll('.' + ACTIVE_CLASS.replace(/ /g, '.')))
        .filter(function (element) {return element !== ev.target})
        .forEach(function (element) {
          toggleClass(element, ACTIVE_CLASS + ' ' + INACTIVE_CLASS);
        });
      document.querySelector('#questions').dispatchEvent(new CustomEvent('filter', {
        detail: {
          results: isActive ? [] : fuseData.filter(function (x) {return x.categories.indexOf(value) >= 0}),
          input: isActive ? '' : value,
        }
      }));
    });
    var item = document.createElement('LI');
    item.className = 'dib'
    item.insertAdjacentElement('beforeend', button);
    document.querySelector('#categories ul').insertAdjacentElement('beforeend', item);
  });
});
