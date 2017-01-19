(function () {
    'use strict';

    angular
        .module('app')
        .controller('New_Parking.IndexController', Controller);

    function Controller($window, UserService, ParkingService, FlashService) {
		if( $window.jwtToken !== undefined && $window.jwtToken != '')
		{
			var vm = this;

			vm.addParking = addParking;

			function addParking() {
				ParkingService.Create(vm.parking)
					.then(function () {
						FlashService.Success('Parking spot added!');
					})
					.catch(function (error) {
						FlashService.Error(error);
					});
			}
		}
			else
				$window.location = '/login?returnUrl=/app/#/account';
    }

})();