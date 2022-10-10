/* globals immer obj arr Redux */

var state = {};

(function () {
	var initialState = {
		categories: {},
		scores: {},
		plan: {},
	};

	var UPDATE_CATEGORIES = "UPDATE_CATEGORIES";
	var GENERATE_PLAN = "GENERATE_PLAN";
	var SAVE_PLAN_ITEM = "SAVE_PLAN_ITEM";

	var responders = {};

	responders[UPDATE_CATEGORIES] = function (state, action) {
		return immer.produce(state, function (draft) {
			draft.categories = action.payload.categories;
			draft.plan = obj.map(action.payload.categories, function (item, _, i) {
				if (i === 0) {
					draft.scores = obj.map(item[0], function (_, key) {
						return key === "text" ? undefined : 0;
					});
				}
				return {
					clicked: false,
					text: "",
				};
			});
			return draft;
		});
	};

	responders[GENERATE_PLAN] = function (state) {
		return immer.produce(state, function (draft) {
			draft.scores = obj.map(draft.scores, function () {
				return 0;
			});
			obj.eachKey(draft.categories, function (category) {
				if (!draft.plan[category].clicked) {
					draft.plan[category] = arr.randomItem(draft.categories[category]);
					draft.plan[category].clicked = false;
				}
				draft.scores = obj.map(draft.scores, function (score, scoreCategory) {
					return score + draft.plan[category][scoreCategory];
				});
			});
			return draft;
		});
	};

	responders[SAVE_PLAN_ITEM] = function (state, action) {
		return immer.produce(state, function (draft) {
			draft.plan[action.payload.category].clicked =
				!draft.plan[action.payload.category].clicked;
		});
	};

	var reducer = function (state, action) {
		state = state || initialState;

		if (Object.hasOwn(responders, action.type)) {
			return responders[action.type](state, action);
		}

		return state;
	};

	state.store = Redux.createStore(reducer);
	state.actions = {};

	state.actions.updateCategories = function (categories) {
		state.store.dispatch({
			type: UPDATE_CATEGORIES,
			payload: {
				categories: categories,
			},
		});
	};

	state.actions.generatePlan = function () {
		state.store.dispatch({
			type: GENERATE_PLAN,
		});
	};

	state.actions.savePlanItem = function (category) {
		state.store.dispatch({
			type: SAVE_PLAN_ITEM,
			payload: {
				category: category,
			},
		});
	};
})();
