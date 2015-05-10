'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var eventsdata = require('../../app/controllers/eventsdata.server.controller');

	// Eventsdata Routes
	app.route('/eventsdata')
		.get(eventsdata.list)
		.post(users.requiresLogin, eventsdata.create);

	app.route('/eventsdata/:eventsdatumId')
		.get(eventsdata.read)
		.put(users.requiresLogin, eventsdata.hasAuthorization, eventsdata.update)
		.delete(users.requiresLogin, eventsdata.hasAuthorization, eventsdata.delete);

	// Finish by binding the Eventsdatum middleware
	app.param('eventsdatumId', eventsdata.eventsdatumByID);
};
