(function () {
    'use strict';

    angular
        .module('app')
        .controller('Dashboard.IndexController', Controller);

    function Controller($rootScope, $window, UserService, FlashService) {
		if( $window.jwtToken !== undefined && $window.jwtToken != '')
		{
			$(".nav a").on("click", function(){
			   $(".nav").find(".active").removeClass("active");
			   $(this).addClass("active");
			});
			
			$rootScope.iFade = true;
			//set active based on href
			var loc_array = $window.location.hash.split("/");
			var loc = loc_array[loc_array.length-1];
			  $('nav a[ui-sref^=".' + loc + '"]').addClass('active');
		}
			else
				$window.location = '/login?returnUrl=' + encodeURIComponent('/app' + $window.location.hash);
    }

})();