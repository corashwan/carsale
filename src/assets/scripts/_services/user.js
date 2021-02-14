'use strict';

angular.module('app')
	.factory('USER', function(API, $q, $localStorage, $sessionStorage, NOTIFIER, gettextCatalog) {

		var user = {};
		var permissions = [];

		function add_permission(str) {
			var strs = str.split(',');
			permissions = _.union(permissions, strs);
		}

		function grant_permissions() {
			if(user.is_active) {
				add_permission('loggedin');
			}
		}

		return {
			wishlist_id: function() {
				return user.wishlist_id;
			},
			data:function(){
				return user;
			},
			update:function(data){


				if(data.permissions=="") delete data.permissions;

				return API.patch('/user/'+user.id,data).then(function(r){
					user = r.data;
					return r;
				})
			},
			permissions: function() {
				return permissions;
			},
			staff_permissions_default: function() {
				return staff_permissions;
			},
			can: function(permission) {
				if(this.is('vendor') && !this.is('staff'))return true;
				else{
					var perms = angular.fromJson(user.permissions);
					if(perms.indexOf(permission)>-1) return true;
					else return false;
				}
			},
			data:function(){
				return user;
			},
			get_data: function(field) {
				if(user[field]) {
					return user[field];
				}
			},
			register: function(data) {
				return API.post('/registration', data);
			},
			validate_account: function(data) {
				return API.post('/validate-registration', data);
			},
			activate: function(hash) {
				return API.post('/activate-account', {
					'activation_key': hash
				});
			},
			resend: function(phone) {
				return API.post('/resend-code', {
					'phone': phone,
				});
			},
			// activate: function(hash) {
			// 	return API.post('/activate-account', {
			// 		'activation_key': hash
			// 	});
			// },
			// resend: function(country_code, phone) {
			// 	return API.post('/resend-code', {
			// 		'phone': phone,
			// 		'country_code': country_code
			// 	});
			// },
			remove_permission: function(str) {
				var strs = str.split(',');
				_.forEach(strs, function(val) {
					_.pull(permissions, val);
				});
			},
			is: function(str) {
				var request = str.split(',');
				if(request.length == 1) {
					if(_.indexOf(permissions, request[0]) > -1) {
						return true;
					} else {
						return false;
					}
				}
				if(request.length > 1) {
					var request_num = request.length;
					var grant = 0;
					_.forEach(request, function(val) {
						if(_.indexOf(permissions, val) > -1) {
							grant++;
						}
					});
					if(request_num == grant) {
						return true;
					} else {
						return false;
					}
				}
			},
			get: function(field) {
				if(field == 'vendor' || field == 'vendor_id') {
					return user.shop_id;
				} else {
					return user[field];
				}
			},
			set: function(field, value) {
				user[field] = value;
			},
			destroy: function() {
				user = {};
				permissions = {};

			},
			load_id: function(id) {
				return API._get('/user/' + id+'?country='+$localStorage['country']).then(function(result) {
					user = result.data;
					grant_permissions();
					return user;
				}, function(result) {
					//user_id is not existing in API
					delete $localStorage.user_id;
					delete $sessionStorage.user_id;
					return '404';
				});
			},
			id: function() {
				if(user.id) {
					return user.id;
				} else {
					return 0;
				}
			},
			change_password: function(data){
				return API.post('/change-password', data).then(function(r){
			
					return r;
				})
			},

		};

	});
