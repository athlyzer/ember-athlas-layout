import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from '../../templates/components/page-layout/page';
import { isBlank } from '@ember/utils';

// dec2hex :: Integer -> String
function dec2hex(dec) {
	return ('0' + dec.toString(16)).substr(-2)
}

// generateId :: Integer -> String
function generateId(len) {
	var arr = new Uint8Array((len || 40) / 2)
	window.crypto.getRandomValues(arr)
	return Array.from(arr, dec2hex).join('')
}

export default Component.extend({
	layout,
	classNames: ['layout-page'],

	isActive: computed('container.page', function () {
		return this.get('container.page') === this.get('name');
	}),

	init() {
		this._super(...arguments);
		if (isBlank(this.get('name'))) {
			this.set('name', generateId());
		}
		this.get('container').registerPage(this);
	},
});
