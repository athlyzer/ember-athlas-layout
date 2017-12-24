import Controller from '@ember/controller';

export default Controller.extend({
	activePage: 'rocket',

	actions: {
		changePage(page) {
			this.set('activePage', page);
		}
	}
});
