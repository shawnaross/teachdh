/* globals m viewUtils obj */

var views = {};

(function () {
	var Plan = {
		view: function (vnode) {
			return m(
				"div",
				{
					class:
						"plan__item" +
						(vnode.attrs.item.text !== "" && vnode.attrs.item.clicked
							? " plan__item--clicked"
							: ""),
					onclick: function () {
						if (vnode.attrs.item.text !== "")
							vnode.attrs.actions.savePlanItem(vnode.attrs.category);
					},
				},
				vnode.attrs.item.text
			);
		},
	};

	var Plans = {
		view: function (vnode) {
			return m("div", [
				Object.keys(vnode.attrs.categories).map(function (category) {
					return m(".plan", [
						m(".plan__label", category + ":"),
						m(Plan, {
							item: vnode.attrs.plan[category],
							category: category,
							actions: vnode.attrs.actions,
						}),
					]);
				}),
			]);
		},
	};

	var Scores = {
		view: function (vnode) {
			if (vnode.attrs.scores[Object.keys(vnode.attrs.scores)[0]] === 0) {
				return null;
			}
			var results = {};
			return m("div", [
				m("div.scores", [
					m("h2.scores__title", "Results"),
					m(
						"u2.scores__list",
						obj.mapToArray(vnode.attrs.scores, function (score, key) {
							score = score / vnode.attrs.total;
							var result = viewUtils.scoreToResult(score);
							var category = viewUtils.makeName(key);
							results[key] = result;
							return m("li.score", [
								m("span.score__label", category + ": "),
								m("span.score__value", [
									result,
								]),
							]);
						}),
					),
				]),
				m("div.scores", [
					m("h2.scores__title", "Review"),
					m(".scores__list",
						obj.mapToArray(results, function(result, category) {
							return m("p.score__review", [
								m("strong", viewUtils.makeName(category) + ": "),
								viewUtils.resultToReview(result, category),
							]);
						}))
				])
			]);

		},
	};

	var ScoreReport = {
		view: function(vnode) {

		}
	}

	var Generator = {
		view: function (vnode) {
			return m("div#generator-home", [
				m(
					"button.button",
					{
						onclick: function () {
							vnode.attrs.actions.generatePlan();
						},
					},
					"Generate A Course Plan"
				),
			]);
		},
	};

	var About = {
		view: function () {
			return m(
				"p.about",
				'Press "Generate A Course Plan" to view a randomized course design. Reroll as many times as you like. If you like a particular result, click on it to preserve it through the next randomization. When you like your design, scroll down to check its scores for synchronicity, active learning, and teacher effort, then consult the recommendations at the bottom of the page to remedy any imbalance you are not happy with.'
			);
		},
	};

	views.App = {
		oninit: function (vnode) {
			return m
				.request({
					method: "GET",
					url: "assets/data.json",
					withCredentials: true,
				})
				.then(function (data) {
					vnode.attrs.actions.updateCategories(data);
				});
		},
		view: function (vnode) {
			return m("div", [
				m(About),
				m(Plans, {
					categories: vnode.attrs.categories,
					plan: vnode.attrs.plan,
					actions: vnode.attrs.actions,
				}),
				m(Scores, {
					scores: vnode.attrs.scores,
					total: Object.keys(vnode.attrs.categories).length,
				}),
				m(Generator, {
					actions: vnode.attrs.actions,
				}),
			]);
		},
	};
})();
