import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
    location: config.locationType,
    rootURL: config.rootURL
});

Router.map(function () {
  this.route('examples', function() {
    this.route('mobile');
  });

  this.route('layouts', function () {
      this.route('page');
      this.route('split');
      this.route('tab');
      this.route('panes');
      this.route('containers');
});
  this.route('documentation');
});

export default Router;
