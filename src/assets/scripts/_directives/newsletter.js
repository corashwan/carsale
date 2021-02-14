'use strict';
angular.module('app')
    .directive('newsletter', function(API, NOTIFIER, gettextCatalog) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'scripts/_directives/form.html',
            link: function(scope, element, attrs) {
				scope.submit = function(){
                    if(scope.newsletter){
    					API.post('/create-newsletter', scope.newsletter).then(function(response) {
    						NOTIFIER.success(gettextCatalog.getString('Newsletter'), gettextCatalog.getString('Succesfully subscribed to newsletter.'));
    					}, function(errors) {
    						NOTIFIER.error(gettextCatalog.getString('Newsletter'), errors.data['email'][0]);
    					});
                        
                    } else {
                        NOTIFIER.error(gettextCatalog.getString('Newsletter'), gettextCatalog.getString('Email is required.'));
                    }
				}
            }
        }
    })