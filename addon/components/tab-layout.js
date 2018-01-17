import PageLayout from './page-layout';
import layout from '../templates/components/tab-layout';
import { scheduleOnce } from '@ember/runloop';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default PageLayout.extend({
	layout,
	athlas: service('athlas-layout'),

	classNames: ['layout-tab'],
	classNameBindings: ['position'],

	top: computed('position', function () {
		return this.get('position') === 'top';
	}),

	bottom: computed('position', function () {
		return this.get('position') === 'bottom';
	}),

	init() {
		this._super(...arguments);
		if (this.get('barClass') === undefined) {
			this.set('barClass', '');
		}

		if (this.get('containerClass') === undefined) {
			this.set('containerClass', '');
		}

		if (this.get('position') === undefined) {
			this.set('position', this.get('athlas.tabPosition'));
		}

		if (this.get('fill') === undefined) {
			this.set('fill', this.get('athlas.tabFill'));
		}

		if (this.get('justified') === undefined) {
			this.set('justified', this.get('athlas.tabJustified'));
		}

		if (this.get('shape') === undefined) {
			this.set('shape', this.get('athlas.tabShape'));
		}
	},

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
