'use strict';

angular.module('app')
.factory('ORDERS', function(gettextCatalog, LANGUAGE, $rootScope) {

//0 - PENDING * 1 - IN PROGRESS * 2 - DELIVERED * 3 - CANCELED
	var _states = [
		{id:0,name:gettextCatalog.getString("Cash")},
		{id:1,name:gettextCatalog.getString("KNET")},
		{id:2,name:gettextCatalog.getString("MASTERCARD/VISA")},
	];

	var _address_states = [
		{id:0,name:gettextCatalog.getString("Apartment")},
		{id:1,name:gettextCatalog.getString("House")},
		{id:2,name:gettextCatalog.getString("Office")},
	];


	var _day_states = [
		{id:0,name:gettextCatalog.getString("Products")},
		{id:1,name:gettextCatalog.getString("Program")},
		{id:2,name:gettextCatalog.getString("Subscription Meal")},
	];

	$rootScope.$watch(function(){
	  return LANGUAGE.current_code();
	}, function(newCodes, oldCodes){
		if(newCodes != oldCodes){
			
			_states = [
				{id:0,name:gettextCatalog.getString("Cash")},
				{id:1,name:gettextCatalog.getString("KNET")},
				{id:2,name:gettextCatalog.getString("MASTERCARD/VISA")},
			];

			_address_states = [
				{id:0,name:gettextCatalog.getString("Apartment")},
				{id:1,name:gettextCatalog.getString("House")},
				{id:2,name:gettextCatalog.getString("Office")},
			];

			_day_states = [
					{id:0,name:gettextCatalog.getString("Products")},
					{id:1,name:gettextCatalog.getString("Program")},
					{id:2,name:gettextCatalog.getString("Subscription Meal")},
				];
		}
	});



	return {
		states:function(id){
			if(_.isArray(id)){
				var states = _.filter(_states,function(item) {
					return (id.indexOf(item.id)>-1);
				});
				return states;
			}
			if(_.isNumber(id)){
				return _states[id];
			}
			return _states;
		},
		types:function(id){
			if(_.isArray(id)){
				var states = _.filter(_address_states,function(item) {
					return (id.indexOf(item.id)>-1);
				});
				return states;
			}
			if(_.isNumber(id)){
				return _address_states[id];
			}
			return _address_states;
		},
		days:function(id){
			if(_.isArray(id)){
				var states = _.filter(_day_states,function(item) {
					return (id.indexOf(item.id)>-1);
				});
				return states;
			}
			if(_.isNumber(id)){
				return _day_states[id];
			}
			return _day_states;
		},
	};
});
