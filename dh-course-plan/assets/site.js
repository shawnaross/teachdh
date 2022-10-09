/* globals m state views */

m.mount(document.getElementById("output"), views.App);

state.store.subscribe(function () {
	return function () {
		m.redraw();
	};
});
