var viewUtils = {};

viewUtils.makeName = function (id) {
	return id
		.split("-")
		.map(function (xs) {
			return xs[0].toUpperCase() + xs.substr(1);
		})
		.join(" ");
};

viewUtils.scoreToResult = function (score) {
	if (score <= 2.0) {
		return "Very low";
	}
	if (score <= 3.1) {
		return "Somewhat low";
	}
	if (score <= 3.4) {
		return "Medium";
	}
	if (score <= 3.8) {
		return "Somewhat high";
	}
	return "High";
};
