angular.module('app').
config(function($stateProvider) {
		$stateProvider
			.state('root.auction_detail', {
				url: 'auctions/:id',
				views: {
					'container@': {
						controller: 'AuctionDetailCtrl',
						templateUrl: 'scripts/auction/auction_detail.html',
					}
				}
			});
	})
	.controller('AuctionDetailCtrl', function(USER, $interval, $scope, $timeout, $localStorage, PagerService, WISHLIST, $stateParams, $state, $filter, $q, $rootScope, API, DATA, PagerService, NOTIFIER, gettextCatalog, LANGUAGE) {
		$("html, body").animate({scrollTop: 0}, 1000);
		
		$scope.sending = 0;
		$scope.show_number = false;
		$scope.gateway = 0;
		$scope.bid_amount = 0;
		$scope.bidders = [];
		if($rootScope.previousState){
			$scope.has_previous = true;
		}
        $scope.pager = {};
        $scope.setPage = setPage;

		$scope.go_back = function(){
			if($rootScope.previousState){
				if($rootScope.previousStateParams['id'] == undefined){
					$state.go($rootScope.previousState)
				} else {
					$state.go($rootScope.previousState, $rootScope.previousStateParams)
				}
			}		
		}

		var setCarExamination = function(){
			if($scope.product){
				$scope.product.car_examination_string = $scope.product.car_examination === 0?
					gettextCatalog.getString('Can Examine'):
					gettextCatalog.getString('Can\'t Examine');

			}
		}

		$scope.display_number = function(){
			$scope.show_number = true;
		}
		$scope.$watch(function(){return LANGUAGE.current_code()}, function(previous, next){
			setCarExamination();
		})
		function fetch_info(promises){
			promises.push(API.get('/auctions/'+$stateParams.id, '_product'));
			promises.push(API.get('/price-settings', 'price_settings'));
			if(!DATA.get('_product_website_ads')){
				promises.push(API.getAll('/website-ads?place=8', '_product_website_ads'));
			}
		}

		var df = $q.defer();
		var promises = [];
		fetch_info(promises);

		$scope.get_min_price = function(){
			if($scope.product){
				return parseFloat($scope.product.bidding_price_formatted.replace(/,/g, '')) + 20;
			}
			return 20
		}
		$q.all(promises).then(function(){
			df.resolve();
			$scope.product = DATA.get("_product");
			$scope.priceSettings = DATA.get("price_settings");
			if(!$scope.product){
				NOTIFIER.error(gettextCatalog.getString("Auction"), gettextCatalog.getString('This auction is not available.'))
				$state.go('root.home')
			}
			$scope.product.share_url = $state.href('root.auction_detail', {id:$scope.product.id}, {absolute: true});
			setCarExamination();
			var biddingPrice =  parseFloat($scope.product.bidding_price_formatted.replace(/,/g, ''));
			$scope.bid_amount = biddingPrice + 20;
			if($localStorage['auctions'][$scope.product.id]){

			} else {
				$scope.product.views += 1;
				$localStorage['auctions'][$scope.product.id] =  new Date()
				API.post('/auction-view-increase', {ad:$scope.product.id})
			}
			$interval(function(){
				API.get('/auctions/'+$stateParams.id, '_product').then(function(r){
					$scope.product = r;
					$scope.product.share_url = $state.href('root.auction_detail', {id:$scope.product.id}, {absolute: true});
					setCarExamination();
					var biddingPrice =  parseFloat($scope.product.bidding_price_formatted.replace(/,/g, ''));
					if(biddingPrice + 20 > $scope.bid_amount){
						$scope.bid_amount = biddingPrice + 20;
					}
				})
			}, 5000)

			$timeout(function(){

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
			promises.push(API.getAll('/related-auctions?pk='+$scope.product.id, '_bought_products'))				
			$q.all(promises).then(function(){
				df.resolve();
				$scope.related_ads = DATA.get('_bought_products')
			
			})

		})


        function setPage(page) {
            if (page < 1 || page > $scope.pager.totalPages) {
                return;
            }
	        $scope.pager = PagerService.GetPager($scope.bidders.length, page, $scope.number_of_products);
        	
        	$scope.items = $scope.bidders.slice($scope.pager.startIndex, $scope.pager.endIndex + 1);
              
        }	

		$scope.redirect_product = function(product){
			$state.go('root.auction_detail', {id:product.id})
			
		}

		$scope.load_bidders = function(){
			promises.push(API.getAll('/auction-bids?page_size=12&auction='+$scope.product.id, '_bidders'))				
			$q.all(promises).then(function(){
				df.resolve();
				$scope.number_of_products = 12;
				$scope.bidders = DATA.get('_bidders')['results']
			
			})
		}

        $scope.increasePage = function(){
			var df = $q.defer();
			var promises = [];
        	promises.push(API.getAllNoDmain(DATA.get("_bidders")['next'], '_bidders'));
			$q.all(promises).then(function(){
				df.resolve();
	        	$scope.number_of_products += 12;
				$scope.bidders = $scope.bidders.concat(DATA.get("_bidders")['results']);

			})

        }

        $scope.auction_finished = function(product){
        	product.expired = true;
        }

        $scope.place_bid = function(){
        	if(USER.is("loggedin")){
        		if($scope.product.can_bid){
					if($scope.bid_amount < parseFloat($scope.product.bidding_price_formatted.replace(/,/g, '')) + 20){
						NOTIFIER.error(gettextCatalog.getString("Auction"), gettextCatalog.getString('Bid price is too low!'))
					} else {
						var payload = {
							amount: $scope.bid_amount,
							auction: $scope.product.id,
						}

						API.post('/auction-bids', payload).then(function(r){
							NOTIFIER.success(gettextCatalog.getString("Auction"), gettextCatalog.getString("Your bid is now registered."))
							$scope.bid_amount = parseFloat(r.data.auction_detail.price_formatted.replace(/,/g, '')) + 20;
							$scope.product.total_bids =  r.data.auction_detail.total_bids;
							$scope.product.bidding_price = r.data.auction_detail.price_formatted;
						}, function(r){
							NOTIFIER.error(gettextCatalog.getString("Auction"), r.data["error"])
						})
					}
				} else {
        			$("#bid-payment-modal").modal('show');
				}
        	} else {
        		$rootScope.create_ad_open()
        	}
        }

        $scope.bid_payment = function(){
			API.post('/checkout-bidding', {"payment_method": $scope.gateway}).then(function(response) {
				if(response.status == 200) {
					window.location = response.data.payment_url;
				} else {
					NOTIFIER.error(gettextCatalog.getString('Checkout'), response.data[0]);
				}
			}, function(response){
				NOTIFIER.error(gettextCatalog.getString('Checkout'), response.data[0]);
			})
		}
})	
