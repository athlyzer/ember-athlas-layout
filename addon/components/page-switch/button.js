import { computed } from '@ember/object';
import Component from '@ember/component';
import layout from '../../templates/components/page-switch/button';
import { inject as service } from '@ember/service';

export default Component.extend({
	layout,
	athlas: service('athlas-layout'),

	tagName: 'button',
	classNames: ['btn', 'btn-sm'],
	classNameBindings: ['active', 'btnClass'],
	attributeBindings: ['title'],
	title: '',

	active: computed('page', function () {
		return this.get('page') === this.get('value');
	}),

	init() {
		this._super(...arguments);

		if (this.get('btnClass') === undefined) {
			this.set('btnClass', this.get('athlas.pageSwitchBtnClass'));
		}
	},

	click() {
		this.get('changePage')(this.get('value'));
	}
});
