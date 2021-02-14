'use strict';

angular.module('app')
.factory('LANGUAGE', function($localStorage, $location) {
	var date = new Date();
	date.setDate(date.getDate() + 300);

	var languages = ['en_US', 'ar_AR',];
	var suffixes = ['_en', '_ar'];
	var language_codes = ['عربى', 'EN']

	var default_id = 0; //default language id
	var current_language = $localStorage.language;

	var set_lang = function(lang) {
		current_language = lang;
		window.currentLocale = lang;
		$localStorage.language = lang;
	}

	if(current_language) {
		window.currentLocale = current_language;
	} else {
		set_lang(languages[default_id]);
	}


	var current_id = function(){
		return _.indexOf(languages, current_language)
	}

	var current_suffix = function(){
		return suffixes[current_id()];
	}

	return {
		current: function() {
			return current_language;
		},
		current_code: function() {
			return suffixes[current_id()].substring(1);
		},
		current_suffix: function() {
			return current_suffix();
		},
		default_suffix: function() {
			return suffixes[default_id];
		},
		default_language: function() {
			return languages[default_id];
		},
		current_id: function() {
			return current_id();
		},
		set_id: function(id) {
			set_lang(languages[id]);
		},
		get_current_code: function(id) {
			return language_codes[current_id()]
		},
		localize:function(input, field_name){
			if(input) {
				if(input.hasOwnProperty(field_name + current_suffix()) && !_.isEmpty(input[field_name + current_suffix()])) {
					return input[field_name + current_suffix()];
				}
				if(input.hasOwnProperty(suffixes[default_id])) {
					return input[suffixes[default_id]];
				}
				return '';
			} else {
				return '';
			}
		}
	};
})
.filter('localize', function(LANGUAGE) {
	return function(input, field_name) {
		if(input) {
			if(input.hasOwnProperty(field_name + LANGUAGE.current_suffix()) && !_.isEmpty(input[field_name + LANGUAGE.current_suffix()])) {
				return input[field_name + LANGUAGE.current_suffix()];
			}
			if(input.hasOwnProperty(LANGUAGE.default_suffix())) {
				return input[LANGUAGE.default_suffix()];
			}
			return '';
		} else {
			return '';
		}
	};
});
