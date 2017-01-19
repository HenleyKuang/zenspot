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
			.state('about', {
                url: '/about',
                templateUrl: 'about/index.html',
                controller: 'About.IndexController',
                controllerAs: 'vm'
            })
            .state('account', {
                url: '/account',
                templateUrl: 'account/index.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm'
            })
			.state('new_parking', {
                url: '/new_parking',
                templateUrl: 'new_parking/index.html',
                controller: 'New_Parking.IndexController',
                controllerAs: 'vm'
            })
			.state('all_parking', {
                url: '/all_parking',
                templateUrl: 'all_parking/index.html',
                controller: 'All_Parking.IndexController',
                controllerAs: 'vm'
            });
    }

    function run($http, $rootScope, $window, UserService) {
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;
		
		if( $window.jwtToken !== undefined && $window.jwtToken != '')
		{
			UserService.GetCurrent().then(function (user) {
						//console.log(user);
						$rootScope.firstName = user.firstName;
						//console.log('user set: ' + $rootScope.firstName ); 
			});
		}
		
		//function to fixed footer location based on window size
		$rootScope.isActive = function () {
			//console.log($window.location.hash);
			//return ($window.location.hash === '#/') || ($window.location.hash === '');
			if( document.documentElement.clientHeight > document.documentElement.offsetHeight )
				return true;
			return false;
		}  
		
		$rootScope.navitems = [
        {caption: 'About', condition: '!firstName', href: '/app/#/about'},
        {caption: 'Sign Up', condition: '!firstName', href: '/register'},
        {caption: 'Login', condition: '!firstName', href: '/login'},
		{caption: $rootScope.firstName, condition: 'firstName', href: '/app/#/account'},
		{caption: 'Logout', condition: 'firstName', href: '/logout'}
    ];
		
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