'use strict';
angular.module('app')
.factory('ERRORTIPS', function($rootScope) {//event transport
	var data = [];
	var form = '';
	//define local fields = api fields for each form
	var forms = {
		'registerForm':{
			shop_name:['name_en','name_ar'],
			shop_phone:['phone'],
			shop_email:['email']
		}
	};

	return {
		
		forms:function(){
			return forms;
		},
		list: function(f,d) {
			form = f;
			data = d;
			$rootScope.$broadcast('errortip:list');
		},
		validate:function(){
			$rootScope.$broadcast('errortip:validate');
		},
		get_field: function(field) {
			return data[field];
		},
		get_error: function(form_name,field){
			if(form==form_name){
				if(forms[form_name] && forms[form_name][field]){
					var sfs = forms[form_name][field];
					var m = undefined;
					_.forEach(sfs,function(sf){
						if(data[sf] && !m) m = data[sf][0];
					})
					if(!m) m='';
					return m;
				}else {
					return data[field];
				}
			}
		}
	};

})
.directive('nopaste', function() {
	return function(scope, element, attrs) {
            element.on('paste', function (event) {
              event.preventDefault();
            });
	};
})
.directive('errortip', function(gettext, ERRORTIPS, $compile, $rootScope, gettextCatalog, LANGUAGE) {
	return {
		restrict: 'A',
		scope: {
			form:'=errortip',
			model:'=ngModel',
			passwordVerify: '=passwordVerify'
		},
		require:"ngModel",
		link: function(scope, element, attributes, ctrl) {

			scope.$watch(function(){
			  return LANGUAGE.current_code();
			}, function(newCodes, oldCodes){
				if(newCodes != oldCodes){
					element.parent().find('.error-tip').remove()
					element.parent().prepend($compile('<div class="error-tip" ng-show="show || show_s">&nbsp;{{message}}</div>')(scope));
					parseErrors(scope.form);
				}})
			element.parent().prepend($compile('<div class="error-tip" ng-show="show || show_s">&nbsp;{{message}}</div>')(scope));

			scope.name = attributes.name;

			scope.show_s = 0;
			scope.show = 1;
			scope.has_errors = 0;
			var parseErrors = function(errors){
				var field_errors = scope.form[scope.name].$error;
				_.forEach(_.keys(field_errors),function(type){
					if(type=='pattern'){
						scope.message = gettextCatalog.getString('Incorrect format');
					}
					if(type=='email' || (type=='pattern'&& scope.name=='email')){
						scope.message = gettextCatalog.getString('Incorrect email');
					}
					if(type=='minlength'){
						scope.message = gettextCatalog.getString('Too short');
					}
					if(type=='maxlength'){
						scope.message = gettextCatalog.getString('Limit Reached');
					}
					if(type=='min'){
						scope.message = gettextCatalog.getString('Min value exceeded');
					}
					if(type=='match'){
						scope.message = gettextCatalog.getString('Already used');
					}
					if(type=='max'){
						scope.message = gettextCatalog.getString('Max value exceeded');
					}
					if(type=='required'){
						scope.message = '*';
					}
					if(type=='nomatch'){
						scope.message = gettextCatalog.getString('Not matching');
					}
				});
				if(_.keys(field_errors).length>0){
					scope.show = 1;
				}else{
					scope.show = 0;
				}
			}


			element.bind('change keydown',function(){
				parseErrors(scope.form);
			});

			scope.$watch('model', function(val){
				parseErrors(scope.form.$error);
			});

			ctrl.$validators.nomatch = function(modelValue, viewValue) {
				if(!scope.passwordVerify) return true;
		        if (ctrl.$isEmpty(modelValue)) {
		          return false;
		        }
		        if (modelValue == scope.passwordVerify) {
		          return true;
		        }
		        return false;
			};

			scope.$on('errortip:validate', function(){
				parseErrors(scope.form.$error)
			});

			scope.$watch('passwordVerify', function(val) {
				parseErrors(scope.form.$error);
			});
		},
		controller:function($scope,$rootScope,ERRORTIPS){

			$rootScope.$on('errortip:list', function(){
				var message = ERRORTIPS.get_error($scope.form.$name,$scope.name);
				if(message){
					$scope.show = 1;
					$scope.message = message;
				}
			});
		}
	};
});
