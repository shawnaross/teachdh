var arr = {};

arr.randomItem = function(xs) {
	return xs[Math.floor(Math.random() * xs.length)];
}
