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
			UserService.GetCurrent().then(function (user) {
				vm.user = user;
				UserService.getUserLinks(vm.user).then(function(parkings)
				{
					parkings.forEach(getParkingInformation);
					
					function getParkingInformation(parking){
						var pid = parking._pid;
						console.log(pid);
						
						//get parking information by parking id
						var query = {
							_id: pid
						};
						
						ParkingService.SearchParking( query )
						.then(function (parking_details) {
							console.log(parking_details);
						});
					}
				});	
			});	
		}
	}

})();