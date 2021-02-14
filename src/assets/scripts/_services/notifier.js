'use strict';

angular.module('app')
	.config(function(toastrConfig) {
		angular.extend(toastrConfig, {
			allowHtml: true,
			maxOpened: 5,
			timeOut: 1500
		});
	})
	.factory('NOTIFIER', function(toastr) {

		return {
			errors: function(title, errors) {
				_.forEach(errors, function(fields, k) {
					_.forEachRight(fields, function(field) {
						if(field) {
							field.$setTouched();
							var name = field.$name.replace(/_/g, ' ').capitalize();
							if(k == 'required') {
								toastr.warning(name + ' is required', title);
							}
							if(k == 'pattern') {
								toastr.warning(name + ' is incorrect format', title);
							}
							if(k == 'minlength') {
								toastr.warning(name + ' is too short', title);
							}
							if(k == 'maxlength') {
								toastr.warning(name + ' is too long', title);
							}
							if(k == 'max') {
								toastr.warning(name + ' is above the maximum', title);
							}
							if(k == 'min') {
								toastr.warning(name + ' is below the minimum', title);
							}
						}
					});
				});
			},
			error: function(title, msg) {
				try{
					msg = msg.replace('non_field_errors:', '');
					toastr.error(msg, title);
				} catch(err){
					_.each(msg, function(value, key){
						toastr.error(value[0], key.toLowerCase().replace(/\b[a-z]/g, function(letter) {
									    return letter.toUpperCase();
									}).replace('_', ' '));
					})

				}
			},
			_error: function(title, msg) {
				toastr.error(msg, title);
			},
			success: function(title, msg) {
				toastr.success(msg, title);
			},
			info: function(title, msg) {
				toastr.info(msg, title);
			},
			short_info: function(msg) {
				toastr.info(msg);
			},
			warn: function(title, msg) {
				toastr.warning(msg, title);
			}

		};

	});
