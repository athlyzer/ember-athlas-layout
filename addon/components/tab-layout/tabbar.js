import Component from '@ember/component';
import layout from '../../templates/components/tab-layout/tabbar';
import { computed } from '@ember/object';

export default Component.extend({
	layout,
	tagName: 'ul',
	classNames: ['layout-tab-tabbar', 'nav'],
	classNameBindings: ['container.fill:nav-fill', 'container.justified:nav-justified', 'shape', 'container.barClass'],

	shape: computed('container.shape', function () {
		switch (this.get('container.shape')) {
			case 'tabs':
				return 'nav-tabs';

			case 'pills':
				return 'nav-pills';

			case 'underlined':
				return 'shape-underlined';
		}
	}),
});
