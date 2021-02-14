'use strict';

angular.module('app')
.config(function($stateProvider) {
	$stateProvider

		.state('root.order_transaction', {
			url: 'payment/:trans',
			views: {
				'container@': {
					templateUrl: 'scripts/checkout/order_placed.html',
					controller: 'OrderPlacedCtrl'
				}
			}
		})
})
.controller('OrderPlacedCtrl',function($scope, $rootScope, $state,USER,$localStorage,$stateParams,DATA,API,LANGUAGE,$window){
	$scope.is_user = USER.id();
	$scope.trans = $stateParams.trans;
	$scope.checkout = 1;//used not to show the reorder button in included order.html
	$rootScope.page_title = ''

	if($stateParams.trans){
			API.get('/orders?transaction__number='+$stateParams.trans).then(function(r){
				$scope.order = r[0];
				$scope.transaction = $scope.order.transaction
			});
	}

	$scope.can_retry = true
	$scope.retry_payment = function(){
		$scope.can_retry = false
		if($scope.order.ad){
			API.post('/ad-retry-payment', {pk:$scope.order.ad.id}).then(function(r){
				if(r.data.payment_url && r.data.payment_url!=''){
					window.location = r.data.payment_url;
				}
			}, function(r){
				NOTIFIER.error(gettextCatalog.getString('Checkout'), gettextCatalog.getString('We could not reach the payment gateway.'))
				$scope.can_retry = true;
			})

		} else {
			API.post('/auction-retry-payment', {pk:$scope.order.auction.id}).then(function(r){
				if(r.data.payment_url && r.data.payment_url!=''){
					window.location = r.data.payment_url;
				}
			}, function(r){
				NOTIFIER.error(gettextCatalog.getString('Checkout'), gettextCatalog.getString('We could not reach the payment gateway.'))
				$scope.can_retry = true;
			})
		}
	}

})

