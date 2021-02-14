angular.module('app').
config(function($stateProvider) {
		$stateProvider
			.state('root.sub_subcategory', {
				url: 'category/:id/:sub_id/:sub_sub_id',
				views: {
					'container@': {
						controller: 'SubSubCategoryDetailCtrl',
						templateUrl: 'scripts/products/sub_subcategory.html',
					}
				}
			});
	})
	.controller('SubSubCategoryDetailCtrl', function($scope, $timeout, $localStorage, WISHLIST, $stateParams, $state, $filter, $q, $rootScope, API, DATA, PagerService, gettextCatalog, NOTIFIER, LANGUAGE) {
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

		$scope.selected_category = $scope.category
		$rootScope.page_id = 4
		if(!$scope.category){
			NOTIFIER.error(gettextCatalog.getString('404 Not Found'), gettextCatalog.getString("Category was not found!"))
			$state.go('root.home')
		}
		$scope.subcategory = _.filter($scope.category.subcategories, function(cat){
			if(cat.slug == $stateParams.sub_id){
				return cat
			}
		})[0]


		if(!$scope.subcategory){
			NOTIFIER.error(gettextCatalog.getString('404 Not Found'), gettextCatalog.getString("Subcategory was not found!"))
			$state.go('root.home')
		}

		$scope.sub_subcategory = _.filter($scope.subcategory.subcategories, function(cat){
			if(cat.slug == $stateParams.sub_sub_id){
				return cat
			}
		})[0]

		if(!$scope.sub_subcategory){
			NOTIFIER.error(gettextCatalog.getString('404 Not Found'), gettextCatalog.getString("Sub Subcategory was not found!"))
			$state.go('root.home')
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

		$scope.slider = {
			  min: $scope.sub_subcategory.price_range.min,
			  max: $scope.sub_subcategory.price_range.max,
			  options: {
			    floor: $scope.sub_subcategory.price_range.min,
			    ceil: $scope.sub_subcategory.price_range.max
			  }
			};
		$scope.categories = DATA.get('_categories')
		$rootScope.page_title = $filter('localize')($scope.sub_subcategory, 'name')

	$scope.$watch(function(){
	  return $localStorage['country'];
	}, function(newCodes, oldCodes){

		if(newCodes != oldCodes){
				var df = $q.defer();
				var promises = [];
				
				// promises.push(API.getAll('/ads?page_size=10000&featured=true&country='+$localStorage['country']+'&sub_subcategory='+$scope.sub_subcategory.id, '_featured_category_products'));
				promises.push(API.getAll('/ads?country='+$localStorage['country']+'&sub_subcategory='+$scope.sub_subcategory.id, '_category_products'));
					
				$q.all(promises).then(function(){
					df.resolve();
					// $scope.featured_products = DATA.get("_featured_category_products")['results']
					$scope.products = []
					init_products()


				});	
		}
	})

	function fetch_country_info(promises){
			// promises.push(API.getAll('/ads?page_size=10000&featured=true&country='+$localStorage['country']+'&sub_subcategory='+$scope.sub_subcategory.id, '_featured_category_products'));
			promises.push(API.getAll('/ads?country='+$localStorage['country']+'&sub_subcategory='+$scope.sub_subcategory.id, '_category_products'));
			if(!DATA.get('_subcategory_website_ads')){
				promises.push(API.getAll('/website-ads?place=6&place=7', '_subcategory_website_ads'));
			}
		}

		function init_products(){
			// var featured_ids = _.map($scope.featured_products, 'id')
			$scope.products = $scope.products.concat(DATA.get("_category_products")['results']);
			// $scope.products = _.filter($scope.products, function(product){
			// 	if(_.indexOf(featured_ids, product.id) == -1){
			// 		return product
			// 	}
			// })
	
			$scope.filter_items(1)
		}
		var df = $q.defer();
		var promises = [];
		fetch_country_info(promises)

		
		$q.all(promises).then(function(){
			df.resolve();
			// $scope.featured_products = DATA.get("_featured_category_products")['results']
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
			if($scope.filter_gov){
				promises.push(API.getAll('/ads?governorate='+$scope.filter_gov+'&country='+$localStorage['country']+'&sub_subcategory='+$scope.sub_subcategory.id, '_category_products'));
			} else {
				promises.push(API.getAll('/ads?country='+$localStorage['country']+'&sub_subcategory='+$scope.sub_subcategory.id, '_category_products'));
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
				// $scope.products = _.filter($scope.products, function(product){
				// 	if(_.indexOf(featured_ids, product.id) == -1){
				// 		return product
				// 	}
				// })
				$scope.filter_items(1)




			})

        }
	$scope.redirect_product = function(product){
		if(product.sub_subcategory){
			$state.go('root.sub_product_detail', {id:product.category.slug, sub_id:product.subcategory.slug,
											sub_sub_id:product.sub_subcategory.slug, product_id:product.id})
		} else {
			$state.go('root.product_detail', {id:product.category.slug, sub_id:product.subcategory.slug, product_id:product.id})
		}
	}
})	
