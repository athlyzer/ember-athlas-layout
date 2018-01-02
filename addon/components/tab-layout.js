import PageLayout from './page-layout';
import layout from '../templates/components/tab-layout';
import { scheduleOnce } from '@ember/runloop';
import { computed } from '@ember/object';

export default PageLayout.extend({
	layout,
	classNames: ['layout-tab'],
	classNameBindings: ['position'],
	position: 'top',

	fill: false,
	justified: false,
	shape: 'tabs',
	barClass: '',
	containerClass: '',

	top: computed('position', function () {
		return this.get('position') === 'top';
	}),

	bottom: computed('position', function () {
		return this.get('position') === 'bottom';
	}),

	didInsertElement() {
		this._super(...arguments);

		scheduleOnce('afterRender', this, () => {
			this.rerender();
		});
	},

	actions: {
		changePage(name) {
			this.set('page', name);
		}
	}
});
