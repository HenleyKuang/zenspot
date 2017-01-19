(function () {
    'use strict';

    angular
        .module('app')
        .controller('All_Parking.IndexController', Controller);

    function Controller($window, UserService, ParkingService, FlashService) {
			var vm = this;

			vm.parkings = null;
			
			initController();

			function initController() {
				// get all parking spots in database
				ParkingService.GetAllParking()
				.then(function (parkings) {
					vm.parkings = parkings;
				})
				.catch(function (error) {
					FlashService.Error(error);
				});
			}
    }

})();