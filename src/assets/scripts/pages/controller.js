'use strict';

angular.module('app')
.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('root.page', {
			url: 'pages/:slug',
			views: {
				'container@': {
					controller: 'PagesCtrl',
					templateUrl: 'scripts/pages/page.html'
				}
			}
		})
		.state('root.sitemap', {
			url: 'sitemap',
			views: {
				'container@': {
					controller: 'SitemapCtrl',
					templateUrl: 'scripts/pages/sitemap.html'
				}
			}
		})
		;
})
.controller('PagesCtrl', function($scope, $filter, $sce, $rootScope, $state, $stateParams, DATA) {
	$("html, body").animate({scrollTop: 0}, 1000);

	if($stateParams.slug!=''){
		var page = _.find(DATA.get('pages'),{slug:$stateParams.slug});
		if(!_.isObject(page)){
			page = _.find(DATA.get('pages'),{slug:'404'});
		}
		$scope.page = page;
		if($scope.page.slug == "about"){
			$rootScope.page_id = 1
		} else {
			$rootScope.page_id = -1
		}
		$rootScope.page_title = $filter('localize')(page, 'page_title')
	}

		$scope.deliberatelyTrustDangerousSnippet = function(description) {
               return $sce.trustAsHtml(description);
             };

})
.controller('SitemapCtrl', function($scope, $state, $stateParams, DATA,OCCASIONS, VENDORS) {
	//copy to app.js rootCtrl also for mobile menu
	$scope.occasions = OCCASIONS.slugify();
	$scope.pages = _.reject(DATA.get('pages'),function(item){
		var exclude = [0,3,5];//404
		if(exclude.indexOf(item.id)>-1){return true;}
	});
	$scope.lang_name = function(row){
		if($scope.is_root_ar)
			return row.name_ar;
		else
			return row.name_en;
	}
	$scope.vendors = _.filter(VENDORS.list(),function(item){
		if(item.is_active && (item.has_shop_products > 0 || item.has_catering_products > 0 || item.has_customization_products > 0))
			return true;
		return false;
	});
})
;
