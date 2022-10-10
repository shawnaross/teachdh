/* globals m viewUtils obj */

var views = {};

(function () {
	var Plan = {
		view: function (vnode) {
			var item = vnode.attrs.item;
			var category = vnode.attrs.category;
			return m(
				"div",
				{
					class:
						"plan__item" +
						(item.text !== "" && item.clicked ? " plan__item--clicked" : ""),
					onclick: function () {
						if (item.text !== "") vnode.attrs.actions.savePlanItem(category);
					},
				},
				item.text
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
			return m("div.scores", [
				m("h2.scores__title", "Results"),
				m(
					"u2.scores__list",
					obj.mapToArray(vnode.attrs.scores, function (score, key) {
						score = score / vnode.attrs.total;
						return m("li.score", [
							m("span.score__label", viewUtils.makeName(key) + ": "),
							m("span.score__value", [
								viewUtils.scoreToResult(score),
								m("span.score__actual-value", " (" + score.toFixed(2) + ")"),
							]),
						]);
					})
				),
			]);
		},
	};

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
				'Click "Generate A Course Plan". Keep elements in your plan by clicking on them (click again to re-roll them). Don\'t forget to check your results at the bottom (5 is highest)!'
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
