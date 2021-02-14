angular.module('app').
config(function($stateProvider) {
		$stateProvider
			.state('root.sub_product_detail', {
				url: 'category/:id/:sub_id/:sub_sub_id/ads/:product_id',
				views: {
					'container@': {
						controller: 'SubProductDetailCtrl',
						templateUrl: 'scripts/products/sub_product.html',
					}
				}
			});
	})
	.controller('SubProductDetailCtrl', function($scope, $filter, LANGUAGE, $timeout, WISHLIST, $localStorage, $sce, USER, $stateParams, $state, $q, $rootScope, ERRORTIPS, API, DATA, gettextCatalog, NOTIFIER) {
		$("html, body").animate({scrollTop: 0}, 1000);

		$scope.sending = 0;
		var df = $q.defer();
		var promises = [];
		$scope.show_number = false

			if($rootScope.previousState){
				$scope.has_previous = true
			}

			$scope.go_back = function(){
				if($rootScope.previousState){
					if($rootScope.previousStateParams['id'] == undefined){
						$state.go($rootScope.previousState)
					} else {
					
							$state.go($rootScope.previousState, $rootScope.previousStateParams)
						
					}
				}		
			}
		 _.each(DATA.get('_categories'), function(cat){
		 	if(cat.slug == $stateParams.id){
		 		$scope.category = cat
				_.each(cat.subcategories, function(sub){
					if(sub.slug == $stateParams.sub_id){
						$scope.sub_category = sub
					}

				})

		 	}
		})

		$scope.display_number = function(){
			$scope.show_number = true
		}

		if(!$scope.category){
			$state.go('root.home')
		}
		if(!$scope.sub_category){
			$state.go('root.home')
		}
		function fetch_info(promises){
			promises.push(API.get('/ads/'+$stateParams.product_id, '_product'));
			if(!DATA.get('_product_website_ads')){
				promises.push(API.getAll('/website-ads?place=2&place=3', '_product_website_ads'));
			}
		}

		var df = $q.defer();
		var promises = [];
		fetch_info(promises)

		$q.all(promises).then(function(){
			df.resolve();
			$scope.product = DATA.get("_product")
			if(!$scope.product){
				NOTIFIER.error(gettextCatalog.getString("Ad"), gettextCatalog.getString('This ad is not available.'))
				$state.go('root.home')
			}

			if($scope.category.slug != $scope.product.category.slug){
				$state.go('root.product_detail', {id:$scope.product.category.slug, sub_id:$scope.product.subcategory.slug, product_id:$scope.product.id})
			}

			if($scope.sub_category.slug != $scope.product.subcategory.slug){
				$state.go('root.product_detail', {id:$scope.product.category.slug, sub_id:$scope.product.subcategory.slug, product_id:$scope.product.id})
			}

			if(!$stateParams.sub_sub_id){
				$state.go('root.product_detail', {id:$scope.product.category.slug, sub_id:$scope.product.subcategory.slug, product_id:$scope.product.id})
			}
			$scope.product.share_url = $state.href('root.sub_product_detail', {id:$scope.product.category.slug,
									sub_id: $scope.product.subcategory.slug, sub_sub_id:$scope.product.sub_subcategory.slug,
									product_id: $scope.product.id }, {absolute: true});


			if($localStorage['ads'][$scope.product.id]){

			} else {
				$scope.product.views += 1;
				$localStorage['ads'][$scope.product.id] =  new Date()
				API.post('/ad-view-increase', {ad:$scope.product.id})
			}


			$timeout(function(){

		       /* jQuery("#slider-hdr-8").revolution({
		            sliderType: "standard",
		            sliderLayout: "auto",
		            disableProgressBar: "on",
		            delay: 5000,
		            navigation: {
		                onHoverStop: "off",
		                arrows: {enable: false},
		                bullets: {enable: false}
		            },
		            responsiveLevels: [1170, 800, 600, 480],
		            gridwidth: [1120, 750, 500, 450],
		            gridheight: [365, 365, 365, 365]
		        });*/
		        jQuery("#slider-hdr-8").revolution({
		            
		            sliderLayout: "auto",
		            disableProgressBar: "on",
		            delay: 5000,
		            stopLoop: 'on',
		            stopAfterLoops: 0,
		            stopAtSlide: 1,
		            navigation: {
		                onHoverStop: "off",
		                arrows: {enable: true},
		                bullets: {enable: false},
		                thumbnails: {
		                    style: "gyges",
		                    enable: true,
		                    width: 80,
		                    height: 60,
		                    min_width: 80,
		                    wrapper_padding: 20,
		                    wrapper_color: "#222222",
		                    wrapper_opacity: "1",
		                    tmp:'<span class="tp-thumb-img-wrap">  <span class="tp-thumb-image"></span></span>',
		                    visibleAmount: 7,
		                    hide_onmobile: true,
		                    hide_under: 720,
		                    hide_onleave: false,
		                    direction: "vertical",
		                    span: true,
		                    position: "outer-left",
		                    space: 10,
		                    h_align: "left",
		                    v_align: "top",
		                    h_offset: 0,
		                    v_offset: 0
		                }
		            },
		            responsiveLevels: [1170, 800, 600, 480],
		            gridwidth: [1120, 750, 500, 450],
		            gridheight: [500, 500, 500, 500]
		        });
			}, 1500)


			df = $q.defer();
			promises = [];
			promises.push(API.getAll('/related-ads?pk='+$scope.product.id, '_bought_products'))				
			$q.all(promises).then(function(){
				df.resolve();
				$scope.related_ads = DATA.get('_bought_products')
			
			})


		})



	$scope.report = function(){

		API.post('/ad-report', {ad:$scope.product.id, serial_key:$localStorage['serial_key']}).then(function(){
			NOTIFIER.success(gettextCatalog.getString("Ad"), gettextCatalog.getString('Succesfully reported this ad.'))
		}, function(){
			NOTIFIER.error(gettextCatalog.getString("Ad"), gettextCatalog.getString('Ad already reported.'))
		})
	}

	$scope.add_favorite = function(){
			
			WISHLIST.add($scope.product).then(function(response) {

				
			})
			
	}

	$scope.add_to_wishlist = function(product) {
			if (product){
				WISHLIST.add(product).then(function(response) {

					
				})
			}
					
		} 



		$scope.submit_contact = function() {


			if($scope.sending) {
				return;
			}

			if(!$scope.sellForm.$invalid) {
				$scope.sending = 1;
				$scope.sell_form['ad'] = $scope.product.id
				API.post('/ad-message', $scope.sell_form).then(function(response) {
					$scope.step = 1;
					$scope.sending = 0;
					$scope.sell_form = {}

					NOTIFIER.success(gettextCatalog.getString('Ad'), gettextCatalog.getString('Message sent'));
				}, function(response) {
					
					$scope.sending = 0;
					$scope.step = 0
				
					ERRORTIPS.list('sellForm', response.data);
					
				});
			}
		};

	$scope.redirect_product = function(product){
		if(product.sub_subcategory){
			$state.go('root.sub_product_detail', {id:product.category.slug, sub_id:product.subcategory.slug,
											sub_sub_id:product.sub_subcategory.slug, product_id:product.id})
		} else {
			$state.go('root.product_detail', {id:product.category.slug, sub_id:product.subcategory.slug, product_id:product.id})
		}
	}
})	
