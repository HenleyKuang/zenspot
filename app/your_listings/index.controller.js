(function () {
    'use strict';

    angular
        .module('app')
        .controller('Your_Listings.IndexController', Controller);

    function Controller($window, UserService, ParkingService, FlashService) {
		if( $window.jwtToken !== undefined && $window.jwtToken != '')
		{
			var vm = this;

			//get current user
			vm.user = null;
			vm.parking = null;
			vm.loading = true;
			
			vm.days = ['Sun', 'Mon', 'Tue', 
				'Wed', 'Thu', 'Fri', 'Sat'];
				
			vm.days_selected = new Array();
				
			vm.changeColor = changeColor;
			
			function changeColor( index ) {
				vm.parking.days_selected[index] = vm.parking.days_selected[index] ? false : true;
			}
			
			vm.times = ['15 minutes', '30 minutes', '45 minutes', '60 minutes'];
			
			vm.deleteParking = deleteParking;
			
			function deleteParking (index) {
					console.log(vm.parkings);
					console.log(index);
					console.log(vm.parkings[index]._id);
					ParkingService.Delete(vm.parkings[index]._id)
					.then(function () {
						FlashService.Success('Parking spot deleted!');
						delete vm.parkings[index];
					})
					.catch(function (error) {
						FlashService.Error(error);
					});
			}
			
			vm.modifyParking = modifyParking;
			
			function modifyParking(index) {
				vm.parking = vm.parkings[index];
			}
			
			vm.saveModify = saveModify;
			
			function saveModify () {
					ParkingService.Update(vm.parking)
					.then(function () {
						FlashService.Success('Parking spot updated!');
					})
					.catch(function (error) {
						FlashService.Error(error);
					});
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
					console.log(vm.parkings);
				})
				.finally(function () {
					vm.loading = false;
				});	
			});	
		}
	}

})();