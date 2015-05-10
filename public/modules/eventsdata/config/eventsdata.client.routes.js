'use strict';

//Setting up route
angular.module('eventsdata').config(['$stateProvider',
	function($stateProvider) {
		// Eventsdata state routing
		$stateProvider.
		state('listEventsdata', {
			url: '/eventsdata',
			templateUrl: 'modules/eventsdata/views/list-eventsdata.client.view.html'
		}).
		state('createEventsdatum', {
			url: '/eventsdata/create',
			templateUrl: 'modules/eventsdata/views/create-eventsdatum.client.view.html'
		}).
		state('viewEventsdatum', {
			url: '/eventsdata/:eventsdatumId',
			templateUrl: 'modules/eventsdata/views/view-eventsdatum.client.view.html'
		}).
		state('editEventsdatum', {
			url: '/eventsdata/:eventsdatumId/edit',
			templateUrl: 'modules/eventsdata/views/edit-eventsdatum.client.view.html'
		});
	}
]);