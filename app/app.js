(function () {
    'use strict';

    angular
        .module('app', ['ui.router'])
        .config(config)
        .run(run);


    function config($stateProvider, $urlRouterProvider) {
        // default route
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/index.html',
                controller: 'Home.IndexController',
                controllerAs: 'vm'
            })
			.state('dashboard', {
                url: '/dashboard',
                templateUrl: 'dashboard/index.html',
                controller: 'Dashboard.IndexController',
                controllerAs: 'vm'
            })
			.state('about', {
                url: '/about',
                templateUrl: 'about/index.html',
                controller: 'About.IndexController',
                controllerAs: 'vm'
            })
            .state('dashboard.account', {
                url: '/account',
                templateUrl: 'account/index.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm'
            })
			.state('dashboard.new_parking', {
                url: '/new_parking',
                templateUrl: 'new_parking/index.html',
                controller: 'New_Parking.IndexController',
                controllerAs: 'vm'
            })
			.state('dashboard.your_listings', {
                url: '/your_listings',
                templateUrl: 'your_listings/index.html',
                controller: 'Your_Listings.IndexController',
                controllerAs: 'vm'
            })
			.state('search', {
                url: '/search',
                templateUrl: 'search/index.html',
                controller: 'Search.IndexController',
                controllerAs: 'vm'
            });
    }
	
	function refreshToken()
	{
	  $.get('/app/token', function (token) {
		window.jwtToken = token;
	  });
	}

    function run($http, $rootScope, $window, UserService) {
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;
		
		if( window.jwtToken != undefined && window.jwtToken != '')
		{
			UserService.GetCurrent().then(function (user) {
						$rootScope.firstName = user.firstName;
			})
			.catch(function (error) {
						delete $window.jwtToken;
						//$window.location = '/login?returnUrl=' + encodeURIComponent('/app' + $window.location.hash);
					});;
		}
		
		//function to fixed footer location based on window size
		$rootScope.isActive = function () {
			//console.log($window.location.hash);
			//return ($window.location.hash === '#/') || ($window.location.hash === '');
			if( document.documentElement.clientHeight > document.documentElement.offsetHeight )
				return 'fixed-bottom';
			return 'flush-bottom';
		}

	   angular.element($window).bind('resize', function(){
		   var screenWidth = document.documentElement.clientWidth;
		   if (screenWidth <= 575){
				$('.dashboard-mobile').css('display', 'block');
			}
			else $('.dashboard-mobile').css('display', 'none');
		   
         if( document.documentElement.clientHeight > document.documentElement.offsetHeight )
		 {
			 $('.footer').removeClass('flush-bottom');
			$('.footer').addClass('fixed-bottom');
		 }
		 else 		
		{
			 $('.footer').removeClass('fixed-bottom');
			$('.footer').addClass('flush-bottom');
		 }
       });
		
		 
        // update active tab on state change
        //$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        //    $rootScope.activeTab = toState.data.activeTab;
        //});
    }
	
    // manually bootstrap angular after the JWT token is retrieved from the server
    $(function () {
        // get JWT token from server
        $.get('/app/token', function (token) {
            window.jwtToken = token;

            angular.bootstrap(document, ['app']);
        });
    });
})();