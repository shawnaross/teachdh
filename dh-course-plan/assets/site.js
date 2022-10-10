/* globals m state views */

var Wrapper = {
	view: function() {
		var attrs = Object.assign({
			actions: state.actions,
		}, state.store.getState())
		return m(views.App, attrs);
	}
}

m.mount(document.getElementById("output"), Wrapper);
