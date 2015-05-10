'use strict';

// Eventsdata controller
angular.module('eventsdata').controller('EventsdataController', ['$scope', '$stateParams', '$location', 'Authentication', 'Eventsdata',
	function($scope, $stateParams, $location, Authentication, Eventsdata) {
		$scope.authentication = Authentication;

        $scope.openStart = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openedStart = true;
        };

        $scope.openEnd = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openedEnd = true;
        };


		// Create new Eventsdatum
		$scope.create = function() {
			// Create new Eventsdatum object
			var eventsdatum = new Eventsdata ({
				name: this.title,
                startDate: this.startDate,
                endDate: this.endDate,
                overlap: this.eventFreeze,
                color: this.eventColor
			});

            console.log(this.eventFreeze);

			// Redirect after save
			eventsdatum.$save(function(response) {
				//$location.path('eventsdata/' + response._id);

				// Clear form fields
				$scope.title = '';
                $scope.startDate = '';
                $scope.endDate = '';
                $scope.eventFreeze = '';
                $scope.eventColor = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Eventsdatum
		$scope.remove = function(eventsdatum) {
			if ( eventsdatum ) { 
				eventsdatum.$remove();

				for (var i in $scope.eventsdata) {
					if ($scope.eventsdata [i] === eventsdatum) {
						$scope.eventsdata.splice(i, 1);
					}
				}
			} else {
				$scope.eventsdatum.$remove(function() {
					$location.path('eventsdata');
				});
			}
		};

		// Update existing Eventsdatum
		$scope.update = function() {
			var eventsdatum = $scope.eventsdatum;

			eventsdatum.$update(function() {
				$location.path('eventsdata/' + eventsdatum._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Eventsdata
		$scope.find = function() {
			$scope.eventsdata = Eventsdata.query();
		};

		// Find existing Eventsdatum
		$scope.findOne = function() {
			$scope.eventsdatum = Eventsdata.get({ 
				eventsdatumId: $stateParams.eventsdatumId
			});
		};
	}
]);
