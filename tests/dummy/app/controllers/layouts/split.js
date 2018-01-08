import Controller from '@ember/controller';

export default Controller.extend({
	position: '50%',
	orientation: 'vertical',
	limit: 10,

	actions: {
		orientationChanged(val) {
			this.set('orientation', val);
		}
	}
});
