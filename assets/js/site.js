/* globals Fuse, Stickyfill */
document.addEventListener('DOMContentLoaded', function () {
  // Class definitions:
  var ACTIVE_CLASS = 'white bg-dark-blue';
  var INACTIVE_CLASS = 'black bg-white hover-bg-moon-gray';
  var BUTTON_CLASS = 'f6 grow no-underline br-pill ba ph3 pv2 mb2 mr2 black bg-white b--black hover-bg-moon-gray pointer';
  var TITLE_LIST_CLASS = 'mw7 center db pl0';
  var TITLE_LIST_ITEM_CLASS = 'mv1';

  // DOM Helper functions:
  function nl2array(nodeList) {
    return nodeList === null ? [] : Array.prototype.slice.call(nodeList);
  }

  function hasClass(el, cl) {
    return cl.split(' ').reduce(function (found, c) {return found ? found : el.classList.contains(c)}, false)
  }

  function toggleClass(el, cl) {
    cl.split(' ').forEach(function (c) {el.classList.toggle(c)})
  }

  function show(element) {
    if (!element.hasAttribute('data-display')) {
      var temp = document.body.appendChild(document.createElement(element.nodeName));
      element.setAttribute('data-display', window.getComputedStyle(element).getPropertyValue('display'));
      document.body.removeChild(temp);
    }
    element.style.display = element.getAttribute('data-display');
  }
  function hide(element) {
    if (!element.hasAttribute('data-display')) {
      var temp = document.body.appendChild(document.createElement(element.nodeName));
      element.setAttribute('data-display', window.getComputedStyle(element).getPropertyValue('display'));
      document.body.removeChild(temp);
    }
    element.style.display = 'none';
  }
  function hidden(element) {
    return element.style.display === 'none';
  }

  // Search helper function:
  function search(fuse, target) {
    return pluck('item', fuse.search(target));
  }

  // Utility functions:
  function pluck(key, list) {
    return list.map(function (item) {return item[key];});
  }

  function uniq(list) {
    return list.filter(function (item, index) {return list.indexOf(item) === index});
  }

  function flatten(list, d) {
    d = d || Infinity;
    return d > 0 ? list.reduce(function (acc, val) {return acc.concat(Array.isArray(val) ? flatten(val, d - 1) : val)}, []) : list.slice();
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
  // Load Stickyfill:
  Stickyfill.add(document.querySelector('#controls'));
  // Title List event handler:
  document.querySelector('#titleList').addEventListener('results', function (ev) {
    var input = ev.detail.input;
    var results = ev.detail.results;
    if (results.length === 0 && input.length === 0) {
      document.querySelector('#titleList').innerHTML = '';
    } else {
      document.querySelector('#titleList').innerHTML = '<ul class="' + TITLE_LIST_CLASS + '"></ul>';
      results.map(function (result) {
        var link = document.createElement('A');
        link.href = '#';
        link.innerHTML = result.title;
        link.addEventListener('click', function (ev) {
          ev.preventDefault();
          hide(document.querySelector('#titleList'))
          document.querySelector('#' + result.id).scrollIntoView({behavior: 'smooth'});
        });
        var item = document.createElement('LI');
        item.className = TITLE_LIST_ITEM_CLASS
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
    if (hidden(document.querySelector('#titleList'))) {
      show(document.querySelector('#titleList'))
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
