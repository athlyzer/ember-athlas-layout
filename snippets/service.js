// routes/application.js

import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
	athlasLayout: service(),

	beforeModel() {
		this.get('athlasLayout').set('pageSwitchBtnClass', 'btn-toolbar');
	}
});
