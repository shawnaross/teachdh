/* globals $ */

fetch("assets/data.json")
	.then(function (response) {
		return response.json();
	})
	.then(function (data) {
		runSite(data);
	});

function runSite(data) {
	const scoreCategories = [
		"Synchronicity",
		"Active Learning",
		"Teaching Effort",
	];

	function randomItem(xs) {
		return xs[Math.floor(Math.random() * xs.length)];
	}

	function makeId(id) {
		return id.replace(/[^0-9A-Za-z]/g, "-").toLowerCase();
	}

	function attachScores() {
		const output = $("#output");
		const list = $('<ul id="scores"></ul>');
		$('<h2 class="scores__title">Effort Required:</h2>').appendTo(output);
		scoreCategories.forEach(function (name) {
			const id = makeId(name);
			$(
				'<li id="' +
					id +
					'" class="score"><span class="score__label">' +
					name +
					':</span> <span class="score__value"/>'
			).appendTo(list);
		});

		list.appendTo(output);
	}

	const outputElement = $("#output");
	Object.keys(data).forEach(function (key) {
		const planElement = $("<div/>");
		planElement.addClass("plan");

		const labelElement = $("<div/>");
		labelElement.addClass("plan__label");
		labelElement.html(key + ":");

		const itemElement = $("<div/>");
		itemElement.addClass("plan__item");
		itemElement.attr("id", makeId(key));
		itemElement.on("click", function () {
			itemElement.toggleClass("plan__item--clicked");
		});

		labelElement.appendTo(planElement);
		itemElement.appendTo(planElement);
		planElement.appendTo(outputElement);
	});

	function generateCoursePlan() {
		// Add the score display component:
		if ($("#scores").length === 0) {
			attachScores();
		}

		// Build the score object:
		const totals = {};
		scoreCategories.forEach(function (name) {
			const value = makeId(name);
			totals[value] = 0;
		});

		Object.keys(data).forEach(function (key) {
			const target = $("#" + makeId(key));
			if (!target.hasClass("plan__item--clicked")) {
				const content = randomItem(data[key]);
				// Update scores:
				Object.keys(totals).forEach(function (value) {
					target.data(value, content[value]);
				});
				// Set HTML Contents:
				target.html(content.text);
			}
			// Update running totals:
			Object.keys(totals).forEach(function (value) {
				totals[value] += parseInt(target.data(value), 10);
			});
		});

		// Calculate average scores:
		const elementCount = $(".plan").length;
		Object.keys(totals).forEach(function (value) {
			$("#" + value + " .score__value").text(
				(totals[value] / elementCount).toFixed(2)
			);
		});
	}
	$("#generator").on("click", generateCoursePlan);
}
