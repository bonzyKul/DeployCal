'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$modal',
	function($scope, Authentication, $modal) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

        //var title;
        //var startDate;
        //var endDate;

        //$('#startDateTimepicker').datetimepicker();
        //$('#endDateTimepicker').datetimepicker();

        $scope.event = {title: "", startdate: "", endDate: ""};


        var updateEvent =  function(calEvent) {
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
                                title: calEvent.title,
                                startDate: calEvent.start,
                                endDate: calEvent.end
                            });
                        },
                        events: function() {
                            console.log("hello from events");
                            return $scope.event;
                        }
                    } // empty storage
                };


                //$scope.opts.resolve.item = function() {
                //    return angular.copy(
                //        {name: calEvent.title,
                //         startDate: calEvent.start,
                //         endDate: calEvent.end}
                //    ); // pass name to resolve storage
                //};

                var modalInstance = $modal.open($scope.opts);

                modalInstance.result.then(function(result){
                    calEvent.title = result.title;
                    calEvent.start = result.startDate;
                    calEvent.end = result.endDate;
                    $('#calendar').fullCalendar('updateEvent',calEvent,true);
                },function(){
                    //on cancel button press
                    console.log('Modal Closed');
                });
            } else {
                alert("Please sign in to Update an Event");
                $('#calendar').fullCalendar('unselect');
            }
            //var title = prompt('Event Title:');
            //if(title){
            //    calEvent.title = title;
            //    calEvent.color = 'blue';
            //}
        };

        var ModalInstanceCtrl = function($scope, $modalInstance, items) {

            $scope.event = items;


            $scope.ok = function () {
                $modalInstance.close($scope.event);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            //var updatedEvent = function(calEvent, item) {
            //    calEvent.title = item.name;
            //    calEvent.start = item.startDate;
            //    calEvent.end = item.endDate;
            //}
        };


        $scope.init = function($scope) {
            $('#calendar').fullCalendar({
                header: {
                  left: 'prev,next today',
                  center: 'title',
                  right: 'month,agendaWeek,agendaDay'
                },
                editable: true,
                selectable: true,
                businessHours: true,
                weekends: true,
                weekNumbers: true,
                droppable: true,
                select:addEvent,
                eventClick: updateEvent,
                eventLimit: true,
                events: [
                    {
                        title: 'All Day Event',
                        start: '2015-04-01'
                    },
                    {
                        title: 'Long Event',
                        start: '2015-04-07',
                        end: '2015-04-10'
                    },
                    {
                        id: 999,
                        title: 'Repeating Event',
                        start: '2015-04-09T16:00:00'
                    },
                    {
                        id: 999,
                        title: 'Repeating Event',
                        start: '2015-04-16T16:00:00'
                    },
                    {
                        title: 'Conference',
                        start: '2015-04-11',
                        end: '2015-04-13'
                    },
                    {
                        title: 'Meeting',
                        start: '2015-04-12T10:30:00',
                        end: '2015-04-12T12:30:00'
                    },
                    {
                        title: 'Lunch',
                        start: '2015-04-12T12:00:00'
                    },
                    {
                        title: 'Meeting',
                        start: '2015-04-12T14:30:00'
                    },
                    {
                        title: 'Happy Hour',
                        start: '2015-04-12T17:30:00'
                    },
                    {
                        title: 'Dinner',
                        start: '2015-04-12T20:00:00'
                    },
                    {
                        title: 'Birthday Party',
                        start: '2015-04-13T07:00:00'
                    },
                    {
                        title: 'Click for Google',
                        url: 'http://google.com/',
                        start: '2015-04-28'
                    },
                    {
                        start: '2015-04-24',
                        end: '2015-04-28',
                        overlap: false,
                        rendering: 'background',
                        color: '#ff9f89'
                    }
                ]
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
               }
               $('#calendar').fullCalendar('unselect');
           } else {
               //prompt("Please sign in to create an Event");
               alert("Please sign in to create an Event");
               $('#calendar').fullCalendar('unselect');
           }
        };
	}
]);
