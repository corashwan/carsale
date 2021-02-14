'use strict';

angular.module('app').
config(function($stateProvider) {
		$stateProvider
			.state('root.contact', {
				url: 'contact-us',
				views: {
					'container@': {
						controller: 'ContactCtrl',
						templateUrl: 'scripts/contact_us/contact.html',
					}
				}
			});
	})
	.controller('ContactCtrl', function($scope, $sce, $q, $filter, $rootScope, $localStorage, ERRORTIPS, API, DATA, NOTIFIER, gettextCatalog) {
		$scope.step = 0;
		$scope.sending = 0;
		$("html, body").animate({scrollTop: 0}, 1000);
		$rootScope.page_id = 5
		$scope.trust = function(data){
			return $sce.trustAsResourceUrl(data)
		}

		if(!DATA.get("_contact_details")){
			var df = $q.defer();
			var promises = [];
			promises.push(API.get('/contact-details', '_contact_details'));

			$q.all(promises).then(function(){
				df.resolve();
			});

		}

		$scope.recaptchakey = DATA.get('_recaptchakey');
		$scope.captcha = undefined;
		$scope.captcha_id = 0;
		$scope.captcha_create = function(response) {
			$scope.captcha_id = response;
		};
		$scope.captcha_response = function(response) {
			$scope.captcha = response;
		};
		$scope.captcha_expired = function() {
			$scope.captcha = undefined;
		};
		$scope.recaptcha_error = 0;
		$scope.submit = function() {

			if(!$scope.captcha) {
				$scope.recaptcha_error = 1;
				NOTIFIER.error(gettextCatalog.getString('Contact'), gettextCatalog.getString('Please click on reCAPTCHA'));
				return;
			}else{
				$scope.recaptcha_error = 0;
			}

			if($scope.sending) {
				return;
			}

			if(!$scope.contactForm.$invalid) {
				$scope.sending = 1;
				API.post('/create-contact', $scope.contact).then(function(response) {
					$scope.step = 1;
					$scope.sending = 0;
					$scope.contact = {}

					NOTIFIER.success(gettextCatalog.getString('Contact'), gettextCatalog.getString('Message sent'));
				}, function(response) {
					
					$scope.sending = 0;
					$scope.step = 0
				
					ERRORTIPS.list('contactForm', response.data);
					
				});
			}
		};

	});
