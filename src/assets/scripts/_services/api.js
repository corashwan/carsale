'use strict';

angular.module('app')
	.factory('API', function($http, CONFIG, DATA, $filter, LANGUAGE) {
		return {
			get: function(endpoint, to_data, field) {
				return $http.get(CONFIG.api_url() + endpoint)
					.then(function(response) {
						if(field) {
							DATA.set(to_data, response.data[0][field]);
							return response.data[0][field];
						} else if(to_data) {
							if(response.data.length == 1) {
								DATA.set(to_data, response.data[0]);
								return response.data[0];
							} else {
								DATA.set(to_data, response.data);
								return response.data;
							}
						} else {
							if(response.data) {
								return response.data;
							} else {
								return {};
							}
						}
					});
			},
			_get: function(endpoint) {
				return $http.get(CONFIG.api_url() + endpoint);
			},
			getAll: function(endpoint, to_data) {
				return $http.get(CONFIG.api_url() + endpoint)
					.then(function(response) {
						if(to_data) {
							DATA.set(to_data, response.data);
							return response.data;
						} else {
							return response.data;
						}
					});
			},
			getAllNoDmain: function(endpoint, to_data) {
				return $http.get(endpoint)
					.then(function(response) {
						if(to_data) {
							DATA.set(to_data, response.data);
							return response.data;
						} else {
							return response.data;
						}
					});
			},
			post: function(endpoint, data) {
				return $http.post(CONFIG.api_url() + endpoint, data)
			},
			put: function(endpoint, data) {
				return $http.put(CONFIG.api_url() + endpoint, data)
					.then(function(response) {
						return response;
					}, function(response) {
						return response;
					});
			},
			patch: function(endpoint, data) {
				return $http.patch(CONFIG.api_url() + endpoint, data)
					.then(function(response) {
						return response;
					}, function(response) {
						return response;
					});
			},
			delete: function(endpoint) {
				return $http.delete(CONFIG.api_url() + endpoint)
					.then(function(response) {
						return response;
					}, function(response) {
						return response;
					});
			},
			errors: function(response, field) {
					var errors = [];
	
					if(!field) {
						if(_.isObject(response.data)) {
							_.forEach(response.data, function(k, v) {
								errors.push(v + ': ' + k[0]);
							});
							errors = errors.join("<br>");
						} else {
							errors = $filter('htmlToPlaintext')(response.data);
						}
						return errors;
					} else {
						if(_.isArray(response.data[field])) {
							return response.data[field].join('<br>');
						} else {
							return response.data[field];
						}
					}
				}
		};

	})
	.factory('myInterceptor', function($localStorage,$sessionStorage, LANGUAGE){
	    var myInterceptor = {
	        request:function(config){
				if($localStorage.token || $sessionStorage.token){
					config.headers.Authorization = 'Token ' + ($localStorage.token || $sessionStorage.token);
				}
				config.headers['Accept-Language'] = LANGUAGE.current_code();
	        	return config;
	        }
	    }
	    return myInterceptor;
	})
	.config(function($httpProvider) {
	    $httpProvider.interceptors.push('myInterceptor');
	})
;
