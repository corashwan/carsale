'use strict';

angular.module('app')
.factory("WISHLIST", function($localStorage, $rootScope, $q, $filter, API, USER, NOTIFIER, DATA, gettextCatalog) {
	var wishlist_id = $localStorage.wishlist_id || 0;
	var resume_promise = undefined;
	var items = [];

	var empty = function(new_id) {
		items = [];
		wishlist_id = new_id;
		$localStorage.wishlist_id = wishlist_id;

	};

	var process_lines = function(new_lines) {
		var new_items = [];

		_.forEach(new_lines, function(line) {
			var nitem = {};
			nitem.product = line;
			nitem.id = line.id
			nitem.qt = 1
			new_items.push(nitem);
		});
		items = new_items;
	};

	var create_for_user = function(){
		return API.post('/wishlist',{user:USER.id()}).then(function(response) {
			empty(response.data.id);

		});
	}

	var create = function(){
		return API.post('/wishlist').then(function(response) {
			empty(response.data.id);

		});
	}

	return {
		get: function(field) {
			if($localStorage['wishlist_' + field]) {
				return $localStorage['wishlist_' + field];
			}
		},
		resume: function(id){
			var server_wishlist_id = USER.get_data('wishlist_id');
			
			var $this = this
			if( server_wishlist_id > 0){
				wishlist_id = server_wishlist_id;
				$localStorage.wishlist_id = wishlist_id;
				id = wishlist_id;
			}
			resume_promise = API.get('/wishlist/' + id).then(function(response) {


					process_lines(response.ads);
					
				
			},function(){
				$this.empty()
			});
		},
		items: function() {
			return items;
		},
		create: function() {
			return create();
		},

		create_for_user:function() {
			return create_for_user();
		},
		empty:  function(){
			if(USER.id()>0) { return this.create_for_user() }
			else { return this.create() }

		},

		add: function(product) {
			var def = $q.defer();
			var reject = 0;

			var added = false;
			if(!added) {

				var products = _.map(items, 'id')
				var post = {
					ad: product.id,
					
				};

				if(!reject){
					API.patch('/wishlist/'+wishlist_id, post).then(function(response) {
						if(response.status == 200) {
							process_lines(response.data.ads)
							
							NOTIFIER.success($filter('localize')(product, 'name'), gettextCatalog.getString('Ad has been added to favorites.'));
						} else {
							NOTIFIER.error(gettextCatalog.getString('Cannot add'), response.data);
						}
						def.resolve();
					}, function(r){
						if(r.status == 400){
							NOTIFIER.error($filter('localize')(product, 'name'), r.data[0]);
						}
						def.resolve()
					});
				}

			}
			return def.promise;
		},
		
		remove: function(product) {
			var def = $q.defer();
			var reject = 0;

			var added = false;
			if(!added) {

				var products = _.map(items, 'id')
				var post = {
					ad: product.id,
				};

				if(!reject){
					API.patch('/wishlist/'+wishlist_id, post).then(function(response) {
						if(response.status == 200) {
							process_lines(response.data.products)
							
							NOTIFIER.success($filter('localize')(product, 'name'), gettextCatalog.getString('Ad has been removed from favorites.'));
						} else {
							NOTIFIER.error(gettextCatalog.getString('Cannot remove'), response.data);
						}
						def.resolve();
					}, function(r){
						if(r.status == 400){
							NOTIFIER.error($filter('localize')(product, 'name'), r.data[0]);
						}
						def.resolve()
					});
				}

			}
			return def.promise;
		}
	};
})

;
