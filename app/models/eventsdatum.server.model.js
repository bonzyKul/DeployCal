'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Eventsdatum Schema
 */
var EventsdatumSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Eventsdatum name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: Date.now
    },
    overlap: {
        type: Boolean
    },
    rendering: {
        type: String
    },
    color: {
        type: String
    }
});

mongoose.model('Eventsdatum', EventsdatumSchema);
