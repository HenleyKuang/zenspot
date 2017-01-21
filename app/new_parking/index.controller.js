(function () {
    'use strict';

    angular
        .module('app')
        .controller('New_Parking.IndexController', Controller);

    function Controller($window, UserService, ParkingService, FlashService) {
		if( $window.jwtToken !== undefined && $window.jwtToken != '')
		{
			var vm = this;

			//get current user
			vm.user = null;
			UserService.GetCurrent().then(function (user) {
						vm.user = user;
					});
			
			// Custom drop down list using google's autocomplete api
			/* 
			var service = new google.maps.places.AutocompleteService();
            var address_box = document.getElementById('address');
			address_box.oninput = getPredictions;
			
			var displaySuggestions = function(predictions, status) {
			  if (status != google.maps.places.PlacesServiceStatus.OK) {
				FlashService.Error(status);
				return;
			  }
			  
			  var dropdownNode = document.getElementById('addrdropdown');
				while (dropdownNode.firstChild) {
					dropdownNode.removeChild(dropdownNode.firstChild);
}

			  predictions.forEach(function(prediction) {
				var li = document.createElement('li');
				li.appendChild(document.createTextNode(prediction.description));
				dropdownNode.appendChild(li);
			  });
			};
			
			function getPredictions(){
				var address_text = $('#address').val()
				console.log(address_text);
				service.getQueryPredictions({ input: address_text }, displaySuggestions);
			}
			*/
				
			var address_box = document.getElementById('address');
			var autocomplete = new google.maps.places.Autocomplete(address_box);
			
			address_box.oninput = removeLogo;
			
			function removeLogo() {
				$('.pac-container').removeClass('pac-logo');
			}
			
			vm.addParking = addParking;

			function addParking() {	
				var address = vm.parking.address + ", " + vm.parking.city + ", " + vm.parking.state;
				var geocoder = new google.maps.Geocoder();
				formatAddress(geocoder, address);

				function formatAddress(geocoder, address) {
					geocoder.geocode({'address': address}, function(results, status) {
					  if (status === 'OK') {					
						vm.parking.formatted_address = results[0].formatted_address;
						
						ParkingService.Create(vm.parking)
						.then(function (doc) {
							var parking_id = doc.insertedIds[0];
							UserService.LinkUserParking(vm.user, parking_id)
							.then(function () {
								FlashService.Success('Parking spot added!');
							})
							.catch(function (error) {
								FlashService.Error(error);
							});
						})
						.catch(function (error) {
							FlashService.Error(error);
						});
						
					  } else {
						FlashService.Error('Format Address was not successful. The following error occurred: ' + status);
					  }
					});
				  }
			}
		}
    }

})();