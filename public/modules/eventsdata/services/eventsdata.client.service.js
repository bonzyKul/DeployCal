'use strict';

//Eventsdata service used to communicate Eventsdata REST endpoints
angular.module('eventsdata').factory('Eventsdata', ['$resource',
	function($resource) {
		return $resource('eventsdata/:eventsdatumId', { eventsdatumId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);