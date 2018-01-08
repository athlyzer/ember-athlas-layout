import { computed } from '@ember/object';
import Component from '@ember/component';
import layout from '../../templates/components/page-switch/button';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
	layout,
	athlas: service('athlas-layout'),

	tagName: 'button',
	classNames: ['btn', 'btn-sm'],
	classNameBindings: ['active', 'btnClass'],
	attributeBindings: ['title'],
	title: '',
	btnClass: alias('athlas.pageSwitchBtnClass'),

	active: computed('page', function () {
		return this.get('page') === this.get('value');
	}),

	click() {
		this.get('changePage')(this.get('value'));
	}
});
