function nl2array(nodeList) {
  return Array.prototype.slice.call(nodeList);
}

var hasClass = (typeof document.documentElement.classList == 'undefined') ?
  function (el, clss) {
    return el.className && new RegExp("(^|\\s)" +
      clss + "(\\s|$)").test(el.className);
  } :
  function (el, clss) {
    return el.classList.contains(clss);
  };

function toggleClass(el, clss) {
  if (typeof document.documentElement.classList == 'undefined') {
    el.classList.toggle(clss);
  } else {
    // For IE9
    var classes = el.className.split(" ");
    var i = classes.indexOf(clss);

    if (i >= 0)
      classes.splice(i, 1);
    else
      classes.push(clss);
    el.className = classes.join(" ");
  }
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
