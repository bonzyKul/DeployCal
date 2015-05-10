'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Eventsdatum = mongoose.model('Eventsdatum'),
	_ = require('lodash');

/**
 * Create a Eventsdatum
 */
exports.create = function(req, res) {
	var eventsdatum = new Eventsdatum(req.body);
	eventsdatum.user = req.user;

	eventsdatum.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(eventsdatum);
		}
	});
};

/**
 * Show the current Eventsdatum
 */
exports.read = function(req, res) {
	res.jsonp(req.eventsdatum);
};

/**
 * Update a Eventsdatum
 */
exports.update = function(req, res) {
	var eventsdatum = req.eventsdatum ;

	eventsdatum = _.extend(eventsdatum , req.body);

	eventsdatum.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(eventsdatum);
		}
	});
};

/**
 * Delete an Eventsdatum
 */
exports.delete = function(req, res) {
	var eventsdatum = req.eventsdatum ;

	eventsdatum.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(eventsdatum);
		}
	});
};

/**
 * List of Eventsdata
 */
exports.list = function(req, res) { 
	Eventsdatum.find().sort('-created').populate('user', 'displayName').exec(function(err, eventsdata) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(eventsdata);
		}
	});
};

/**
 * Eventsdatum middleware
 */
exports.eventsdatumByID = function(req, res, next, id) { 
	Eventsdatum.findById(id).populate('user', 'displayName').exec(function(err, eventsdatum) {
		if (err) return next(err);
		if (! eventsdatum) return next(new Error('Failed to load Eventsdatum ' + id));
		req.eventsdatum = eventsdatum ;
		next();
	});
};

/**
 * Eventsdatum authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.eventsdatum.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
