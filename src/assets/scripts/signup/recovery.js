'use strict';

angular.module('app').
config(function($stateProvider) {
		$stateProvider
			.state('root.recovery', {
				url: 'recovery',
				views: {
					'container@': {
						controller: 'RecoveryCtrl',
						templateUrl: 'scripts/signup/recovery.html',
					}
				}
			});
	})
	.controller('RecoveryCtrl', function($scope, $rootScope, AUTH, DATA, NOTIFIER, ERRORTIPS, gettextCatalog) {
		$scope.step = 0;
		$scope.sending = 0;
		$scope.email = undefined;
		$rootScope.active_menu = 0;
		$("html, body").animate({scrollTop: 0}, 1000);
		$scope.recaptchakey = DATA.get('_recaptchakey');
		$scope.captcha = undefined;
		$scope.captcha_id = 0;
		$rootScope.page_title = ''
		$scope.not_sent = true
		$scope.captcha_create = function(response) {
			$scope.captcha_id = response;
		};
		$scope.captcha_response = function(response) {
			$scope.captcha = response;
		};
		$scope.captcha_expired = function() {
			$scope.captcha = undefined;
		};

		$scope.submit = function() {

			if(!$scope.captcha) {
				NOTIFIER.error(gettextCatalog.getString('Recovery'), gettextCatalog.getString('Please click on reCAPTCHA'));
				return;
			}

			if($scope.sending) {
				return;
			}


			if(!$scope.recoverForm.$invalid) {
				NOTIFIER.info(gettextCatalog.getString('Recovery'), gettextCatalog.getString('We are processing the recovery'));
				$scope.sending = 1;
				AUTH.reset_password_email(angular.lowercase($scope.email)).then(function(response) {
					if(response.status == 200) {
						$scope.step = 1;
						$scope.email = ""
						$scope.sending = 0;
						$scope.not_sent = false;
						NOTIFIER.success(gettextCatalog.getString('Recovery'), gettextCatalog.getString('Please check your mail. We sent you a mail with steps to reset your password.'));
					} else {
						$scope.sending = 0;
						$scope.email = ""
						NOTIFIER.error(gettextCatalog.getString('Recovery'), response.data['email'][0]);
						
					}
				}, function(response){
						$scope.sending = 0;
						$scope.email = ""
						NOTIFIER.error(gettextCatalog.getString('Recovery'), response.data['email'][0]);	
				});
			}
		};

	});
