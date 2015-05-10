'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Eventsdatum = mongoose.model('Eventsdatum');

/**
 * Globals
 */
var user, eventsdatum;

/**
 * Unit tests
 */
describe('Eventsdatum Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			eventsdatum = new Eventsdatum({
				name: 'Eventsdatum Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return eventsdatum.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			eventsdatum.name = '';

			return eventsdatum.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Eventsdatum.remove().exec();
		User.remove().exec();

		done();
	});
});