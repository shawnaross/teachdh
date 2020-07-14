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
