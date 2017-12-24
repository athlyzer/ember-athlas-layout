import { observer } from '@ember/object';
import { A } from '@ember/array';
import Component from '@ember/component';
import layout from '../templates/components/page-layout';

export default Component.extend({
	layout,
	classNames: ['layout-pages'],

	page: null,

	activePageListener: observer('page', function () {
		this.activatePage(this.get('page'));
	}),

	init() {
		this._super(...arguments);
		this.set('pages', A());
	},

	registerPage(page) {
		this.get('pages').pushObject(page);
		page.on('didInsertElement', () => {
			this.activatePage(this.get('page'));
		});

		if (this.get('page') === null) {
			this.set('page', page.get('name'));
		}
	},

	activatePage(name) {
		this.get('pages').forEach(page => {
			const element = page.get('element');
			if (element) {
				const classes = element.classList;

				if (page.get('name') === name) {
					classes.remove('layout-page-deactive');
					classes.add('layout-page-active');
				} else {
					classes.remove('layout-page-active');
					classes.add('layout-page-deactive');
				}
			}
		});
	}
});
