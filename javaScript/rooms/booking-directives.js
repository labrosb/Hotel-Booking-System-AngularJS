(function()
{
	var app = angular.module('bookingApp');

	// Directive to show the shopping cart popup, only if there are elements inside
	app.directive('cartPopupShowDir', function() {
		return {
			restrict: 'E',
			scope: {
				cart: "="
			},
			template: false,		
			link: function(scope, element, attrs) 
				{
					element.bind('click', function() 
					{
						if(scope.cart.length > 0)
						{
							var cartPopup = angular.element(document.querySelector('#cartPopup'));
							cartPopup.removeClass();	
							cartPopup.removeAttr("style");
							cartPopup.addClass('zoomIn').show();							
						}
					});
				}			
		};  
	});
	
	// Directive to apply animations on the basket after an element is inserted successfully
	app.directive('updateBasketDir', function() {
		return {
			restrict: 'AEC',
			scope: {
				cart: "="
			},
			template: false,		
			link: function(scope, element, attrs) 
				{
					element.bind('click', function() 
					{
						var cartPopup = angular.element(document.querySelector('#cartPopup'));
						var basket = angular.element(document.querySelector('#basket'));
						var basketMsg = angular.element(document.querySelector('#basket-preview'));
						var differentRooms = scope.cart.length;
						
						if($(this).hasClass('removebtn')){
							differentRooms--;
						}
						
						if(differentRooms > 0)
						{
							basket.removeAttr("class");	
							basket.removeAttr("style");
							basket.addClass('rotate',function(){});	
							basketMsg.fadeIn();
						}
						else{
							cartPopup.fadeOut();
							basketMsg.fadeOut();
						}
					});
				}			
		};  
	});

	// Directive to check if the room num can be increased and shows error message
	app.directive('quantityDir', ['$timeout', function(timer) {
		return {
			restrict: 'AEC',
			scope: {
				cart: "=",
				pointer: "="
			},
			template: false,		
			link: function(scope, element, attrs) 
				{
					element.bind('click', function() 
					{			
				var test = angular.element(document.querySelector('#cartItems #room-'+scope.pointer+' .qnt'));	

						var errorSelector = '#cartItems #room-'+scope.pointer+' .errorMsg';
						var errorMsg = angular.element(document.querySelector(errorSelector));
						var roomQuantity = scope.cart[scope.pointer].quantity;
						var availability = scope.cart[scope.pointer].available;
						var hideBack = function(){
							errorMsg.fadeOut();
						}

						if(roomQuantity >= availability)
						{
							changeLang('en');
							errorMsg.fadeIn();
							timer(hideBack, 1500);
						}

					});
				}			
		};  
	}]);
	
	// On load directive to check if the cart has elements to show
	app.directive('onloadDir', ['$timeout', function(timer) {
		return {
			restrict: 'E',
			scope: {
				cart: "="
			},
			template: false,		
			link: function(scope, element, attrs) 
				{								
					var basketHandle = function()
					{
						var differentRooms = scope.cart.length;
						var basketMsg = angular.element(document.querySelector('#basket-preview'));

						if(differentRooms > 0)
						{
							basketMsg.fadeIn();
						}
						else{
							basketMsg.fadeOut();
						}
					}	
					timer(basketHandle, 1);

				}			
		};  
	}]);
})();
