angular.module('app').
config(function($stateProvider) {
		$stateProvider
			.state('root.category', {
				url: 'category/:id?q',
				views: {
					'container@': {
						controller: 'CategoryDetailCtrl',
						templateUrl: 'scripts/products/category.html',
					}
				}
			});
	})
	.controller('CategoryDetailCtrl', function($scope, $timeout, $localStorage, WISHLIST, $stateParams, $state, $filter, $q, $rootScope, API, DATA, PagerService, gettextCatalog, NOTIFIER, LANGUAGE) {
		$("html, body").animate({scrollTop: 0}, 1000);
		
		$scope.sending = 0;
		$scope.number_of_products = 12
        $scope.pager = {};
        $scope.setPage = setPage;
        $scope.products = []
		$scope.category = _.filter(DATA.get('_categories'), function(cat){
			if(cat.slug == $stateParams.id){
				return cat
			}
		})[0]

		$scope.q = $stateParams.q
		$scope.selected_category = $scope.category
		$rootScope.page_id = 4
		if(!$scope.category){
			NOTIFIER.error(gettextCatalog.getString('404 Not Found'), gettextCatalog.getString("Category was not found!"))
			$state.go('root.home')
		}
		$scope.slider = {
			  min: $scope.category.price_range.min,
			  max: $scope.category.price_range.max,
			  options: {
			    floor: $scope.category.price_range.min,
			    ceil: $scope.category.price_range.max
			  }
			};
		$scope.categories = DATA.get('_categories')
		$rootScope.page_title = $filter('localize')($scope.category, 'name')

		function fetch_country_info(promises){
			if($scope.q){
				promises.push(API.getAll('/ads?country='+$localStorage['country']+'&category='+$scope.category.id+'&name='+$scope.q, '_category_products'));
			} else {
				promises.push(API.getAll('/ads?country='+$localStorage['country']+'&category='+$scope.category.id, '_category_products'));
			}
			if(!DATA.get('_category_website_ads')){
				promises.push(API.getAll('/website-ads?place=4&place=5', '_category_website_ads'));
			}
		}


	if(!DATA.get("_governorates")){
		var df = $q.defer();
		var promises = [];
		promises.push(API.getAll('/governorates', '_governorates'));
		$q.all(promises).then(function(){
			df.resolve();
			$scope.governorates = DATA.get("_governorates")
		});	
	} else {
		$scope.governorates = DATA.get("_governorates")
	}

	$scope.$watch(function(){
	  return $localStorage['country'];
	}, function(newCodes, oldCodes){

		if(newCodes != oldCodes){
				var df = $q.defer();
				var promises = [];
				if($scope.q){
						promises.push(API.getAll('/ads?country='+$localStorage['country']+'&category='+$scope.category.id+'&name='+$scope.q, '_category_products'));
					} else {
						promises.push(API.getAll('/ads?country='+$localStorage['country']+'&category='+$scope.category.id, '_category_products'));
					}
				$q.all(promises).then(function(){
					df.resolve();
					$scope.products = []
					init_products()

					

				});	
		}
	})

	$scope.redirect_subcategory = function(sub){
		$state.go('root.subcategory', ({id:$scope.category.slug, sub_id:sub.slug}))
	}

		function init_products(){
			$scope.products = $scope.products.concat(DATA.get("_category_products")['results']);
			$scope.number_of_products = 12
			$scope.filter_items(1)
		}
		var df = $q.defer();
		var promises = [];
		fetch_country_info(promises)

		
		$q.all(promises).then(function(){
			df.resolve();
			init_products()

		})

		$scope.$watch('slider.min', function() {
		  $scope.filter_items(1)
		})

		$scope.$watch('slider.max', function() {
		  $scope.filter_items(1)
		})

		$scope.$watch("filter_gov", function(b, a){
			var df = $q.defer();
			var promises = [];
			if($scope.q){
				if($scope.filter_gov){
					promises.push(API.getAll('/ads?governorate='+$scope.filter_gov+'&country='+$localStorage['country']+'&category='+$scope.category.id+'&name='+$scope.q, '_category_products'));
				} else {
					promises.push(API.getAll('/ads?country='+$localStorage['country']+'&category='+$scope.category.id+'&name='+$scope.q, '_category_products'));
				}
			} else {
				if($scope.filter_gov){
					promises.push(API.getAll('/ads?governorate='+$scope.filter_gov+'&country='+$localStorage['country']+'&category='+$scope.category.id, '_category_products'));
				} else {
					promises.push(API.getAll('/ads?country='+$localStorage['country']+'&category='+$scope.category.id, '_category_products'));
				}
			}
			$q.all(promises).then(function(){
				df.resolve();
				$scope.products = []
				init_products()
			});	
		})


        $scope.filter_items = function(page){
            var filtered = $scope.products

            filtered = _.filter(filtered, function(ad){
            	if($scope.filter_gov){
            		if ($scope.filter_gov == ad.governorate){
		            	if(ad.price >= $scope.slider.min && ad.price <= $scope.slider.max){
		            		return ad
		            	}
            		}
            	}  else {
		            	if(ad.price >= $scope.slider.min && ad.price <= $scope.slider.max){
		            		return ad
		            	}
            		}
            })

	        $scope.pager = PagerService.GetPager(filtered.length, page, $scope.number_of_products);
        	$scope.items = filtered.slice(0, $scope.number_of_products);   

			return	$scope.items
        }


  	$scope.go_to_cat = function(cat){
  		$state.go('root.category', {id:cat.slug})
  	}
        function setPage(page) {
            if (page < 1 || page > $scope.pager.totalPages) {
                return;
            }
	        $scope.pager = PagerService.GetPager($scope.products.length, page, $scope.number_of_products);
        	
        	$scope.items = $scope.products.slice($scope.pager.startIndex, $scope.pager.endIndex + 1);
              
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
	
})	
