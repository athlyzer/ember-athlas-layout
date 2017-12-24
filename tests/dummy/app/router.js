import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
	location: config.locationType,
	rootURL: config.rootURL
});

Router.map(function () {
	this.route('page');
	this.route('split');
	this.route('tab');
	this.route('containers');
});

export default Router;
