'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Events Schema
 */
var EventsSchema = new Schema({
	// Events model fields   
	// ...
});

mongoose.model('Events', EventsSchema);