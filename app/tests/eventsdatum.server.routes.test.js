'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Eventsdatum = mongoose.model('Eventsdatum'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, eventsdatum;

/**
 * Eventsdatum routes tests
 */
describe('Eventsdatum CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Eventsdatum
		user.save(function() {
			eventsdatum = {
				name: 'Eventsdatum Name'
			};

			done();
		});
	});

	it('should be able to save Eventsdatum instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Eventsdatum
				agent.post('/eventsdata')
					.send(eventsdatum)
					.expect(200)
					.end(function(eventsdatumSaveErr, eventsdatumSaveRes) {
						// Handle Eventsdatum save error
						if (eventsdatumSaveErr) done(eventsdatumSaveErr);

						// Get a list of Eventsdata
						agent.get('/eventsdata')
							.end(function(eventsdataGetErr, eventsdataGetRes) {
								// Handle Eventsdatum save error
								if (eventsdataGetErr) done(eventsdataGetErr);

								// Get Eventsdata list
								var eventsdata = eventsdataGetRes.body;

								// Set assertions
								(eventsdata[0].user._id).should.equal(userId);
								(eventsdata[0].name).should.match('Eventsdatum Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Eventsdatum instance if not logged in', function(done) {
		agent.post('/eventsdata')
			.send(eventsdatum)
			.expect(401)
			.end(function(eventsdatumSaveErr, eventsdatumSaveRes) {
				// Call the assertion callback
				done(eventsdatumSaveErr);
			});
	});

	it('should not be able to save Eventsdatum instance if no name is provided', function(done) {
		// Invalidate name field
		eventsdatum.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Eventsdatum
				agent.post('/eventsdata')
					.send(eventsdatum)
					.expect(400)
					.end(function(eventsdatumSaveErr, eventsdatumSaveRes) {
						// Set message assertion
						(eventsdatumSaveRes.body.message).should.match('Please fill Eventsdatum name');
						
						// Handle Eventsdatum save error
						done(eventsdatumSaveErr);
					});
			});
	});

	it('should be able to update Eventsdatum instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Eventsdatum
				agent.post('/eventsdata')
					.send(eventsdatum)
					.expect(200)
					.end(function(eventsdatumSaveErr, eventsdatumSaveRes) {
						// Handle Eventsdatum save error
						if (eventsdatumSaveErr) done(eventsdatumSaveErr);

						// Update Eventsdatum name
						eventsdatum.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Eventsdatum
						agent.put('/eventsdata/' + eventsdatumSaveRes.body._id)
							.send(eventsdatum)
							.expect(200)
							.end(function(eventsdatumUpdateErr, eventsdatumUpdateRes) {
								// Handle Eventsdatum update error
								if (eventsdatumUpdateErr) done(eventsdatumUpdateErr);

								// Set assertions
								(eventsdatumUpdateRes.body._id).should.equal(eventsdatumSaveRes.body._id);
								(eventsdatumUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Eventsdata if not signed in', function(done) {
		// Create new Eventsdatum model instance
		var eventsdatumObj = new Eventsdatum(eventsdatum);

		// Save the Eventsdatum
		eventsdatumObj.save(function() {
			// Request Eventsdata
			request(app).get('/eventsdata')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Eventsdatum if not signed in', function(done) {
		// Create new Eventsdatum model instance
		var eventsdatumObj = new Eventsdatum(eventsdatum);

		// Save the Eventsdatum
		eventsdatumObj.save(function() {
			request(app).get('/eventsdata/' + eventsdatumObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', eventsdatum.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Eventsdatum instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Eventsdatum
				agent.post('/eventsdata')
					.send(eventsdatum)
					.expect(200)
					.end(function(eventsdatumSaveErr, eventsdatumSaveRes) {
						// Handle Eventsdatum save error
						if (eventsdatumSaveErr) done(eventsdatumSaveErr);

						// Delete existing Eventsdatum
						agent.delete('/eventsdata/' + eventsdatumSaveRes.body._id)
							.send(eventsdatum)
							.expect(200)
							.end(function(eventsdatumDeleteErr, eventsdatumDeleteRes) {
								// Handle Eventsdatum error error
								if (eventsdatumDeleteErr) done(eventsdatumDeleteErr);

								// Set assertions
								(eventsdatumDeleteRes.body._id).should.equal(eventsdatumSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Eventsdatum instance if not signed in', function(done) {
		// Set Eventsdatum user 
		eventsdatum.user = user;

		// Create new Eventsdatum model instance
		var eventsdatumObj = new Eventsdatum(eventsdatum);

		// Save the Eventsdatum
		eventsdatumObj.save(function() {
			// Try deleting Eventsdatum
			request(app).delete('/eventsdata/' + eventsdatumObj._id)
			.expect(401)
			.end(function(eventsdatumDeleteErr, eventsdatumDeleteRes) {
				// Set message assertion
				(eventsdatumDeleteRes.body.message).should.match('User is not logged in');

				// Handle Eventsdatum error error
				done(eventsdatumDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Eventsdatum.remove().exec();
		done();
	});
});