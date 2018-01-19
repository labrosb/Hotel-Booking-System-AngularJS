(function()
{
	var app = angular.module('bookingApp');
	
	app.controller('booking-controller', function ($scope, roomDataService, timeService, cartService) 
	{   
		// Date and guest input values are passed but not used
		// because the dataset is fixed
		$scope.search = {fromDate: null, toDate: null};
		$scope.filter = {};
		$scope.filter.guests = 1;
		$scope.filter.types = {single: false, double: false, twin: false, triple: false, suite: false};
		$scope.filter.priceRange = {from: 0, to: 500};
		$scope.filter.sizeRange = {from: 0, to: 150};
		$scope.currentSearch = {};
		$scope.shoppingCart = [];
		$scope.rooms = null;
		console.log(checkLocalStorage("cartData"));
		// Retreiving cart data from local storage
		try {
			$scope.shoppingCart = JSON.parse(checkLocalStorage("cartData"));
		} 
		catch(e) {
			localStorage.removeItem("cartData");
		}
		
		var vm = this;		  
		vm.cart = $scope.shoppingCart;
		
		roomDataService.getData()
		.then(function(response)
			{	
				$scope.rooms = roomDataService.optimizeData(response.data.Rooms);
			},
			function()
			{
				// errorcallback
			});   
					
		$scope.startSearch = function () 
		{				
			if($scope.search.fromDate != null && $scope.search.toDate != null)
			{	
				roomDataService.getData()
				.then( function(response)
				{	
					$scope.rooms = roomDataService.optimizeData(response.data.Rooms);
				},
				function()
				{
				  // errorcallback
				});   
					
				// Saving variables needed for the next search and might be overwritten
				$scope.currentSearch.fromDate = $scope.search.fromDate;
				$scope.currentSearch.toDate = $scope.search.toDate;
				$scope.currentSearch.duration = timeService.getDuration($scope.search.fromDate , $scope.search.toDate);

			}				
		}
		// Main controller functions - Calling services - Updating local storage
		$scope.addToCart = function (roomType, roomsNum, roomPrice) 
		{	
			var roomObject = {type: roomType,  quantity: 1, available: roomsNum, price: roomPrice, 
								fromDate: $scope.currentSearch.fromDate, duration: $scope.currentSearch.duration};
				
			$scope.shoppingCart = cartService.addRoom($scope.shoppingCart, roomObject);					
			// Variable to be userd on the view-directives
			localStorageSave("cartData", $scope.shoppingCart);
			vm.cart = $scope.shoppingCart;
		}	
		
		$scope.increaseQuantity = function (roomPointer) 
		{	
			$scope.shoppingCart = cartService.increaseRoomQnt($scope.shoppingCart, roomPointer);		
			localStorageSave("cartData", $scope.shoppingCart);
			vm.cart = $scope.shoppingCart;
		}
		
		$scope.decreaseQuantity = function (roomPointer) 
		{	
			$scope.shoppingCart = cartService.decreaseRoomQnt($scope.shoppingCart, roomPointer);
			localStorageSave("cartData", $scope.shoppingCart);
			vm.cart = $scope.shoppingCart;
		}	

		$scope.removeRooms = function (roomPointer) 
		{	
			$scope.shoppingCart = cartService.removeRoom($scope.shoppingCart, roomPointer);
			localStorageSave("cartData", $scope.shoppingCart);
			vm.cart = $scope.shoppingCart;
		}		
	});
	
	// Updates local storage cart
	function localStorageSave(category, data)
	{	
		if (typeof(Storage) !== "undefined") {		
			localStorage.setItem(category, JSON.stringify(data));
		}	
	}
	
	// Retrieves local storage cart variable
	function checkLocalStorage(category)
	{
		if (typeof(Storage) !== "undefined" && localStorage.getItem(category) !== null) 
		{
			return localStorage.getItem(category);
		}	
		else{
			return [];
		}	
	}
	
})();