var obj = {};

obj.map = function(xs, fn) {
	var xss = {};
	Object.keys(xs).forEach(function (key, i) {
		var value = fn(xs[key], key, i);
		if (typeof value !== "undefined") {
			xss[key] = value;
		}
	});
	return xss;
}

obj.mapToArray = function(xs, fn) {
	return Object.keys(xs).map(function (key, i) {
		return fn(xs[key], key, i);
	});
}

obj.eachKey = function(xs, fn) {
	Object.keys(xs).forEach(fn);
}
