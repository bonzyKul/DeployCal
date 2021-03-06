'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$modal', 'Eventsdata', '$http',
	function($scope, Authentication, $modal, Eventsdata, $http) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

        $scope.event = {title: '', startdate: '', endDate: '', overlap: true, rendering: '', color: '', deleteEvent: '', deployment: ''};

        $scope.events = [];

        var updateEvent =  function(event) {
            if ($scope.authentication.user) {
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    headerText: 'Update Event',
                    templateUrl : '/modules/core/views/modal.client.view.html',
                    controller : ModalInstanceCtrl,
                    scope: $scope,
                    resolve: {
                        items: function() {
                            return angular.copy({
                                title: event.title,
                                startDate: event.start,
                                endDate: event.end,
                                deployment: event.deployment
                            });
                        }
                    } // empty storage
                };

                console.log(event.id);
                console.log(event.deployment);

                var modalInstance = $modal.open($scope.opts);

                modalInstance.result.then(function(result){
                    if(result.deleteEvent === 'Y'){
                        //console.log('delete pressed');
                        var eventsdatumId = event.id;

                        $http.delete('/eventsData/' + eventsdatumId).success(function(status){
                            //console.log(eventsdatumId);
                            $('#calendar').fullCalendar('removeEvents',eventsdatumId);
                        }).error(function(errorResponse) {
                           console.log(errorResponse);
                        });
                    } else {
                        event.title = result.title;
                        event.start = result.startDate;
                        event.end = result.endDate;
                        event.deployment = result.deployment;
                        var deployment = result.deployment;
                        if(deployment) {
                            event.color = '#085c1b';
                        }
                        var eventsdatumId = event.id;
                        var eventsdatum = {
                            name: event.title,
                            startDate: event.start,
                            endDate: event.end,
                            color: event.color,
                            deployment: deployment
                        };
                        $http.put('/eventsdata/' + eventsdatumId, eventsdatum).success(function(status) {
                           if(status) {
                               $('#calendar').fullCalendar('updateEvent',event,true);
                           }
                        }).error(function(errorResponse){
                           console.log(errorResponse);
                        });
                    }
                },function(){
                    //on cancel button press
                });
            } else {
                alert('Please sign in to Update an Event');
                $('#calendar').fullCalendar('unselect');
            }
        };

        var ModalInstanceCtrl = function($scope, $modalInstance, items) {

            $scope.event = items;


            $scope.ok = function () {
                $modalInstance.close($scope.event);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.delete = function() {
                $scope.event.deleteEvent = 'Y';
                $modalInstance.close($scope.event);
            }
        };

     var createEvent = function(start, end) {
        if ($scope.authentication.user) {
            $scope.opts = {
                backdrop: true,
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                headerText: 'Add Event',
                templateUrl : '/modules/eventsdata/views/create-eventsdatum.client.view.html',
                controller : CreateModalInstanceCtrl,
                resolve: {
                    items: function() {
                        return angular.copy({
                            startDate: start,
                            endDate: end
                        });
                    }
                } // empty storage
            };

            var modalInstance = $modal.open($scope.opts);

            modalInstance.result.then(function(result){
                //console.log(result);
                if(result.eventFreeze) {
                    result.rendering = 'background';
                } else {
                    result.rendering = '';
                }
                var eventsdatum = new Eventsdata ({
                    name: result.title,
                    startDate: result.startDate,
                    endDate: result.endDate,
                    overlap: !result.eventFreeze,
                    rendering: result.rendering,
                    color: result.eventColor
                });
                $http.post('/eventsdata',eventsdatum).success(function(status){
                    //console.log(status);
                    findOne(status._id);
                }). error(function(errorResponse) {
                    console.log(errorResponse);
                });
            },function(){
                //on cancel button press
            });
        } else {
            alert('Please sign in to create an Event');
            $('#calendar').fullCalendar('unselect');
        }
    };

    var CreateModalInstanceCtrl = function($scope, $modalInstance, items) {

        $scope.event = items;

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



        $scope.ok = function () {
            //events();
            $modalInstance.close($scope.event);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

var findOne = function(eventsdatumId) {
    $http.get('/eventsdata/' + eventsdatumId).success(function(data) {
        $scope.events = {id: data._id, title: data.name, start: data.startDate, end: data.endDate,overlap: data.overlap,rendering: data.rendering, color: data.color,deployment: data.deployment,allDay: true};
        $('#calendar').fullCalendar('renderEvent', $scope.events, true); // stick? = true
    }).error(function() {
        alert('an unexpected error occured');
    });
}

        //retrieve events
var events = function() {
            $http.get('/eventsdata').success(function(data) {
                for(var i = 0; i < data.length; i++) {
                    $scope.events[i] = {id: data[i]._id, title: data[i].name, start: data[i].startDate, end: data[i].endDate,overlap: data[i].overlap,rendering: data[i].rendering,color: data[i].color, deployment: data[i].deployment,allDay: true};
                    //console.log($scope.events[i]);
                    $('#calendar').fullCalendar('renderEvent', $scope.events[i], true); // stick? = true
                }
            }).error(function() {
               alert('an unexpected error occured');
            });
        };

        $scope.init = function() {
            events();
            $('#calendar').fullCalendar({
                header: {
                  left: 'prev,next today',
                  center: 'title',
                  right: 'month,agendaWeek,agendaDay'
                },
                editable: $scope.authentication.user || false,
                selectable: true,
                selectHelper: true,
                businessHours: true,
                weekends: true,
                weekNumbers: true,
                height: 680,
                droppable: true,
                events: $scope.event,
                eventDrop: function(event, delta, revertFunc) {
                    if($scope.authentication.user) {
                        var eventsdatumId = event.id;
                        console.log(event.deployment);
                        var eventsdatum = {
                            startDate: event.start,
                            endDate: event.end
                        };
                        $http.put('/eventsdata/' + eventsdatumId, eventsdatum).success(function(status) {
                            //console.log(status);
                        }).error(function(errorResponse){
                            console.log(errorResponse);
                        });
                    }
                },
                select:createEvent,
                eventClick: updateEvent,
                eventLimit: true,
                eventRender: function(event, element) {
                    element.qtip({
                        content: event.title,
                        style: {
                            tip: {
                                corner: true,
                                height: 24
                            }
                        },
                        show: {
                            effect: function(offset) {
                                $(this).slideDown(150); // "this" refers to the tooltip
                            }
                        }
                    });
                }
            });

        };


        /* add custom event*/
       var addEvent = function(start, end) {
           if($scope.authentication.user){
               var title = prompt('Event Title:');
               var eventData;
               if (title) {
                   eventData = {
                       title: title,
                       start: start,
                       end: end
                   };
                   $('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
                   $scope.events.push({
                      title: title,
                       start: start,
                       end: end
                   });

               }
               $('#calendar').fullCalendar('unselect');
           } else {
               alert('Please sign in to create an Event');
               $('#calendar').fullCalendar('unselect');
           }
        };
	}
]);
