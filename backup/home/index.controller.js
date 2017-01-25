(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller($window, UserService) {
        var vm = this;

/*         vm.user = null;

			if( window.jwtToken !== null )
			{
			initController();

			function initController() {
				// get current user
				UserService.GetCurrent().then(function (user) {
					vm.user = user;
				});
				}
			} */
	}
})();