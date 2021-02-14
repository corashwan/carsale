angular.module('app').
config(function($stateProvider) {
		$stateProvider
			.state('root.auctions', {
				url: 'auctions',
				views: {
					'container@': {
						controller: 'AuctionsCtrl',
						templateUrl: 'scripts/auction/auctions.html',
					}
				}
			});
	})
	.controller('AuctionsCtrl', function($scope, $timeout, USER, $localStorage, WISHLIST, $stateParams, $state, $filter, $q, $rootScope, API, DATA, PagerService, gettextCatalog, NOTIFIER, LANGUAGE) {
		$("html, body").animate({scrollTop: 0}, 1000);
		
		$scope.sending = 0;
		$scope.number_of_products = 12
        $scope.pager = {};
        $scope.setPage = setPage;
        $scope.products = [];

        function setPage(page) {
            if (page < 1 || page > $scope.pager.totalPages) {
                return;
            }
	        $scope.pager = PagerService.GetPager($scope.products.length, page, $scope.number_of_products);
        	$scope.items = $scope.products.slice($scope.pager.startIndex, $scope.pager.endIndex + 1);
              
        }	

		function fetch_country_info(promises){
			promises.push(API.getAll('/auctions?page_size=20&country='+$localStorage['country']+'&featured=True', '_category_products'));
			if(!DATA.get('_auction_website_ads')){
				promises.push(API.getAll('/website-ads?place=8', '_auction_website_ads'));
			}
		}

		$scope.$watch(function(){
		  return $localStorage['country'];
		}, function(newCodes, oldCodes){

			if(newCodes != oldCodes){
					var df = $q.defer();
					var promises = [];
					promises.push(API.getAll('/auctions?page_size=20&country='+$localStorage['country']+'&featured=True', '_category_products'));
					$q.all(promises).then(function(){
						df.resolve();
						$scope.products = []
						init_products()
					});	
			}
		})

		function init_products(){
			$scope.products = $scope.products.concat(DATA.get("_category_products")['results']);
			$scope.number_of_products = 12
			$scope.filter_items(1)
		}

		var df = $q.defer();
		var promises = [];
		fetch_country_info(promises);

		$q.all(promises).then(function(){
			df.resolve();
			init_products();
		})

        $scope.filter_items = function(page){
            var filtered = $scope.products
	        $scope.pager = PagerService.GetPager(filtered.length, page, $scope.number_of_products);
        	$scope.items = filtered.slice(0, $scope.number_of_products);   
			return	$scope.items
        }

        $scope.increasePage = function(){
			var df = $q.defer();
			var promises = [];
        	promises.push(API.getAllNoDmain(DATA.get("_category_products")['next'], '_category_products'));
			$q.all(promises).then(function(){
				df.resolve();
	        	$scope.number_of_products += 12;
				$scope.products = $scope.products.concat(DATA.get("_category_products")['results']);
				$scope.filter_items(1)
			})

        }

		$scope.redirect_product = function(product){
			$state.go('root.auction_detail', {id:product.id})
			
		}

		$scope.add_new_auction = function(){
			if(USER.is('loggedin')){
				$state.go('root.account.create_auction')
			} else {
				$rootScope.create_ad_open()
			}
		}

        $scope.auction_finished = function(product){
        	product.expired = true;
        }
})	
