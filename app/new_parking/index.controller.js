(function () {
    'use strict';

    angular
        .module('app')
        .controller('Account.IndexController', Controller);

    function Controller($window, ParkingService, FlashService) {
		if( $window.jwtToken !== undefined && $window.jwtToken != '')
		{
			var vm = this;

			vm.user = null;
			vm.addParking = addParking;

			function addParking() {
				ParkingService.Create(vm.user)
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