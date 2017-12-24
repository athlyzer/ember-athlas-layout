import { computed } from '@ember/object';
import Component from '@ember/component';
import layout from '../../templates/components/page-switch/button';

export default Component.extend({
	layout,
	tagName: 'button',
	classNames: ['btn', 'btn-sm'],
	classNameBindings: ['active', 'btnClass'],
	attributeBindings: ['title'],
	title: '',
	btnClass: 'btn-secondary',

	active: computed('page', function () {
		return this.get('page') === this.get('value');
	}),

	click() {
		this.get('changePage')(this.get('value'));
	}
});
