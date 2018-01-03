/* eslint-env node */
'use strict';

// included stuff taken from ember-power-select: https://github.com/cibernox/ember-power-select/blob/master/index.js
function findHostShim() {
	let current = this;
	let app;
	do {
		app = current.app || app;
	} while (current.parent.parent && (current = current.parent));
	return app;
}

module.exports = {
	name: 'ember-athlas-layout',

	included(/*appOrAddon*/) {
		let findHost = this._findHost || findHostShim;
		let app = findHost.call(this);
		if (!app.__emberAthlasLayoutIncludedInvoked) {
			app.__emberAthlasLayoutIncludedInvoked = true;

			this._super.included.apply(this, arguments);

			let hasSass = !!app.registry.availablePlugins['ember-cli-sass'];
			// let hasLess = !!app.registry.availablePlugins['ember-cli-less'];

			// Don't include the precompiled css file if the user uses a supported CSS preprocessor
			if (!hasSass/* && !hasLess*/) {
				app.import('vendor/ember-athlas-layout.css');
			}
		}
	}
};
