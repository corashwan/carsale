'use strict';

angular.module('app')
.factory('COUNTRIES', function($rootScope, $localStorage, $filter, $location, DATA) {

	var countries = [];
	var current_country = 0 ;
	var default_country = {};
	var default_id = default_country; //default country id

	$rootScope.$watch(function(){
	  return DATA.get("_countries");
	}, function(newCodes, oldCodes){
		if(!oldCodes && newCodes){
			countries = DATA.get("_countries");
			init_data()
		}
	})

	var init_data = function(){
		default_country = _.filter(countries, {'country_code': "KW"})[0];
		default_id = default_country; //default country id
		current_country = _.filter(countries, {'id': $localStorage.country})[0] ;

		if(current_country) {
		} else {
			set_country(default_country);
		}
	}

	var set_country = function(country) {
		current_country = country;
		$localStorage.country = country.id;
	}
	var set_country_by_code = function(code){
		var country_by_code = _.filter(countries, {'country_code': code})[0]
		current_country = country_by_code;
		$localStorage.country = current_country.id;	
	}

	var current_id = function(){
		return _.filter(countries, {'id': current_country.id})[0].id
	}
	
	return {
		current: function() {
			return current_country;
		},
		get_default_country: function() {
			return default_country;
		},
		current_id: function() {
			return current_id();
		},
		set_id: function(country) {
			set_country(country);
		},
		set_by_code: function(code) {
			set_country_by_code(code);
		},
		// get_total_ads: function(category){
		// 	return _.filter(category.total_ads, {country: parseInt($localStorage['country'])})[0]['ads']
		// }

	};
})
