'use strict';

angular.module('app')
.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('root.home', {
			url: '',
			views: {
				'container@': {
					controller: 'homeCtrl',
					templateUrl: 'scripts/home/home.html'
				}
			}
		});
})
.controller('homeCtrl', function($scope, $filter, $q, COUNTRIES, PagerService, NOTIFIER, $timeout, $rootScope, $localStorage,  API, $state, DATA, gettextCatalog, $location) { // as home

	$("html, body").animate({scrollTop: 0}, 1000);
	$rootScope.page_title = gettextCatalog.getString('Home');
	$rootScope.page_id = 0
    $scope.products = []
    $scope.items = []
    $scope.recent_items = []
	var df = $q.defer();
	var promises = [];
	

	console.log($location.search())

	$scope.number_of_products = 12
    $scope.pager = {};



    $scope.increasePage = function(){
		var df = $q.defer();
		var promises = [];
    	promises.push(API.getAllNoDmain(DATA.get("_home_ads")['next'], '_home_ads'));
		$q.all(promises).then(function(){
			df.resolve();
			$scope.products = $scope.products.concat(DATA.get("_home_ads")['results']);
			$scope.items = $scope.products


		})


    }

	function fetch_info(promises){
		
			
		promises.push(API.getAll('/ads?page_size=25&featured=True&home_featured=True&country='+$localStorage['country'], '_home_ads'));

		if($location.search().auction){
			promises.push(API.get('/auctions/'+$location.search().auction, '_notification_auction'));
		}

		if(!DATA.get("_slides")){
			if ($rootScope.is_mobile){
				promises.push(API.getAll('/slides?slide_type=2&slide_type=1&section=0&section=2', '_slides'));
			} else {

				promises.push(API.getAll('/slides?slide_type=2&slide_type=0&section=0&section=2', '_slides'));
			}
			
		}

		if(!DATA.get('_home_website_ads')){
			promises.push(API.getAll('/website-ads?place=0&place=1', '_home_website_ads'));
		}
		if(!DATA.get('_recent_ads')){
			promises.push(API.getAll('/ads?page_size=25&country='+$localStorage['country'], '_recent_ads'));
		}
	}

	$scope.$watch(function(){
	  return $localStorage['country'];
	}, function(newCodes, oldCodes){

		if(newCodes != oldCodes){
				var df = $q.defer();
				var promises = [];
				promises.push(API.getAll('/ads?page_size=25&featured=True&home_featured=True&country='+$localStorage['country'], '_home_ads'));
				promises.push(API.getAll('/ads?page_size=25&country='+$localStorage['country'], '_recent_ads'));
				$q.all(promises).then(function(){
					df.resolve();
					$scope.products = DATA.get('_home_ads')['results']
					$scope.items = $scope.products
					$scope.recent_products = DATA.get('_recent_ads')['results']
					$scope.recent_items = $scope.recent_products

				});	
		}
	})


	fetch_info(promises)

	function init_slider(){
        jQuery("#slider-hdr-7").revolution({
            sliderType: "standard",
            sliderLayout: "auto",
            disableProgressBar: "on",
            delay: 5000,
            navigation: {
                onHoverStop: "off",
                arrows: {enable: true},
                bullets: {
                	enable: true,
                	container: 'slider',
                	h_align: 'center',
                	v_align: 'bottom',
                	h_offset: 0,
                	v_offset: 20,
                	space: 5,
                	hide_onleave: false,
                }
            },
            responsiveLevels: [1170, 800, 600, 480],
            gridwidth: [1120, 750, 500, 450],
            gridheight: [365, 365, 365, 365]
        });
	}

	
	if(promises.length > 0){
		$q.all(promises).then(function(){
			df.resolve();
			$scope.products = DATA.get('_home_ads')['results']
			$scope.items = $scope.products
			$scope.recent_products = DATA.get('_recent_ads')['results']
			$scope.recent_items = $scope.recent_products

			if(DATA.get('_notification_auction')){
				if($location.search().approve){
					delete $location.$$search.approve;
					NOTIFIER.success(DATA.get('_notification_auction').name, gettextCatalog.getString('Auction closed and bidder notified.'))
				}
				if($location.search().reject){
	        		delete $location.$$search.reject;
					NOTIFIER.success(DATA.get('_notification_auction').name, gettextCatalog.getString('Auction closed.'))
				}
			delete $location.$$search.auction;
	        $location.$$compose();
			}
			console.log(DATA.get('_notification_auction'))
			$timeout(function(){
				init_slider()
			}, 500)
		});
	} else {
		$scope.products = DATA.get('_home_ads')['results']
		$scope.items = $scope.products
		$scope.recent_products = DATA.get('_recent_ads')['results']
		$scope.recent_items = $scope.recent_products
		$timeout(function(){
			init_slider()

		}, 1500)

	}

	$scope.redirect_product = function(product){
		if(!product.subcategory){
			$state.go('root.category_product_detail', {id:product.category.slug, product_id:product.id})
		}
		if(product.sub_subcategory){
			$state.go('root.sub_product_detail', {id:product.category.slug, sub_id:product.subcategory.slug,
											sub_sub_id:product.sub_subcategory.slug, product_id:product.id})
		} else {
			$state.go('root.product_detail', {id:product.category.slug, sub_id:product.subcategory.slug, product_id:product.id})
		}
	}
	
	//tooltip for featured ad star
	$scope.showTooltip = function(){
    	$('.fa-star').tooltip();
    }


});
