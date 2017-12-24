module.exports = {
	root: true,
	parserOptions: {
		ecmaVersion: 8,
		sourceType: 'module'
	},
	extends: [
		'eslint:recommended',
		'plugin:ember/recommended'
	],
	plugins: ['compat'],
	rules: {
		'compat/compat': 2,
		'ember/order-in-components': 2,
		'ember/order-in-controllers': 2,
		'ember/order-in-models': 2,
		'ember/order-in-routes': 2
	},
	env: {
		browser: true
	},
	rules: {}
};
