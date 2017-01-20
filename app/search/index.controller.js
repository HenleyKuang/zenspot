(function () {
    'use strict';

    angular
        .module('app')
        .controller('Search.IndexController', Controller);

    function Controller($window, $http, UserService, ParkingService, FlashService) {
			var vm = this;
			
			vm.parkings = null;
			vm.parkingslatlng = new Array();
			vm.showParkingOnMap = showParkingOnMap;
			
			//center on san francisco
			var centerLatLng = {lat: 37.757130, lng: -122.448728};
			
			var map = new google.maps.Map(document.getElementById('map'), {
				  zoom: 12,
				  center: centerLatLng
				});
			
			// get all parking spots in database
			ParkingService.GetAllParking()
			.then(function (parkings) {
				vm.parkings = parkings;
				
				parkings.forEach(displayMarkers);
				
				function displayMarkers(parking) {
					var address = parking.formatted_address;
					var geocoder = new google.maps.Geocoder();
					geocodeAddress(geocoder, map, address); //Create marker and reformat address
				}
				
				function geocodeAddress(geocoder, resultsMap, address) {
					geocoder.geocode({'address': address}, function(results, status) {
					  if (status === 'OK') {
						var marker = new google.maps.Marker({
						  map: resultsMap,
						  position: results[0].geometry.location
						});
						vm.parkingslatlng.push(marker);
					  } else {
						FlashService.Error('Geocode was not successful for the following reason: ' + status);
					  }
					});
				  }
				
			})
			.catch(function (error) {
				FlashService.Error(error);
			});
			
			var infoWindow = new google.maps.InfoWindow({map: map});
			infoWindow.close();
			
			function showParkingOnMap(index)
			{
				infoWindow.close();
				infoWindow.open(map);

				var pos = {
				  lat: vm.parkingslatlng[index].position.lat() + 0.005,
				  lng: vm.parkingslatlng[index].position.lng()
				};

				infoWindow.setPosition(pos);
				infoWindow.setContent(vm.parkings[index].formatted_address);
				map.setCenter(pos);
			}
    }

})();