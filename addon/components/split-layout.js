import Component from '@ember/component';
import layout from '../templates/components/split-layout';
import { observer } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { isBlank } from '@ember/utils';
import Evented from '@ember/object/evented';

const O_HORIZONTAL = 'horizontal';
const O_VERTICAL = 'vertical';

export default Component.extend(Evented, {
	layout,
	classNames: ['layout-split'],

	orientation: 'horizontal',
	position: '50%',
	limit: 10,

	unit: '%',
	resizing: false,
	checkingVisibility: false,
	updating: false,
	recentValue: null,
	visibilityStates: null,

	// created: false,

	positionListener: observer('position', function () {
		if (!this.get('created') || this.get('resizing') || this.get('updating')) {
			return;
		}

		this.update(true);
	}),

	orientationObserver: observer('orientation', function () {
		if (!this.get('created')) {
			return;
		}

		this.resetChild(this.get('firstChild'));
		this.resetChild(this.get('lastChild'));
		this.resetChild(this.get('splitter'));
		this.updateOrientation();
		this.update(true);
	}),

	sashObserver: observer('sash', function () {
		if (!this.get('created')) {
			return;
		}

		this.updateSash();
	}),

	visibilityListener: observer('visibilityStates', function () {
		const childsAreVisible = this.areChildsVisible();
		this.get('splitter').style.display = childsAreVisible ? 'block' : 'none';

		if (childsAreVisible) {
			this.update(true);
		} else {
			this.resetChilds();
		}
	}),

	init() {
		this._super(...arguments);
		this.set('created', false);
		this.set('visibilityStates', [true, true]);
	},

	didInsertElement() {
		this._super(...arguments);

		scheduleOnce('afterRender', this, () => {
			this.lazySetup();
			this.checkVisibility();
		});

		this.get('element').update = (force = false) => {
			if (this.get('created')) {
				this.update(force);
			}
		}
	},

	lazySetup() {
		if (this.get('created')) {
			return;
		}

		if (this.get('element').offsetParent !== null) {
			this.create();
		} else {
			const check = () => {
				if (!this.get('element')) {
					return;
				}

				if (this.get('element').offsetParent !== null) {
					this.create();
				} else {
					window.requestAnimationFrame(check);
				}
			};

			window.requestAnimationFrame(check);
		}
	},

	create() {
		const firstChild = document.querySelector(`#${this.get('elementId')} > *:first-child`);
		const lastChild = document.querySelector(`#${this.get('elementId')} > *:last-child`);
		firstChild.classList.add('layout-fill');
		lastChild.classList.add('layout-fill');

		const splitter = document.createElement('div');
		splitter.classList.add('layout-split-splitter');
		this.get('element').insertBefore(splitter, lastChild);

		const grabber = document.createElement('div');
		grabber.classList.add('layout-split-grabber');
		splitter.appendChild(grabber);
		splitter.addEventListener('mousedown', this);
		splitter.addEventListener('touchstart', this);

		document.body.addEventListener('mouseup', this);
		document.body.addEventListener('touchend', this);
		document.body.addEventListener('mousemove', this);
		document.body.addEventListener('touchmove', this);

		this.set('firstChild', firstChild);
		this.set('lastChild', lastChild);
		this.set('splitter', splitter);
		this.set('grabber', grabber);
		this.set('visibilityStates', [
			this.getStyle(firstChild, 'display') !== 'none',
			this.getStyle(lastChild, 'display') !== 'none'
		]);

		this.updateSash();
		this.updateOrientation();

		// observe style changes
		const observer = new MutationObserver(() => {
			this.checkVisibility();
		});
		observer.observe(firstChild, { attributes: true, attributeFilter: ['style', 'class'] });
		observer.observe(lastChild, { attributes: true, attributeFilter: ['style', 'class'] });
		observer.observe(this.get('element'), { attributes: true, attributeFilter: ['style', 'class'] });
		this.set('observer', observer);

		// observe viewport
		window.addEventListener('resize', this);
		this.set('created', true);
	},

	updateSash() {
		if (!isBlank(this.get('sashHandle'))) {
			this.get('sashHandle').classList.remove('layout-split-grabber-h');
			this.get('sashHandle').classList.remove('layout-split-grabber-v');
			this.get('sashHandle').removeEventListener('mousedown', this);
			this.get('sashHandle').removeEventListener('touchstart', this);
		}

		this.get('grabber').style.display = isBlank(this.get('sash')) ? 'block' : 'none';
		this.set('sashHandle', !isBlank(this.get('sash')) ? document.querySelector(this.get('sash')) : this.get('grabber'));
		this.get('sashHandle').classList.add('layout-split-grabber-' + (this.get('orientation') === O_HORIZONTAL ? 'h' : 'v'));
		this.get('sashHandle').addEventListener('mousedown', this);
		this.get('sashHandle').addEventListener('touchstart', this);
	},

	updateOrientation() {
		const splitter = this.get('splitter');

		splitter.classList.remove('layout-split-splitter-v');
		splitter.classList.remove('layout-split-splitter-h');
		splitter.classList.add('layout-split-splitter-' + (this.get('orientation') === O_HORIZONTAL ? 'h' : 'v'));

		if (!isBlank(this.get('sashHandle'))) {
			this.get('sashHandle').classList.remove('layout-split-grabber-h');
			this.get('sashHandle').classList.remove('layout-split-grabber-v');
			this.get('sashHandle').classList.add('layout-split-grabber-' + (this.get('orientation') === O_HORIZONTAL ? 'h' : 'v'));
		}
	},

	willDestroy() {
		this._super(...arguments);

		if (this.get('created')) {
			if (!isBlank(this.get('sashHandle'))) {
				this.get('sashHandle').removeEventListener('mousedown', this);
				this.get('sashHandle').removeEventListener('touchstart', this);
			}

			this.get('splitter').removeEventListener('mousedown', this);
			this.get('splitter').removeEventListener('touchstart', this);

			document.body.removeEventListener('mouseup', this);
			document.body.removeEventListener('touchend', this);
			document.body.removeEventListener('mousemove', this);
			document.body.removeEventListener('touchmove', this);


			this.get('observer').disconnect();
			window.removeEventListener('resize', this);
		}
	},

	resetChild(child) {
		child.style.top = '';
		child.style.left = '';
		child.style.right = '';
		child.style.bottom = '';
		child.style.width = '';
		child.style.height = '';
	},

	resetChilds() {
		const visibilityStates = this.get('visibilityStates');
		if (!visibilityStates[0]) {
			this.resetChild(this.get('lastChild'));
		}

		if (!visibilityStates[1]) {
			this.resetChild(this.get('firstChild'));
		}
	},

	checkVisibility() {
		if (this.get('updating') || this.get('resizing') || !this.get('created')) {
			return;
		}

		const firstChildVisible = this.getStyle(this.get('firstChild'), 'display') !== 'none';
		const lastChildVisible = this.getStyle(this.get('lastChild'), 'display') !== 'none';
		const visibilityStates = this.get('visibilityStates');

		if (visibilityStates[0] !== firstChildVisible || visibilityStates[1] !== lastChildVisible) {
			this.set('visibilityStates', [firstChildVisible, lastChildVisible]);
		}
	},

	areChildsVisible() {
		const visibilityStates = this.get('visibilityStates');
		return visibilityStates[0] && visibilityStates[1];
	},

	handleEvent(e) {
		this._super(...arguments);
		if (e.type) {
			// console.log('handle event:', e.type, e);
		}
		switch (e.type) {
			case 'resize':
				this.checkVisibility();
				break;

			case 'mousedown':
			case 'touchstart':
				e.preventDefault();
				this.startResizing(e);
				this.trigger('resizingStarted');
				break;

			case 'mouseup':
			case 'touchend':
				this.stopResizing(e);
				this.trigger('resizingStopped');
				break;

			case 'mousemove':
			case 'touchmove':
				if (this.get('resizing')) {
					this.resize(e);
					e.preventDefault();
				}
				break;
		}
	},

	startResizing(e) {
		if (this.get('resizing')) {
			return;
		}

		const resizeOrigin = this.get('orientation') === O_HORIZONTAL
			? (e.type === 'touchstart' ? e.touches[0].clientY : e.clientY)
			: (e.type === 'touchstart' ? e.touches[0].clientX : e.clientX);

		const splitter = this.get('splitter');
		const splitterOrigin = this.get('orientation') === O_HORIZONTAL
			? splitter.offsetTop + (this.getHeight(splitter) / 2)
			: splitter.offsetLeft + (this.getWidth(splitter) / 2);

		this.set('resizing', true);
		this.set('resizeOrigin', resizeOrigin);
		this.set('splitterOrigin', splitterOrigin);
		document.body.classList.add('resizing');
	},

	resize(e) {
		const pos = this.get('orientation') === O_HORIZONTAL
			? (e.type === 'touchmove' ? e.touches[0].clientY : e.clientY)
			: (e.type === 'touchmove' ? e.touches[0].clientX : e.clientX);
		const offset = pos - this.get('resizeOrigin');

		this.setPosition(this.get('splitterOrigin') + offset);
	},

	stopResizing() {
		this.set('resizing', false);
		document.body.classList.remove('resizing');
	},

	update(force = false) {
		this.set('updating', true);
		this.trigger('updatingStarted');

		// set value and unit
		const position = this.get('position');

		// unit
		this.set('unit', position.endsWith && position.endsWith('%') ? '%' : 'px');

		// value
		let value = this.get('recentValue');
		if (value === null || force) {
			value = parseInt(position);

			if (this.get('unit') === '%') {
				const node = this.get('element');
				let max = this.get('orientation') === O_HORIZONTAL
					? this.getHeight(node)
					: this.getWidth(node);

				value = value / 100 * max;
			}
		}

		this.resetChilds();
		if (this.areChildsVisible() && value !== this.get('recentValue')) {
			this.setPosition(value);
		}

		this.set('updating', false);
		this.trigger('updatingStopped');
	},

	setPosition(value) {
		const unit = this.get('unit');
		const limit = this.get('limit');
		const splitter = this.get('splitter');
		const firstChild = this.get('firstChild');
		const lastChild = this.get('lastChild');

		if (this.get('orientation') === O_HORIZONTAL) {
			const max = this.getHeight(this.get('element'));
			const splitterHeight = this.getHeight(splitter);

			let splitterTop = Math.max(Math.min(value - (splitterHeight / 2), max - limit), limit);
			let top = splitterTop + splitterHeight;

			if (unit === '%') {
				splitterTop = (top / max * 100) + '%';
				top = 'calc(' + splitterTop + ' + ' + (splitterHeight / 2) + 'px)';
			} else if (unit === 'px') {
				splitterTop = splitterTop + 'px';
				top = top + 'px';
			}

			firstChild.style.top = 0;
			firstChild.style.height = splitterTop;
			lastChild.style.top = top;
			splitter.style.top = splitterTop;
			this.updatePosition(splitterTop);

		} else if (this.get('orientation') === O_VERTICAL) {
			const max = this.getWidth(this.get('element'));
			const splitterWidth = this.getWidth(splitter);

			let splitterLeft = Math.max(Math.min(value - (splitterWidth / 2), max - limit), limit);
			let left = splitterLeft + splitterWidth;

			if (unit === '%') {
				splitterLeft = Math.round(left / max * 100) + '%';
				left = 'calc(' + splitterLeft + ' + ' + (splitterWidth / 2) + 'px)';
			} else if (unit === 'px') {
				splitterLeft = splitterLeft + 'px';
				left = left + 'px';
			}

			firstChild.style.left = 0;
			firstChild.style.width = splitterLeft;
			lastChild.style.left = left;
			splitter.style.left = splitterLeft;
			this.updatePosition(splitterLeft);
		}

		this.set('recentValue', value);
	},

	updatePosition(value) {
		value = Math.round(parseInt(value)) + this.get('unit');
		if (this.get('positionChanged')) {
			this.positionChanged(value);
		} else {
			this.set('position', value);
		}
	},

	getWidth(node) {
		if (node.style.display === 'none') {
			return 0;
		}

		const boxSizing = node.style.boxSizing || 'content-box';
		let width = node.clientWidth; // jquery: node.width();

		// add margin
		width += this.getIntStyle(node, 'margin-left');
		width += this.getIntStyle(node, 'margin-right');

		// add border and padding
		if (boxSizing === 'content-box') {
			width += this.getIntStyle(node, 'padding-left');
			width += this.getIntStyle(node, 'padding-right');

			width += this.getIntStyle(node, 'border-left-width');
			width += this.getIntStyle(node, 'border-right-width');
		}

		return width;
	},

	getHeight(node) {
		if (node.style.display === 'none') {
			return 0;
		}

		const boxSizing = node.style.boxSizing || 'content-box';
		let height = node.clientHeight; // jquery: node.height();

		// add margin
		height += this.getIntStyle(node, 'margin-top');
		height += this.getIntStyle(node, 'margin-bottom');

		// add border and padding
		if (boxSizing === 'content-box') {
			height += this.getIntStyle(node, 'padding-top');
			height += this.getIntStyle(node, 'padding-bottom');

			height += this.getIntStyle(node, 'border-top-width');
			height += this.getIntStyle(node, 'border-bottom-width');
		}

		return height;
	},

	getAdditionalBounds(node) {
		if (this.get('orientation') === O_HORIZONTAL) {
			let height = 0;
			height += this.getIntStyle(node, 'margin-top');
			height += this.getIntStyle(node, 'margin-bottom');
			height += this.getIntStyle(node, 'padding-top');
			height += this.getIntStyle(node, 'padding-bottom');
			height += this.getIntStyle(node, 'border-top-width');
			height += this.getIntStyle(node, 'border-bottom-width');

			return height;
		} else {
			let width = 0;
			width += this.getIntStyle(node, 'margin-left');
			width += this.getIntStyle(node, 'margin-right');
			width += this.getIntStyle(node, 'padding-left');
			width += this.getIntStyle(node, 'padding-right');
			width += this.getIntStyle(node, 'border-left-width');
			width += this.getIntStyle(node, 'border-right-width');

			return width;
		}
	},

	getOffsetX(element) {
		let offset = 0;

		offset += parseInt(element.offsetLeft);

		if (element !== document.body) {
			offset += this.getOffsetX(element.parentElement);
		}

		return offset;
	},

	getOffsetY(element) {
		let offset = 0;

		offset += parseInt(element.offsetTop);

		if (element !== document.body) {
			offset += this.getOffsetY(element.parentElement);
		}

		return offset;
	},

	getIntStyle(element, property) {
		return parseInt(this.getStyle(element, property));
	},

	getStyle(element, property) {
		return window.getComputedStyle(element, null).getPropertyValue(property);
	}
});

