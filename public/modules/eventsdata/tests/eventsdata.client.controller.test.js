'use strict';

(function() {
	// Eventsdata Controller Spec
	describe('Eventsdata Controller Tests', function() {
		// Initialize global variables
		var EventsdataController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Eventsdata controller.
			EventsdataController = $controller('EventsdataController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Eventsdatum object fetched from XHR', inject(function(Eventsdata) {
			// Create sample Eventsdatum using the Eventsdata service
			var sampleEventsdatum = new Eventsdata({
				name: 'New Eventsdatum'
			});

			// Create a sample Eventsdata array that includes the new Eventsdatum
			var sampleEventsdata = [sampleEventsdatum];

			// Set GET response
			$httpBackend.expectGET('eventsdata').respond(sampleEventsdata);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.eventsdata).toEqualData(sampleEventsdata);
		}));

		it('$scope.findOne() should create an array with one Eventsdatum object fetched from XHR using a eventsdatumId URL parameter', inject(function(Eventsdata) {
			// Define a sample Eventsdatum object
			var sampleEventsdatum = new Eventsdata({
				name: 'New Eventsdatum'
			});

			// Set the URL parameter
			$stateParams.eventsdatumId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/eventsdata\/([0-9a-fA-F]{24})$/).respond(sampleEventsdatum);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.eventsdatum).toEqualData(sampleEventsdatum);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Eventsdata) {
			// Create a sample Eventsdatum object
			var sampleEventsdatumPostData = new Eventsdata({
				name: 'New Eventsdatum'
			});

			// Create a sample Eventsdatum response
			var sampleEventsdatumResponse = new Eventsdata({
				_id: '525cf20451979dea2c000001',
				name: 'New Eventsdatum'
			});

			// Fixture mock form input values
			scope.name = 'New Eventsdatum';

			// Set POST response
			$httpBackend.expectPOST('eventsdata', sampleEventsdatumPostData).respond(sampleEventsdatumResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Eventsdatum was created
			expect($location.path()).toBe('/eventsdata/' + sampleEventsdatumResponse._id);
		}));

		it('$scope.update() should update a valid Eventsdatum', inject(function(Eventsdata) {
			// Define a sample Eventsdatum put data
			var sampleEventsdatumPutData = new Eventsdata({
				_id: '525cf20451979dea2c000001',
				name: 'New Eventsdatum'
			});

			// Mock Eventsdatum in scope
			scope.eventsdatum = sampleEventsdatumPutData;

			// Set PUT response
			$httpBackend.expectPUT(/eventsdata\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/eventsdata/' + sampleEventsdatumPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid eventsdatumId and remove the Eventsdatum from the scope', inject(function(Eventsdata) {
			// Create new Eventsdatum object
			var sampleEventsdatum = new Eventsdata({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Eventsdata array and include the Eventsdatum
			scope.eventsdata = [sampleEventsdatum];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/eventsdata\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleEventsdatum);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.eventsdata.length).toBe(0);
		}));
	});
}());