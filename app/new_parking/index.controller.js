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
			
			vm.loading = false;
			vm.addedMsg = false;
			vm.clickYourSpots = clickYourSpots;
			
			function clickYourSpots () {
				$(".nav-link[ui-sref='.your_listings']").click();
			}
			
			UserService.GetCurrent().then(function (user) {
						vm.user = user;
					});
			
			vm.days = ['Sun', 'Mon', 'Tue', 
				'Wed', 'Thu', 'Fri', 'Sat'];
				
			vm.days_selected = new Array();
				
			vm.changeColor = changeColor;
			
			function changeColor( index ) {
				vm.days_selected[index] = vm.days_selected[index] ? false : true;
			}
			
			vm.times = ['15 minutes', '30 minutes', '45 minutes', '60 minutes'];
			
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
			
			autocomplete.addListener('place_changed', function() {
			  var place = autocomplete.getPlace();
			  if (place.geometry) {
				address_box.value = place.formatted_address;
				vm.parking.address = place.formatted_address;
			  }
			});
			
			vm.addParking = addParking;

			function addParking() {	
				if( vm.parking !== undefined )
				{
					vm.loading =true;
					var address = vm.parking.address;
					var geocoder = new google.maps.Geocoder();
					formatAddress(geocoder, address);

					function formatAddress(geocoder, address) {
						geocoder.geocode({'address': address}, function(results, status) {
						  if (status === 'OK') {	
							//console.log(results[0]);
							/* this part needs to be recoded to traverse address component types 
								currently hard-coded indexes */
							if( results[0].address_components[0].types[0] != 'street_number' )
								var add = 1;
							else add = 0;
							
							vm.parking.formatted_address = results[0].formatted_address;
							//vm.parking.zip = results[0].address_components[7 + add].short_name;
							//vm.parking.state = results[0].address_components[5 + add].short_name;
							//vm.parking.city = results[0].address_components[3 + add].long_name;
							//vm.parking.short_address = results[0].address_components[0 + add].long_name
							//	+ ' ' + results[0].address_components[1 + add].long_name;
							/* end of part that needs to be recoded */
							
							vm.parking.days_selected = vm.days_selected;
							
							vm.parking.uid = vm.user._id;
							
							ParkingService.Create(vm.parking)
							.then(function (doc) {
									vm.addedMsg = true;
									vm.loading = false;
									FlashService.Success('Parking spot added!');
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
    }

})();