/* eslint-env node */
'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
	let app = new EmberAddon(defaults, {
		// Add options here
		snippetPaths: ['snippets'],
		includeHighlightStyle: false
	});

	/*
	  This build file specifies the options for the dummy test app of this
	  addon, located in `/tests/dummy`
	  This build file does *not* influence how the addon or the app using it
	  behave. You most likely want to be modifying `./index.js` or app's build file
	*/

	app.import('node_modules/bootstrap/dist/css/bootstrap.css');
	app.import('node_modules/bootstrap/dist/js/bootstrap.js');
	app.import('node_modules/highlight.js/styles/github-gist.css');
	app.import('node_modules/popper.js/dist/umd/popper.js', {
		using: [
			{ transformation: 'amd', as: 'Popper' }
		]
	});

	return app.toTree();
};
