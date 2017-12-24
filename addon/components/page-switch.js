import Component from '@ember/component';
import layout from '../templates/components/page-switch';

export default Component.extend({
	layout,
	classNames: ['btn-group'],
	attributeBindings: ['role'],
	role: 'group',

	page: null,
	deselectable: false,
	fixed: true,
	pageChanged(/*key*/) { },

	actions: {
		changePage(key) {
			key = this.get('deselectable') && key === this.get('page') ? '' : key;
			this.get('pageChanged')(key);
		}
	}
});
