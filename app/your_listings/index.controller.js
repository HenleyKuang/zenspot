(function () {
    'use strict';

    angular
        .module('app')
        .controller('Your_Listings.IndexController', Controller);

    function Controller($window, $scope, UserService, ParkingService, FlashService) {
		if( $window.jwtToken !== undefined && $window.jwtToken != '')
		{
			var vm = this;

			//get current user
			vm.user = null;
			vm.parking = null;
			vm.loading = true;
			var modifyIndex = 0;
			
			vm.days = ['Sun', 'Mon', 'Tue', 
				'Wed', 'Thu', 'Fri', 'Sat'];
			
			vm.changeColor = changeColor;			
			function changeColor( index ) {
				vm.parking.days_selected[index] = vm.parking.days_selected[index] ? false : true;
			}
			
			vm.times = ['15 minutes', '30 minutes', '45 minutes', '60 minutes'];
			
			vm.deleteParking = deleteParking;			
			function deleteParking (index) {
					ParkingService.Delete(vm.parkings[index]._id)
					.then(function () {
						FlashService.Success('Parking spot deleted!');
						vm.parkings.splice(vm.parkings.indexOf(index), 1);
					})
					.catch(function (error) {
						FlashService.Error(error);
					});
			}
			
			vm.modifyParking = modifyParking;	
			function modifyParking(index) {
				vm.parking = $.extend(true,{},vm.parkings[index]);
				modifyIndex = index;
				
				//should be an unnecessary check once we launch, this is only cause some entries in the database doesn't have hours_selected field
				if( !vm.parking.hours_selected )
					vm.parking.hours_selected = new Array(7);
				
				vm.parking.days_selected.forEach(function (day, index) {
					if( day )
					{
						if( vm.parking.hours_selected[index] && vm.parking.hours_selected[index].start_time && vm.parking.hours_selected[index].end_time )
						{
							var startTotalMinutes = vm.parking.hours_selected[index].start_time;
							var endTotalMinutes = vm.parking.hours_selected[index].end_time;

							var startHours = Math.floor(startTotalMinutes / 60);
							var startMinutes = startTotalMinutes % 60;

							var endHours = Math.floor(endTotalMinutes / 60);
							var endMinutes = endTotalMinutes % 60;
							
							var options = {
								now: startHours + ':' + startMinutes, //hh:mm 24 hour format only, defaults to current time
								twentyFour: false //Display 24 hour format, defaults to false
							};
							var parentelem1 = $('#timestart-' + index).parent();
							var elem1 = $('#timestart-' + index).remove();
							parentelem1.prepend(elem1);
							$('#timestart-' + index).wickedpicker(options);
							
							var parentelem2 = $('#timeend-' + index).parent();
							var elem2 = $('#timeend-' + index).remove();
							parentelem2.prepend(elem2);
							var options2 = {
								now: endHours + ':' + endMinutes, //hh:mm 24 hour format only, defaults to current time
								twentyFour: false  //Display 24 hour format, defaults to false
							};
							$('#timeend-' + index).wickedpicker(options2);
						}
					}
				});
				
				
				var options = {
					now: "8:00", //hh:mm 24 hour format only, defaults to current time
					twentyFour: false //Display 24 hour format, defaults to false
				};
				$('.t-start').wickedpicker(options);
				var options2 = {
					now: "17:00", //hh:mm 24 hour format only, defaults to current time
					twentyFour: false  //Display 24 hour format, defaults to false
				};
				$('.t-end').wickedpicker(options2);
			}
			
			vm.saveModify = saveModify;			
			function saveModify () {
					var badAvailability = false;
				
					vm.parking.hours_selected = new Array(7);
					vm.parking.days_selected.forEach(function(day, index) {
						if( day && !badAvailability )
						{
							var startTime = $('#timestart-' + index).val().split(' ');
							if( startTime[3] == 'AM' && startTime[0] == '12')
								startTime[0] = 0;
							var startMinute = startTime[0]*60 + parseInt(startTime[2]);
							if( startTime[3] == 'PM' && startTime[0] != '12')
								startMinute += 720;
							
							var endTime = $('#timeend-' + index).val().split(' ');
							if( endTime[3] == 'AM' && endTime[0] == '12')
								endTime[0] = 0;
							var endMinute = endTime[0]*60 + parseInt(endTime[2]);
							if( endTime[3] == 'PM' && endTime[0] != '12' )
								endMinute += 720;
							
							if( startMinute >= endMinute )
								badAvailability = true;
							else 
							{
								var time = {
									start_time: startMinute,
									end_time: endMinute
								};
								vm.parking.hours_selected[index] = time;
							}
						}
					});
					
					if( !badAvailability )
					{
						ParkingService.Update(vm.parking)
						.then(function () {
							$('.carousel').carousel('prev');
							FlashService.Success('Parking spot updated!');
							vm.parkings[modifyIndex] = $.extend(true,{}, vm.parking);
						})
						.catch(function (error) {
							FlashService.Error(error);
						});
					}
					else FlashService.Error('Error: Your availabilty must have an end time that is greater than the start time.');
			}
			
			vm.parkings = new Array();
			UserService.GetCurrent().then(function (user) {
				var query = {
					uid: user._id
				};
				ParkingService.SearchParking(query).then(function(parkings)
				{
					parkings.forEach(pushIntoParkingsArray);
					
					function pushIntoParkingsArray(spot) {
						vm.parkings.push(spot);
					}
				})
				.finally(function () {
					vm.loading = false;
				});	
			});	
		}
	}

})();