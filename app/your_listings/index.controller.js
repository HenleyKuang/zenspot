﻿(function () {
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
			vm.parkings = new Array();
			UserService.GetCurrent().then(function (user) {
				vm.user = user;
				UserService.getUserLinks(vm.user).then(function(parkings)
				{
					parkings.forEach(getParkingInformation);
					
					function getParkingInformation(parking){
						var pid = parking._pid;
						
						//get parking information by parking id
						var query = {
							_id: pid
						};
						
						ParkingService.SearchParking( query )
						.then(function (parking_details) {
							vm.parkings.push(parking_details);
						});
					}
				});	
			});	
		}
	}

})();