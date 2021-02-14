'use strict';

angular.module('app').
config(function($stateProvider) {
		$stateProvider
			.state('root.faq', {
				url: 'faq',
				views: {
					'container@': {
						controller: 'FAQCtrl',
						templateUrl: 'scripts/faq/faq.html',
					}
				}
			});
	})
	.controller('FAQCtrl', function($scope, $timeout, $filter, $q, $rootScope, API, DATA) {
		$("html, body").animate({scrollTop: 0}, 1000);
		$rootScope.active_menu = ''
		$rootScope.page_title = $filter('localize')($rootScope.MENU_ITEMS, 'faq')
		var df = $q.defer();
		var promises = [];
		if(!DATA.get('_faq')){
			promises.push(API.getAll('/faq', '_faq'));

			$rootScope.is_ready = false;
			$q.all(promises).then(function() {
				$scope.faq = DATA.get('_faq')
				$timeout(function(){
					$rootScope.is_ready = true;
				}, 500)
			});

		} else {
			$scope.faq = DATA.get('_faq')
		}

	});
