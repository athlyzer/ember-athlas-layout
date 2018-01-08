import Service from '@ember/service';

export default Service.extend({
	pageSwitchBtnClass: 'btn-secondary',

	splitOrientation: 'horizontal',
	splitPosition: '50%',
	splitLimit: 10,

	tabPosition: 'top',
	tabShape: 'tabs',
	tabFill: false,
	tabJustified: false
});
