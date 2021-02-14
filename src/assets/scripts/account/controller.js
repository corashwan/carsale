'use strict';

angular.module('app').
config(function($stateProvider) {
	$stateProvider
	
		.state('root.account', {
			url: 'account',
			views: {
				'container@': {
					templateUrl: 'scripts/account/body.html',
					controller: 'Account'
				}
			},
			onEnter: function(USER, $state) {
				if(!USER.is('loggedin')) {
					$state.go('root.home');
				}
			}
		})
		.state('root.account.my_auctions', {
			url: '/my-auctions',
			views: {
				'container@': {
					templateUrl: 'scripts/account/my_auctions.html',
					controller: 'AccountAuctions'
				}
			},
			onEnter: function(USER, $state) {
				if(!USER.is('loggedin')) {
					$state.go('root.home');
				}
			}
		})
		.state('root.account.favorites', {
			url: '/favorites',
			views: {
				'container@': {
					templateUrl: 'scripts/account/favorites.html',
					controller: 'AccountFavorites'
				}
			},
			onEnter: function(USER, $state) {
				if(!USER.is('loggedin')) {
					$state.go('root.home');
				}
			}
		})
		.state('root.account.ads', {
			url: '/ads',
			views: {
				'container@': {
					templateUrl: 'scripts/account/manage.html',
					controller: 'AccountAds'
				}
			},
			onEnter: function(USER, $state) {
				if(!USER.is('loggedin')) {
					$state.go('root.home');
				}
			}
		})
		.state('root.account.create_ad', {
			url: '/create-ad',
			views: {
				'container@': {
					templateUrl: 'scripts/account/create.html',
					controller: 'AccountCreateAd'
				}
			},
			onEnter: function(USER, $state) {
				if(!USER.is('loggedin')) {
					$state.go('root.home');
				}
			}
		})
		.state('root.account.create_auction', {
			url: '/create-auction',
			views: {
				'container@': {
					templateUrl: 'scripts/account/create_auction.html',
					controller: 'AccountCreateAuction'
				}
			},
			onEnter: function(USER, $state) {
				if(!USER.is('loggedin')) {
					$state.go('root.home');
				}
			}
		})
		.state('root.account.edit_ad', {
			url: '/edit-ad/:id',
			views: {
				'container@': {
					templateUrl: 'scripts/account/edit.html',
					controller: 'AccountEditAd'
				}
			},
			onEnter: function(USER, $state) {
				if(!USER.is('loggedin')) {
					$state.go('root.home');
				}
			}
		})
		.state('root.account.edit_auction', {
			url: '/edit-auction/:id',
			views: {
				'container@': {
					templateUrl: 'scripts/account/edit_auction.html',
					controller: 'AccountEditAuction'
				}
			},
			onEnter: function(USER, $state) {
				if(!USER.is('loggedin')) {
					$state.go('root.home');
				}
			}
		})
		.state('root.customer_no_access', {
			url: 'no_access',
			views: {
				'container@': {
					templateUrl: 'scripts/account/no_access.html'
				}
			}
		});
})
.controller('Account', function($scope, $rootScope, $state, Upload, CONFIG, DATA, AUTH, USER, gettextCatalog, API, NOTIFIER, ERRORTIPS) {
	$scope.user = angular.copy(USER.data());
	$rootScope.page_id = -1
	$("html, body").animate({scrollTop: 0}, 1000);
	

	$scope.logout = function() {
		AUTH.logout();
		$state.go('root.home');
	};

 	$scope.delete_image = function(id) {
		$scope.logo = 0;
		$scope.image_loader = 0;
		$scope.user.avatar_image = undefined;
		API.delete('/profile-image/' + id);
	};

	$scope.uploadFiles = function(file, errFiles) {
		$scope.f = file;
		if(file && errFiles.length === 0) {
			$scope.image_loader = 1;

			var upload_data = {
				image: file
			};
			// upload_data.user = $scope.user.id;

			file.upload = Upload.upload({
				url: CONFIG.api_url() + '/profile-image',
				data: upload_data
			}).then(function(response) {
				API._get('/profile-image/' + response.data.id).then(function(response) {
					$scope.image_loader = 0;
					$scope.logo = 1;
					$scope.user.avatar_image = response.data;
					$scope.user.image_id = response.data.id;
				});
				
			}, function(response) {
				NOTIFIER.error(gettextCatalog.getString("Image"), gettextCatalog.getString("Upload error"));
			});
		}
	};

	$scope.save = function(){

		if(!$scope.editForm.$invalid) {
			$scope.saving = 1;
			USER.update($scope.user).then(function(response) {
				if(response.status == 200) {
					$scope.editing = 0;
					$scope.saving = 0;
					NOTIFIER.success(gettextCatalog.getString('Profile'), gettextCatalog.getString('Updated successfully'));
				} else {
					$scope.saving = 0;
					NOTIFIER.error(gettextCatalog.getString('Profile'), response.data);
				}
			});
		}
	}

})
.controller('AccountPassword', function($scope, $rootScope, $state, DATA, AUTH, USER, gettextCatalog, API, NOTIFIER, ERRORTIPS) {
	$scope.user = angular.copy(USER.data());
	$rootScope.page_id = -1

	

	$scope.logout = function() {
		AUTH.logout();
		$state.go('root.home');
	};
	

	$scope.change_password = function(){

		if(!$scope.profileForm.$invalid) {

			$scope.saving = 1;
			USER.change_password($scope.data).then(function(response){
				 $scope.saving = 0;
				NOTIFIER.success(gettextCatalog.getString('Password'), gettextCatalog.getString('Updated successfully'));
			}, function(response){
				 $scope.saving = 0;
				NOTIFIER.error(gettextCatalog.getString('Password'), response.data);
			})


		} else {
			NOTIFIER.error(gettextCatalog.getString('Password'), gettextCatalog.getString('All fields are required.'));
		}
	}


})
.controller('AccountAuctions', function($state, $filter, $timeout, $rootScope, NOTIFIER, ORDERS, $q, $scope, AUTH, LANGUAGE, USER,API,DATA, gettextCatalog){

	$rootScope.page_title = ''
	$scope.user = angular.copy(USER.data());
	$("html, body").animate({scrollTop: 0}, 1000);

	$scope.logout = function() {
		AUTH.logout();
		
		$state.go('root.home');
	};

	var load_ads = function(){

		var df = $q.defer();
		var promises = [];
		promises.push(API.getAll('/auctions?profile=true&page_size=1000', '_profile_products'));
		promises.push(API.getAll('/auction-bids?page_size=1000&user='+ USER.data().id, '_my_bids'));
		$q.all(promises).then(function(){
			df.resolve();
			$scope.products = DATA.get("_profile_products")['results']

		});	
	}
	$rootScope.page_id = -1
	$rootScope.page_title = ''
	load_ads()
	// $scope.delete_ad = function(ad){

	// 	API.delete('/ads/'+ ad.id).then(function(){
	// 		NOTIFIER.success(gettextCatalog.getString('Ad'), gettextCatalog.getString('Succesfully removed ad.'));
	// 		_.remove($scope.products, {id:ad.id})
	// 		USER.data().total_ads = USER.data().total_ads - 1
	// 	})
	// }

	$scope.redirect_product = function(product){

		$state.go('root.auction_detail', {id:product.id});
	
	}

    $scope.auction_finished = function(product){
        	product.expired = true;
        	product.seconds = 0;
        }

    $scope.selected_auction = undefined;
    $scope.select_auction = function(auction){
    	$scope.selected_auction = auction;
    }

    $scope.reject_auction = function(){
    	API.post('/reject-auction', {auction:$scope.selected_auction.id}).then(function(r){
    		NOTIFIER.info(gettextCatalog.getString('Auction'), gettextCatalog.getString('Auction closed.'));
    		$scope.selected_auction.expired = true;
    		$scope.selected_auction.seconds = 1;
    		$scope.selected_auction.status = 0;
    		$scope.selected_auction.auction_processed = true;
    		$scope.auction_finished($scope.selected_auction)
    	})
    }

    $scope.accept_auction = function(){
    	API.post('/approve-auction', {auction:$scope.selected_auction.id}).then(function(r){
    		NOTIFIER.info(gettextCatalog.getString('Auction'), gettextCatalog.getString('Auction closed and bidder notified.'));
    		$scope.selected_auction.expired = true;
    		$scope.selected_auction.seconds = 1;
    		$scope.selected_auction.status = 0;
    		$scope.selected_auction.auction_processed = true;
    		$scope.auction_finished($scope.selected_auction)
    	})
    }
})
.controller('AccountFavorites',function($scope, $timeout, $filter, $q, API, LANGUAGE, PagerService, gettextCatalog, $rootScope, ORDERS, $state, AUTH, USER, DATA, ERRORTIPS, NOTIFIER){
	$("html, body").animate({scrollTop: 0}, 1000);
	$scope.logout = function() {
		AUTH.logout();
		
		$state.go('root.home');
	};

    $rootScope.page_id = -1
	$scope.USER = USER;

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
.controller('AccountAds', function($state, $filter, $timeout, $rootScope, NOTIFIER, ORDERS, $q, $scope, AUTH, LANGUAGE, USER,API,DATA, gettextCatalog){
	$rootScope.page_title = ''
	$scope.user = angular.copy(USER.data());
	$("html, body").animate({scrollTop: 0}, 1000);
	$scope.logout = function() {
		AUTH.logout();
		
		$state.go('root.home');
	};

	var load_ads = function(){

		var df = $q.defer();
		var promises = [];
		promises.push(API.getAll('/ads?profile=true&page_size=1000', '_profile_products'));
		$q.all(promises).then(function(){
			df.resolve();
			$scope.products = DATA.get("_profile_products")['results']

		});	
	}
	$rootScope.page_id = -1
	$rootScope.page_title = ''
	load_ads()
	$scope.delete_ad = function(ad){

		API.delete('/ads/'+ ad.id).then(function(){
			NOTIFIER.success(gettextCatalog.getString('Ad'), gettextCatalog.getString('Succesfully removed ad.'));
			_.remove($scope.products, {id:ad.id})
			USER.data().total_ads = USER.data().total_ads - 1
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
.controller('AccountCreateAd', function($state, $sce, $filter, $timeout, CONFIG, $rootScope, Upload, NOTIFIER, ORDERS, $q, $scope, AUTH, LANGUAGE, USER,API,DATA, gettextCatalog){
	$rootScope.page_title = ''
	$scope.gateway = "1"
	$scope.user = angular.copy(USER.data());
	$("html, body").animate({scrollTop: 0}, 1000);
	$scope.logout = function() {
		AUTH.logout();
		
		$state.go('root.home');
	};

	$scope.images = [];
	$scope.added = 0;
	$scope.image_loader = 0;

	$scope.ad = { latitude: 29.378586,
			longitude: 47.990341 }

	$scope.categories = _.filter(DATA.get("_categories"), {is_private:false})
	var private_categories = _.filter(DATA.get("_categories"), {is_private:true})
	_.each(USER.data().permission_categories, function(cat){
		var private_category = _.filter(private_categories, {id: cat})[0]
		if(private_category){
			$scope.categories.push(private_category)
		}
	})
	$scope.categories = _.orderBy($scope.categories, "order")
	_.each($scope.categories, function(category){
		category.available_subcategories = _.filter(category.subcategories, {is_private:false})
		var private_subcategories = _.filter(category.subcategories, {is_private:true})
		_.each(USER.data().permission_subcategories, function(subcat){
			var private_subcategory = _.filter(private_subcategories, {id: subcat})[0]
			if(private_subcategory){
				category.available_subcategories.push(private_subcategory)
			}
		})
		category.available_subcategories = _.orderBy(category.available_subcategories, "order")
		_.each(category.available_subcategories, function(subcat){
			if (subcat.subcategories.length > 0){
				subcat.available_subcategories = _.filter(subcat.subcategories, {is_private:false})
				var private_subcategories = _.filter(subcat.subcategories, {is_private:true})

				_.each(USER.data().permission_sub_subcategories, function(perm_subcat){
					var private_subcategory = _.filter(private_subcategories, {id: perm_subcat})[0]
					if(private_subcategory){
						subcat.available_subcategories.push(private_subcategory)
					}
				})
			}
		})
	})

	if(!DATA.get("_governorates")){
		var df = $q.defer();
		var promises = [];
		promises.push(API.getAll('/governorates', '_governorates'));
		$q.all(promises).then(function(){
			df.resolve();
		});	
	}

	if(!DATA.get("_car_info")){
		var df = $q.defer();
		var promises = [];
		promises.push(API.getAll('/car-infos', '_car_info'));
		$q.all(promises).then(function(){
			df.resolve();
		});	
	}


	$scope.$watch("ad.country", function(before, after){
		if(!$scope.ad.country){
			$scope.ad.governorate = ""
		}
	})


	// $scope.models = []
	// $scope.$watch("ad.sub_subcategory", function(before, after){
	// 	if(!$scope.ad.sub_subcategory){
	// 		$scope.ad.model = ""
	// 	} else {
	// 		var df = $q.defer();
	// 		var promises = [];
	// 		promises.push(API.getAll('/car-model?category='+$scope.ad.sub_subcategory, '_car_models'));
	// 		$q.all(promises).then(function(){
	// 			df.resolve();
	// 			$scope.models = DATA.get("_car_models")
	// 		});	
	// 	}
	// })

	$scope.selected = function(selected_category, category){
		return parseInt(selected_category) == parseInt(category)
	}
	$scope.change_ad_category = function(category){
		$scope.ad.subcategory = undefined
		$scope.ad.sub_subcategory = undefined
		$scope.ad.filter_subcategory = undefined
	}

	$scope.change_category = function(category){
		$scope.selected_category = category
	}
	var image_ids = function() {
		var ids = [];
		_.forEach($scope.images, function(i) {
			ids.push(i.id);
		});
		$scope.image_ids = _.flatten(ids);
	};

	var df = $q.defer();
	var promises = [];
	$scope.loading = 1;


	$scope.delete_image = function(id) {
		API.delete('/ad-image/' + id);
		_.remove($scope.images, function(item) {
			return item.id === id;
		});
		image_ids();
	};

	$scope.uploadFiles = function(file, errFiles) {
		$scope.f = file;
		if(file && errFiles.length === 0) {
			$scope.image_loader = 1;

			var upload_data = {
				file: file
			};

				file.upload = Upload.upload({
					url: CONFIG.api_url() + '/ad-image',
					data: upload_data
				}).then(function(response) {
					$scope.image_loader = 0;
					var image_id = response.data.id;
					API._get('/ad-image/' + image_id).then(function(response) {
						$scope.images.push(response.data);
						$scope.loading = 0;
						$scope.current_image = response.data

						image_ids();
					});
				}, function(response) {
					NOTIFIER.error(gettextCatalog.getString('Image'), gettextCatalog.getString('Upload error'));
				}, function (evt) {
		        	
		    });
		}
	};

	$scope.updateImage = function(img){
			_.forEach($scope.images, function(item){
				if(item.id != img.id){
					if(item.is_cover === true){
						API.patch('/ad-image/'+ item.id, {is_cover: item.is_cover}).then(function(response){
							item.is_cover = false;
						})
					}

				}
			})
			API.patch('/ad-image/'+ img.id, {is_cover: img.is_cover}).then(function(response){
			})
			
	}

	var prepare_ad = function(product) {
		$scope.ad.images = $scope.image_ids.join(',');
	}

	$scope.submitting = false
	$scope.submit = function(){
		if(!$scope.image_ids){
			NOTIFIER.error(gettextCatalog.getString('Ad'), gettextCatalog.getString('Please add at least 1 image.'));
		} else {
			if(!$scope.adForm.$invalid) {
				prepare_ad()
				NOTIFIER.info(gettextCatalog.getString('Ad'), gettextCatalog.getString('Submitting information.'));
	
				var ad = angular.copy($scope.ad)
				ad.category = ad.category.id
				if(ad.subcategory){
					ad.subcategory = ad.subcategory.id
				}
				ad.payment_method = $scope.gateway
				if (ad.latitude == 29.378586 && ad.longitude == 47.990341){
					ad.latitude = 0
					ad.longitude = 0
				}

				// if(!$scope.ad.mileage){
				// 	ad.mileage = ""
				// }
				$scope.submitting = true
				API.post('/ads', ad).then(function(response) {
					
					if(response.status == 201) {
						$scope.sending = 0;
							if(response.data.payment_url){
								if(response.data.payment_url && response.data.payment_url != ''){
									window.location = response.data.payment_url;
								} else {
									NOTIFIER.error(gettextCatalog.getString('Checkout'), gettextCatalog.getString('We could not reach the payment gateway.'))
								}
								
							} else {
								USER.data().total_ads = USER.data().total_ads + 1
								NOTIFIER.success(gettextCatalog.getString('Ad'), gettextCatalog.getString('Succesfully created.'));
								$state.go('root.account.ads')
							}

						
					} else {
						$scope.sending = 0;
						$scope._saving = 0;
						$scope.submitting = false
						NOTIFIER.error(gettextCatalog.getString('Cannot save'), API.errors(response));
					}
				}, function(response){
						$scope.sending = 0;
						$scope._saving = 0;
						$scope.submitting = false
						NOTIFIER.error(gettextCatalog.getString('Cannot save'), API.errors(response));		
				});

			} else {
				NOTIFIER.error(gettextCatalog.getString('Ad'), gettextCatalog.getString('Please fill all required fields'));
			}
		}
		
	}
})
.controller('AccountCreateAuction', function($state, $sce, $filter, $timeout, CONFIG, $rootScope, Upload, NOTIFIER, ORDERS, $q, $scope, AUTH, LANGUAGE, USER,API,DATA, gettextCatalog){
	$rootScope.page_title = ''
	$scope.gateway = "1"
	$scope.user = angular.copy(USER.data());
	$("html, body").animate({scrollTop: 0}, 1000);
	$scope.logout = function() {
		AUTH.logout();
		
		$state.go('root.home');
	};

	$scope.images = [];
	$scope.added = 0;
	$scope.image_loader = 0;

	$scope.ad = { "car_examination": "0" }


	if(!DATA.get("_car_info")){
		var df = $q.defer();
		var promises = [];
		promises.push(API.getAll('/car-infos', '_car_info'));
		$q.all(promises).then(function(){
			df.resolve();
		});	
	}


	var image_ids = function() {
		var ids = [];
		_.forEach($scope.images, function(i) {
			ids.push(i.id);
		});
		$scope.image_ids = _.flatten(ids);
	};

	var df = $q.defer();
	var promises = [];
	$scope.loading = 1;


	$scope.delete_image = function(id) {
		API.delete('/ad-image/' + id);
		_.remove($scope.images, function(item) {
			return item.id === id;
		});
		image_ids();
	};

	$scope.uploadFiles = function(file, errFiles) {
		$scope.f = file;
		if(file && errFiles.length === 0) {
			$scope.image_loader = 1;

			var upload_data = {
				file: file
			};

				file.upload = Upload.upload({
					url: CONFIG.api_url() + '/auction-image',
					data: upload_data
				}).then(function(response) {
					$scope.image_loader = 0;
					var image_id = response.data.id;
					API._get('/auction-image/' + image_id).then(function(response) {
						$scope.images.push(response.data);
						$scope.loading = 0;
						$scope.current_image = response.data

						image_ids();
					});
				}, function(response) {
					NOTIFIER.error(gettextCatalog.getString('Image'), gettextCatalog.getString('Upload error'));
				}, function (evt) {
		        	
		    });
		}
	};

	$scope.updateImage = function(img){
			_.forEach($scope.images, function(item){
				if(item.id != img.id){
					if(item.is_cover === true){
						API.patch('/auction-image/'+ item.id, {is_cover: item.is_cover}).then(function(response){
							item.is_cover = false;
						})
					}

				}
			})
			API.patch('/auction-image/'+ img.id, {is_cover: img.is_cover}).then(function(response){
			})
			
	}

	var prepare_ad = function(product) {
		$scope.ad.images = $scope.image_ids.join(',');
	}

	$scope.submitting = false
	$scope.submit = function(){
		if(!$scope.image_ids){
			NOTIFIER.error(gettextCatalog.getString('Auction'), gettextCatalog.getString('Please add at least 1 image.'));
		} else {
			if(!$scope.adForm.$invalid) {
				prepare_ad()
				NOTIFIER.info(gettextCatalog.getString('Auction'), gettextCatalog.getString('Submitting information.'));
	
				var ad = angular.copy($scope.ad)
				ad.payment_method = $scope.gateway
				$scope.submitting = true
				API.post('/auctions', ad).then(function(response) {
					
					if(response.status == 201) {
						$scope.sending = 0;
						if(response.data.payment_url && response.data.payment_url != ''){
							window.location = response.data.payment_url;
						} else {
							NOTIFIER.error(gettextCatalog.getString('Checkout'), gettextCatalog.getString('We could not reach the payment gateway.'))
						}
								
					} else {
						$scope.sending = 0;
						$scope._saving = 0;
						$scope.submitting = false
						NOTIFIER.error(gettextCatalog.getString('Cannot save'), API.errors(response));
					}
				}, function(response){
						$scope.sending = 0;
						$scope._saving = 0;
						$scope.submitting = false
						NOTIFIER.error(gettextCatalog.getString('Cannot save'), API.errors(response));		
				});

			} else {
				NOTIFIER.error(gettextCatalog.getString('Auction'), gettextCatalog.getString('Please fill all required fields'));
			}
		}
		
	}
})
.controller('AccountEditAd', function($state, $filter, $stateParams, $timeout, CONFIG, $rootScope, Upload, NOTIFIER, ORDERS, $q, $scope, AUTH, LANGUAGE, USER,API,DATA, gettextCatalog){
	$rootScope.page_title = ''
	$scope.user = angular.copy(USER.data());
	$("html, body").animate({scrollTop: 0}, 1000);
	$scope.logout = function() {
		AUTH.logout();
		
		$state.go('root.home');
	};

	$scope.images = [];
	$scope.added = 0;
	$scope.image_loader = 0;

	if(!DATA.get("_governorates")){
		var df = $q.defer();
		var promises = [];
		promises.push(API.getAll('/governorates', '_governorates'));
		$q.all(promises).then(function(){
			df.resolve();
		});	
	}

	if(!DATA.get("_car_info")){
		var df = $q.defer();
		var promises = [];
		promises.push(API.getAll('/car-infos', '_car_info'));
		$q.all(promises).then(function(){
			df.resolve();
		});	
	}


	$scope.categories = _.filter(DATA.get("_categories"), {is_private:false})
	var private_categories = _.filter(DATA.get("_categories"), {is_private:true})
	_.each(USER.data().permission_categories, function(cat){
		var private_category = _.filter(private_categories, {id: cat})[0]
		if(private_category){
			$scope.categories.push(private_category)
		}
	})
	$scope.categories = _.orderBy($scope.categories, "order")
	_.each($scope.categories, function(category){
		category.available_subcategories = _.filter(category.subcategories, {is_private:false})
		var private_subcategories = _.filter(category.subcategories, {is_private:true})
		_.each(USER.data().permission_subcategories, function(subcat){
			var private_subcategory = _.filter(private_subcategories, {id: subcat})[0]
			if(private_subcategory){
				category.available_subcategories.push(private_subcategory)
			}
		})
		category.available_subcategories = _.orderBy(category.available_subcategories, "order")
		_.each(category.available_subcategories, function(subcat){
			if (subcat.subcategories.length > 0){
				subcat.available_subcategories = _.filter(subcat.subcategories, {is_private:false})
				var private_subcategories = _.filter(subcat.subcategories, {is_private:true})

				_.each(USER.data().permission_sub_subcategories, function(perm_subcat){
					var private_subcategory = _.filter(private_subcategories, {id: perm_subcat})[0]
					if(private_subcategory){
						subcat.available_subcategories.push(private_subcategory)
					}
				})
			}
		})
	})
	// $scope.models = []
	// $scope.$watch("ad.sub_subcategory", function(before, after){
	// 	if($scope.ad){
	// 		if(!$scope.ad.sub_subcategory){
	// 			$scope.ad.model = ""
	// 		} else {
	// 			var df = $q.defer();
	// 			var promises = [];
	// 			promises.push(API.getAll('/car-model?category='+$scope.ad.sub_subcategory, '_car_models'));
	// 			$q.all(promises).then(function(){
	// 				df.resolve();
	// 				$scope.models = DATA.get("_car_models")
	// 			});	
	// 		}
	// 	}
	// })

	API.get('/ads/'+$stateParams.id).then(function(r){
		$scope.ad = r
		var images = []
		angular.forEach($scope.ad.images, function(value, key){
			images.push(value.id)
			$scope.images.push(value);
		})
		$scope.is_service = $scope.ad.category.is_service
		$scope.ad.category = _.filter($scope.categories, {id:$scope.ad.category.id})[0]
		$scope.subcategories = _.filter(DATA.get("_categories"), {id:$scope.ad.category.id})[0].subcategories
		$scope.ad['price'] = parseFloat($scope.ad.price)
		$scope.ad['country'] = $scope.ad.country.id
		if(!$scope.ad.category.is_service){
			$scope.sub_subcategories = _.filter($scope.subcategories, {id: parseInt($scope.ad.subcategory.id)})[0].subcategories
			$scope.ad['subcategory'] = String($scope.ad.subcategory.id)
			// $scope.ad['model'] = String($scope.ad.model.id)
			$scope.ad['year'] = String($scope.ad.year)
			if($scope.ad.color_exterior){
				$scope.ad['color_exterior'] = String($scope.ad.color_exterior.id)
			}
			if($scope.ad.color_interior){
				$scope.ad['color_interior'] = String($scope.ad.color_interior.id)
			}
			if($scope.ad.car_status){
				$scope.ad['car_status'] = String($scope.ad.car_status.id)
			}
			if($scope.ad.car_import){
				$scope.ad['car_import'] = String($scope.ad.car_import.id)
			}
			if($scope.ad.mileage){
				$scope.ad.mileage = parseInt($scope.ad.mileage)
			}
			if($scope.ad.sub_subcategory){
				$scope.ad['sub_subcategory'] = String($scope.ad.sub_subcategory.id)
			}
		}

		if ($scope.ad.latitude == 0 && $scope.ad.longitude == 0){
			$scope.ad.latitude = 29.378586
			$scope.ad.longitude = 47.990341
		}
		if($scope.ad.governorate){
			$scope.ad['governorate'] = String($scope.ad.governorate.id)
		}
		$scope.image_ids = images
	}, function(r){
		$state.go('root.home')
	})

	$scope.selected = function(selected_category, category){
		return parseInt(selected_category) == parseInt(category)
	}

	$scope.sub_selected = function(selected_category, category){
		return parseInt(selected_category) == parseInt(category)
	}

	$scope.update_subcategories = function(category){
		$scope.subcategories = _.filter($scope.categories, {id:category.id})[0].available_subcategories
		$scope.sub_subcategories = []
		$scope.ad.subcategory = null
		$scope.ad.sub_subcategory = null
	}

	$scope.update_sub_subcategories = function(category){
		if(category){
			$scope.sub_subcategories = _.filter($scope.subcategories, {id: parseInt(category)})[0].available_subcategories
		} else {
			$scope.sub_subcategories = []
		}
	}

	$scope.change_category = function(category){
		$scope.selected_category = category
	}
	var image_ids = function() {
		var ids = [];
		_.forEach($scope.images, function(i) {
			ids.push(i.id);
		});
		$scope.image_ids = _.flatten(ids);
	};

	var df = $q.defer();
	var promises = [];
	$scope.loading = 1;


	$scope.delete_image = function(id) {
		API.delete('/ad-image/' + id);
		_.remove($scope.images, function(item) {
			return item.id === id;
		});
		image_ids();
	};

	$scope.uploadFiles = function(file, errFiles) {
		$scope.f = file;
		if(file && errFiles.length === 0) {
			$scope.image_loader = 1;

			var upload_data = {
				file: file
			};

				file.upload = Upload.upload({
					url: CONFIG.api_url() + '/ad-image',
					data: upload_data
				}).then(function(response) {
					$scope.image_loader = 0;
					var image_id = response.data.id;
					API._get('/ad-image/' + image_id).then(function(response) {
						$scope.images.push(response.data);
						$scope.loading = 0;
						$scope.current_image = response.data

						image_ids();
					});
				}, function(response) {
					NOTIFIER.error(gettextCatalog.getString('Image'), gettextCatalog.getString('Upload error'));
				}, function (evt) {
		        	
		    });
		}
	};

	$scope.updateImage = function(img){
			_.forEach($scope.images, function(item){
				if(item.id != img.id){
					if(item.is_cover === true){
						API.patch('/ad-image/'+ item.id, {is_cover: item.is_cover}).then(function(response){
							item.is_cover = false;
						})
					}

				}
			})
			API.patch('/ad-image/'+ img.id, {is_cover: img.is_cover}).then(function(response){
			})
			
	}

	var prepare_ad = function(product) {
		$scope.ad.images = $scope.image_ids.join(',');
	}


	$scope.can_retry = true
	$scope.retry_payment = function(){
		$scope.can_retry = false
		API.post('/ad-retry-payment', {pk:$scope.ad.id}).then(function(r){
			if(r.data.payment_url && r.data.payment_url!=''){
				window.location = r.data.payment_url;
			}
		}, function(r){
			NOTIFIER.error(gettextCatalog.getString('Checkout'), gettextCatalog.getString('We could not reach the payment gateway.'))
			$scope.can_retry = true;
		})
	}

	$scope.submitting = false
	$scope.submit = function(){
		if(!$scope.image_ids){
			NOTIFIER.error(gettextCatalog.getString('Ad'), gettextCatalog.getString('Please add at least 1 image.'));
		} else {
			if(!$scope.adForm.$invalid) {
				prepare_ad()
				NOTIFIER.info(gettextCatalog.getString('Ad'), gettextCatalog.getString('Submitting information.'));
	
				var ad = angular.copy($scope.ad)

				if (ad.latitude == 29.378586 && ad.longitude == 47.990341){
					ad.latitude = 0
					ad.longitude = 0
				}
				ad.category = ad.category.id
				if ($scope.sub_subcategories && $scope.sub_subcategories.length == 0){
					ad.sub_subcategory = null
				}

				// if(!$scope.ad.mileage){
				// 	ad.mileage = ""
				// }
				$scope.submitting = true
				API.patch('/ads/'+ $stateParams.id, ad).then(function(response) {

					if(response.status == 200) {
						$scope.sending = 0;
						NOTIFIER.success(gettextCatalog.getString('Ad'), gettextCatalog.getString('Succesfully updated.'));
						$state.go('root.account.ads')
					} else {
						$scope.sending = 0;
						$scope._saving = 0;
						$scope.submitting = false
						NOTIFIER.error(gettextCatalog.getString('Cannot save'), API.errors(response));
					}
				}, function(response){
						$scope.sending = 0;
						$scope._saving = 0;
						$scope.submitting = false
						NOTIFIER.error(gettextCatalog.getString('Cannot save'), API.errors(response));		
				});

			} else {
				NOTIFIER.error(gettextCatalog.getString('Ad'), gettextCatalog.getString('Please fill all required fields'));
			}
		}
		
	}
})
.controller('AccountEditAuction', function($state, $filter, $stateParams, $timeout, CONFIG, $rootScope, Upload, NOTIFIER, ORDERS, $q, $scope, AUTH, LANGUAGE, USER,API,DATA, gettextCatalog){
	$rootScope.page_title = ''
	$scope.user = angular.copy(USER.data());
	$("html, body").animate({scrollTop: 0}, 1000);
	$scope.logout = function() {
		AUTH.logout();
		
		$state.go('root.home');
	};

	$scope.images = [];
	$scope.added = 0;
	$scope.image_loader = 0;


	if(!DATA.get("_car_info")){
		var df = $q.defer();
		var promises = [];
		promises.push(API.getAll('/car-infos', '_car_info'));
		$q.all(promises).then(function(){
			df.resolve();
		});	
	}


	API.get('/auctions/'+$stateParams.id).then(function(r){
		$scope.ad = r
		var images = []
		angular.forEach($scope.ad.images, function(value, key){
			images.push(value.id)
			$scope.images.push(value);
		})
		$scope.ad['price'] = parseFloat($scope.ad.price)
		$scope.ad['country'] = $scope.ad.country.id
		if($scope.ad.year){
			$scope.ad['year'] = String($scope.ad.year)
		}
		if($scope.ad.color_exterior){
			$scope.ad['color_exterior'] = String($scope.ad.color_exterior.id)
		}
		if($scope.ad.color_interior){
			$scope.ad['color_interior'] = String($scope.ad.color_interior.id)
		}
		if($scope.ad.car_status){
			$scope.ad['car_status'] = String($scope.ad.car_status.id)
		}
		if($scope.ad.car_import){
			$scope.ad['car_import'] = String($scope.ad.car_import.id)
		}
		if($scope.ad.mileage){
			$scope.ad.mileage = parseInt($scope.ad.mileage)
		}
		$scope.image_ids = images
		$scope.ad['car_examination'] = $scope.ad.car_examination.toString()
		console.log($scope.ad)
	}, function(r){
		$state.go('root.home')
	})

	$scope.selected = function(selected_category, category){
		return parseInt(selected_category) == parseInt(category)
	}


	var image_ids = function() {
		var ids = [];
		_.forEach($scope.images, function(i) {
			ids.push(i.id);
		});
		$scope.image_ids = _.flatten(ids);
	};

	var df = $q.defer();
	var promises = [];
	$scope.loading = 1;


	$scope.delete_image = function(id) {
		API.delete('/auction-image/' + id);
		_.remove($scope.images, function(item) {
			return item.id === id;
		});
		image_ids();
	};

	$scope.uploadFiles = function(file, errFiles) {
		$scope.f = file;
		if(file && errFiles.length === 0) {
			$scope.image_loader = 1;

			var upload_data = {
				file: file
			};

				file.upload = Upload.upload({
					url: CONFIG.api_url() + '/auction-image',
					data: upload_data
				}).then(function(response) {
					$scope.image_loader = 0;
					var image_id = response.data.id;
					API._get('/ad-image/' + image_id).then(function(response) {
						$scope.images.push(response.data);
						$scope.loading = 0;
						$scope.current_image = response.data

						image_ids();
					});
				}, function(response) {
					NOTIFIER.error(gettextCatalog.getString('Image'), gettextCatalog.getString('Upload error'));
				}, function (evt) {
		        	
		    });
		}
	};

	$scope.updateImage = function(img){
			_.forEach($scope.images, function(item){
				if(item.id != img.id){
					if(item.is_cover === true){
						API.patch('/auction-image/'+ item.id, {is_cover: item.is_cover}).then(function(response){
							item.is_cover = false;
						})
					}

				}
			})
			API.patch('/auction-image/'+ img.id, {is_cover: img.is_cover}).then(function(response){
			})
			
	}

	var prepare_ad = function(product) {
		$scope.ad.images = $scope.image_ids.join(',');
	}


	$scope.can_retry = true
	$scope.retry_payment = function(){
		$scope.can_retry = false
		API.post('/auction-retry-payment', {pk:$scope.ad.id}).then(function(r){
			if(r.data.payment_url && r.data.payment_url!=''){
				window.location = r.data.payment_url;
			}
		}, function(r){
			NOTIFIER.error(gettextCatalog.getString('Checkout'), gettextCatalog.getString('We could not reach the payment gateway.'))
			$scope.can_retry = true;
		})
	}

	$scope.submitting = false
	$scope.submit = function(){
		if(!$scope.image_ids){
			NOTIFIER.error(gettextCatalog.getString('Auction'), gettextCatalog.getString('Please add at least 1 image.'));
		} else {
			if(!$scope.adForm.$invalid) {
				prepare_ad()
				NOTIFIER.info(gettextCatalog.getString('Auction'), gettextCatalog.getString('Submitting information.'));
	
				var ad = angular.copy($scope.ad)

				$scope.submitting = true
				API.patch('/auctions/'+ $stateParams.id, ad).then(function(response) {

					if(response.status == 200) {
						$scope.sending = 0;
						NOTIFIER.success(gettextCatalog.getString('Auction'), gettextCatalog.getString('Succesfully updated.'));
						$state.go('root.account.my_auctions')
					} else {
						$scope.sending = 0;
						$scope._saving = 0;
						$scope.submitting = false
						NOTIFIER.error(gettextCatalog.getString('Cannot save'), API.errors(response));
					}
				}, function(response){
						$scope.sending = 0;
						$scope._saving = 0;
						$scope.submitting = false
						NOTIFIER.error(gettextCatalog.getString('Cannot save'), API.errors(response));		
				});

			} else {
				NOTIFIER.error(gettextCatalog.getString('Auction'), gettextCatalog.getString('Please fill all required fields'));
			}
		}
		
	}
})