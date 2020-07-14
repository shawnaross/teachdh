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
