/* globals Fuse, Bacon, Stickyfill, R, $ */
$(function () {
  $.fn.scrollTo = function (offset) {
    offset = offset || 0;
    window.scrollTo({
      top: $(this)[0].getBoundingClientRect().top + window.pageYOffset + offset,
      behavior: 'smooth'
    });
  }
  // Attach Bacon methods to $
  Bacon.$.init($)
  // Load Stickyfill. Remove this if there are no sticky elements:
  Stickyfill.add($('#controls'));
  // Scroll Offset for questions. This can be set to 0 if there are no stick controls:
  var SCROLL_OFFSET = -1 * $('#controls').outerHeight(true)

  // Class definitions:
  var ACTIVE_CLASS = 'white bg-dark-blue black bg-white hover-bg-moon-gray'
  var BUTTON_CLASS = 'f6 grow no-underline br-pill ba ph3 pv2 mb2 mr2 black bg-white b--black hover-bg-moon-gray pointer'
  var TITLE_LIST_CLASS = 'mw7 center db pl0'
  var TITLE_LIST_ITEM_CLASS = 'mv1'
  var CATEGORY_LIST_ITEM_CLASS = 'dib'
  var CONTROLS_TRAY_VISIBLE_CLASS = 'bb b--black-20'
  var TRAY_VISIBLE_CLASS = 'pointer tooltip relative center bg-white black-20 bt-0 ba b--black-20 mw3 tc db dn br--bottom br2'

  // Toggle styles based on Tachyons. Can be rewritten for a different style
  // system:
  var toggleStyle = R.curry(function (type, target) {
    switch (type) {
      case 'button':
        return $(target).toggleClass(BUTTON_CLASS)
      case 'button-active':
        return $(target).toggleClass(ACTIVE_CLASS)
      case 'title-list':
        return $(target).toggleClass(TITLE_LIST_CLASS)
      case 'title-list-item':
        return $(target).toggleClass(TITLE_LIST_ITEM_CLASS)
      case 'category-list-item':
        return $(target).toggleClass(CATEGORY_LIST_ITEM_CLASS)
      case 'controls-tray-visible':
        return $(target).toggleClass(CONTROLS_TRAY_VISIBLE_CLASS)
      case 'tray-visible':
        return $(target).toggleClass(TRAY_VISIBLE_CLASS)
      default:
        return $(target)
    }
  })

  // Read through the document's Html to build the data structure we will
  // supply to Fuse:
  var fuseData = Array.from($('article')).map(function (article) {
    return {
      id: $(article).attr('id'),
      title: $(article).find('h1').text(),
      content: $(article).find('main').text(),
      categories: Array.from($(article).find('header li')).map(function (li) {return li.innerText;}),
    };
  });

  // Extract categories from the above data and build the list of category
  // filtering buttons:
  R.pipe(
    R.pluck('categories'),
    R.flatten,
    R.uniq,
    R.map(function (category) {
      var button = $('<button />');
      button.html(category);
      toggleStyle('button', button)
      button.attr('data-target', category);
      var item = $('<li/>')
      toggleStyle('category-list-item', item)
      item.append(button)
      $('#categories ul').append(item)
    })
  )(fuseData)

  // Create the Fuse object:
  var fuse = {
    questions: new Fuse(fuseData, {
      keys: [
        'title',
        'content',
      ],
    }),
  };

  // Helper function for Fuse searches:
  function search(fuse, target) {
    return R.pluck('item', fuse.search(target));
  }

  // This function detects an empty results object, which is used to split
  // filter and result events into separate streams:
  var areResultsEmpty = R.where({
    results: R.pipe(R.length, R.equals(0)),
    input: R.pipe(R.length, R.equals(0)),
  })

  // Generate the actions for filter events, whether turning on or turning off
  var filterHelperFactory = function (clearFilter) {
    return function () {
      var results = clearFilter ? [] : arguments[0]
      var input = clearFilter ? '' : arguments[1]
      // Trigger the filter event:
      $('#questions').trigger('filter', {
        results: results,
        input: input,
      })
    }
  }
  // Function to clear any active filters:
  var clearFilter = filterHelperFactory(true)
  // Function to attach a filter:
  var addFilter = filterHelperFactory(false)

  // Create event streams using a pattern that repeats a few times:
  var eventToResultStream = function (target, event) {
    return $(target).asEventStream(event, function (_ev, data) {
      return {
        input: data.input,
        results: data.results,
      }
    })
  }

  // Stream that listens for search results:
  var resultsStream = eventToResultStream('#titleList', 'results')

  // Handle empty results:
  resultsStream
    .filter(areResultsEmpty)
    .onValue(function () {
      $('#titleList').html('')
    })

  // Handle results by generating the contents of title list:
  resultsStream
    .filter(R.pipe(areResultsEmpty, R.not))
    .map(R.prop('results'))
    .onValue(function (results) {
      $('#titleList').html('<ul></ul>')
      toggleStyle('title-list', $('#titleList ul'))
      R.map(function (result) {
        var item = $.parseHTML(
          '<li>' +
          '<a href="#">' + result.title + '</a>' +
          '</li>'
        )
        toggleStyle('title-list-item', item)
        $(item).find('a').attr('data-result', result.id)
        $('#titleList ul').append(item)
      }, results)
    })
  // Stream to handle the user clicking on links in the title list:
  var titleListClickStream = $('#titleList').asEventStream('click', 'a', function (ev) {ev.preventDefault(); return ev.target})

  // On a user click, we hide title list and scroll to target they clicked:
  titleListClickStream.onValue(function (target) {
    $('#titleList').hide()
    $('#' + $(target).attr('data-result')).scrollTo(SCROLL_OFFSET)
  })
  // Stream for handling filter events:
  var filterStream = eventToResultStream('#questions', 'filter')
  // Clear filters:
  filterStream
    .filter(areResultsEmpty)
    .onValue(function () {
      $('article').show()
    })
  // Attach filters:
  filterStream
    .filter(R.pipe(areResultsEmpty, R.not))
    .map(R.prop('results'))
    .map(R.pluck('id'))
    .onValue(function (ids) {
      // Parse the list of ids returned by Fuse and show the ones that are
      // included, while hiding the others:
      $('article').each(function (_i, el) {
        ids.indexOf($(el).attr('id')) >= 0 ? $(el).show() : $(el).hide()
      })
    })

  // // Show TitleList on search bar focus:
  $('#searchBar').on('focus', function () {
    $('#titleList').show()
  })

  // The next few streams control closing and opening the tray:
  // This fixes some spacing issues:
  var MAGIC_TRAY_OFFSET = -23
  $('#tray')
    .css('bottom', MAGIC_TRAY_OFFSET)
    .css('margin-top', MAGIC_TRAY_OFFSET)
  // Handle clicking on  the tray button and how we style opening and closing:
  var trayStatus = Bacon.update(
    true,
    [$('#tray').asEventStream('click'), function (isTrayOpen) {
      $('#controls div').not('#tray')[isTrayOpen ? 'hide' : 'show']()
      $('#controls')
        .toggleClass('pv1')
        .css('height', isTrayOpen ? '0' : 'auto')
      $('#tray')
        .css('bottom', isTrayOpen ? 0 : MAGIC_TRAY_OFFSET)
        .css('margin-top', isTrayOpen ? 0 : MAGIC_TRAY_OFFSET)
      $('#tray .content')
        .html(isTrayOpen ? '&#9660;' : '&#9650;')
      $('#tray .tooltip__text')
        .html(isTrayOpen ? 'Click to open menu' : 'Click to close menu')
      return !isTrayOpen
    }]
  )
  trayStatus.onValue(R.identity)
  // Toggle sticky tray CSS classes:
  var showHideTray = function (shouldClick) {
    window.requestAnimationFrame(function () {
      toggleStyle('tray-visible', $('#tray'))
      toggleStyle('controls-tray-visible', $('#controls'))
      if (shouldClick) {
        $('#tray').trigger('click')
      }
    })
  }
  // Stream capturing scroll events:
  var scrollStream = $(window).asEventStream('scroll', function () {return window.pageYOffset})
  // How tall is #controls when open:
  var controlHeight = Bacon.constant($('#controls').outerHeight())
  // Controls showing and hiding CSS for when the menu is "stuck":
  var stickyMenuStream = Bacon.update(
    false,
    [scrollStream, controlHeight, trayStatus, function (isStuck, top, height, isTrayOpen) {
      var controlTop = $('#controls')[0].getBoundingClientRect().top
      // If object is not stuck but is at the top of the browser window, attach
      // sticky styles and set isStuck to true:
      if ((!isStuck && controlTop === 0)) {
        showHideTray()
        return true
      }
      // If object is stuck but is no longer at the top of the browser window:
      if ((isStuck && controlTop > 0)) {
        // If the tray is closed:
        if (!isTrayOpen) {
          // And if top is less than the expanded height, keep the tray stuck and
          // at the top of the browser window:
          if (top <= height) {
            window.requestAnimationFrame(function () {
              $('#tray').css('margin-top', -1 * (top - height))
              $('#questions').css('margin-top', top - height)
            })
            return true

          } else { // Otherwise, open the tray and unstick the controls:
            showHideTray(true)
            return false
          }
        }
        // If tray is open, unstick it:
        showHideTray()
        return false
      }
      // Otherwise, keep doing what you're doing:
      return isStuck
    }])
  stickyMenuStream.onValue(R.identity)

  // Capture input as the user types:
  var inputStream = $('#searchBar').asEventStream('input')
  inputStream
    .debounce(150) // Uncomment if you want delay in search
    .map(R.path(['target', 'value']))
    .onValue(function (value) {
      var results = search(fuse.questions, value)
      addFilter(results, value)
      $('#titleList').trigger('results', {
        results: results,
        input: value,
      })
    })

  // Stream for every category button's clicks:
  var buttonClickStream = $('#categories').asEventStream('click', 'button', function (ev) {
    return {
      target: $(ev.target).attr('data-target'),
      button: ev.target
    }
  })
  // Toggle button's style on every click:
  buttonClickStream.onValue(function (data) {
    toggleStyle('button-active', data.button)
  })

  // This block combines two streams, representing two events:
  //    - category buttons clicked
  //    - user typing in search bar
  //  Both need to know the active button and perform tasks (mostly triggering
  //  events) in response.
  Bacon.update(
    null,
    // Handle the change in filter state when the user clicks a category
    // button:
    [buttonClickStream, function (state, data) {
      // If an active button is clicked, clear the filter:
      if (state === data.button) {
        clearFilter()
        return null
      }
      // Toggle off the old button if a new button has been clicked:
      toggleStyle('button-active', state)
      // Attach a new filter, one that only uses categories:

      addFilter(fuseData.filter(R.pipe(
        R.prop('categories'), // Grab the categories property
        R.indexOf(data.target), // Grab the array index of data.target
        R.gte(R.__, 0) // Is it >= 0?
      )), data.target)
      return data.button
    }],
    [inputStream, R.pipe(
      toggleStyle('button-active'), // Turn off active class for state
      clearFilter, // Clear the filter
      R.always(null) // Always set state to null
    )]
  ).onValue(R.identity) // Have to attach a onValue for Bacon to hook this up
});
