import Controller from '@ember/controller';

export default Controller.extend({
	activePage: 'list',

	actions: {
		changePage(page) {
			this.set('activePage', page);
		}
	}
});
