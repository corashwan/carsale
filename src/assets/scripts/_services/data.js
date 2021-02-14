'use strict';

angular.module('app')
	.factory('DATA', function($localStorage, $sessionStorage) {
		var data = {};
		return {
			set: function(k, v) {
				data[k] = v;
			},
			get: function(k) {
				if(data[k])
					return data[k];
			},
			local: $localStorage,
			session: $sessionStorage,
			all: function() {
				return data;
			},
			pick: function(source, fields) {
				var data = {};
				_.forEach(fields, function(k) {
					if(source[k]) {
						data[k] = source[k];
					}
				});
				return data;
			}
		};
	});
