﻿(function () {
    'use strict';

    angular
        .module('app')
        .controller('Account.IndexController', Controller);

    function Controller($window, UserService, FlashService) {
		if( $window.jwtToken !== undefined && $window.jwtToken != '')
		{
			var vm = this;

			vm.user = null;
			vm.saveUser = saveUser;
			vm.deleteUser = deleteUser;
			vm.getAll = getAll;

			initController();

			function initController() {
				// get current user
					UserService.GetCurrent().then(function (user) {
						vm.user = user;
					});
			}

			function saveUser() {
				UserService.Update(vm.user)
					.then(function () {
						FlashService.Success('User updated');
					})
					.catch(function (error) {
						FlashService.Error(error);
					});
			}

			function deleteUser() {
				UserService.Delete(vm.user._id)
					.then(function () {
						// log user out
						$window.location = '/login';
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