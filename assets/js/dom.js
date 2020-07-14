function nl2array(nodeList) {
  return nodeList === null ? [] : Array.prototype.slice.call(nodeList);
}

function hasClass(el, clss) {
  return new RegExp("(^|\\s)" + clss + "(\\s|$)").test(el.className);
}

function toggleClass(el, clss) {
  el.classList.toggle(clss);
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
