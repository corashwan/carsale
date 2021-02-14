'use strict';

angular.module('app').
config(function($stateProvider) {
		$stateProvider
			.state('root.reset', {
				url: 'password-reset/*token',
				views: {
					'container@': {
						controller: 'ResetCtrl',
						templateUrl: 'scripts/signup/reset.html',
					}
				}
			}).state('root.reset_error', {
				url: 'password-reset',
				views: {
					'container@': {
						controller: 'ResetCtrl',
						templateUrl: 'scripts/signup/reset.html',
					}
				}
			});
	})
	.controller('ResetCtrl', function($scope, $rootScope, $stateParams,  AUTH, DATA, NOTIFIER, ERRORTIPS, gettextCatalog) {
		$scope.step = 0;
		if(_.isUndefined($stateParams) || _.isEmpty($stateParams.token)) {
			$scope.step = 2;
		}
		$("html, body").animate({scrollTop: 0}, 1000);
		$rootScope.page_title = ''
		AUTH.reset_token_check($stateParams.token).then(function(response) {}, function(response) {
			$scope.step = 3;
			NOTIFIER._error(gettextCatalog.getString('Password reset'), response.data.errors);
		});

		$scope.sending = 0;


		$scope.submit = function() {


			if($scope.sending) {
				return;
			}


			if(!$scope.resetForm.$invalid) {
				NOTIFIER.info(gettextCatalog.getString('Password reset'), gettextCatalog.getString('We are processing the request'));
				$scope.sending = 1;
				AUTH.reset_password($stateParams.token, $scope.user.password, $scope.user.confirm_password).then(function(response) {
					if(response.status == 200) {
						$scope.step = 1;
						$scope.sending = 0;
						NOTIFIER.success(gettextCatalog.getString('Password reset'), gettextCatalog.getString('We sent you an email with instructions'));
					} else {
						//$scope.step = 2;
						$scope.sending = 0;
						ERRORTIPS.list('resetForm',response.data);
					
					}

				});
			}
		};

	})

;
