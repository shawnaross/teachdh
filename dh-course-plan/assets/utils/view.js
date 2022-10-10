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
	return "Very high";
};

var resultsToReview = {
	"synchronicity": {
		"Very low": "Greatest autonomy for students deciding when to engage with materials and complete work; meets minimal standards for online learning; unless you reassign 1-2 elements, you will want to brainstorm some other means to build community and open another channel of communication between you and your students",
		"Somewhat low": "Approaches best practices for online learning; if you are not teaching a fully asynchronous online course, you may want to rethink 1-2 of these elements; carefully choose which “column” to maximize your contact points where they align with your personal preferences and skills; with online delivery, students may need encouragement from you to keep up their participation",
		"Medium": "Some flexibility with student choice but tends to keep course moving or choice does not inherently affect synchronicity; strikes an even balance between synchronicity and asynchronicity and should be achievable no matter the course delivery mode; may not maximize student engagement in a face-to-face class but will future-proof class in case of sudden shift in delivery mode",
		"Somewhat high": "Suitable for face-to-face classes; course may need some redesign if the course delivery mode suddenly shifts; consider adding in more customizable features for independent learners",
		"Very high": "Most stringent requirements for simultaneous engagement and meeting deadlines; monitor students for signs that they might need some individual, self-paced options to lower your minimal requirements for their participation; for online classes, consider eliminating or minimizing one of your synchronous elements"
	},
	"active-learning": {
		"Very low": "Most teacher-centered, content-centered, and/or geared to memorization and recall; rethink 4-6 of your choices to increase your level of active learning",
		"Somewhat low": "Course does not allow for much student choice or responsibility; revisit 1-3 of your choices to increase your level of active learning",
		"Medium": "A safe balance for appealing to learners with both high and low motivation levels; consider adding options for student collaboration to any experimental activity/assignment to reduce anxiety",
		"Somewhat high": "An exciting class that will keep your students energized as long as it’s not too much for you to organize; consider including days, weeks, or units of lower intensity to provide ample time for independent learning and high-stakes assignments",
		"Very high": "Maximum student responsibility/choice and connections to prior learning; make certain to include days, weeks, or units of lower intensity to provide ample time for independent learning and high-stakes assignments",
	},
	"teaching-effort": {
		"Very low": "Reflect on whether you will be able to stay motivated and engaged with your students at this amount of effort; with some creative thinking, worthwhile adjustments could be made without adding to teacher effort",
		"Somewhat low": "Depending on your circumstances during that particular semester, you may be able to add one new digital pedagogical element or other active learning feature to your class without feeling too burdened ",
		"Medium": "A good balance between minimizing unnecessary labor and including ample student contact and feedback; check if the areas in which your effort is most concentrated will further your course objectives",
		"Somewhat high": "Nearly maximizes student-instructor contact and feedback; make certain you are content with the particular ways in which these precise choices commit your  energy and dictate the times when you will be most busy during the semester",
		"Very high": "Maximizes student-instructor contact and feedback but may be too much of a commitment; you should feel free to “step back” on 2-4 options, make plans for self-care, or seek help/resources from a colleague, librarian, or edtech specialist",
	}
}

viewUtils.resultToReview = function(result, category) {
	return resultsToReview[category][result];
}