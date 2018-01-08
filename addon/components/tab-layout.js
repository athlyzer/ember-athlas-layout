import PageLayout from './page-layout';
import layout from '../templates/components/tab-layout';
import { scheduleOnce } from '@ember/runloop';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default PageLayout.extend({
	layout,
	athlas: service('athlas-layout'),

	classNames: ['layout-tab'],
	classNameBindings: ['position'],

	position: alias('athlas.tabPosition'),
	fill: alias('athlas.tabFill'),
	justified: alias('athlas.tabJustified'),
	shape: alias('athlas.tabShape'),
	barClass: alias('athlas.tabBarClass'),
	containerClass: alias('athlas.tabContainerClass'),

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
