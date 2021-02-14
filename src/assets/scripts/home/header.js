'use strict';

angular.module('app')
.controller('HeaderCtrl', function($scope, $auth, gettextCatalog, $q, USER, WISHLIST, COUNTRIES, $state, $filter, $rootScope, $localStorage, $timeout, NOTIFIER, AUTH,  DATA, API) {

	$scope.logout = function() {
		AUTH.logout();
		$state.go('root.home');
	};
	$scope.user = undefined;

	$rootScope.create_ad_open = function(){
		$('#sign-in-up').modal('show')
	}

	$scope.show_more = false
	$scope.show_more_categories = function(){
		$scope.show_more = !$scope.show_more
	}
	$scope.selected_prefix = "+965"

	$(document).delegate('.inputs', 'keyup', function () {

	    $(this).parent().next().find('.inputs').focus();

	});

	$scope.search = function(){
		if(!$scope.search_category){
			NOTIFIER.info(gettextCatalog.getString('Search'), gettextCatalog.getString('Please select a category'));
			return
		}
		if($scope.q){
			if($scope.q.length < 3){
				NOTIFIER.info(gettextCatalog.getString('Search'), gettextCatalog.getString('At least 3 letters are required for searching'));
			} else {

				var q = $scope.q
				// $scope.q = ''
				$('#searchmodal').modal('hide')
				$state.go('root.category', {q:q, id:$scope.search_category.slug})
			}
		} else {
			NOTIFIER.info(gettextCatalog.getString('Search'), gettextCatalog.getString('At least 3 letters are required for searching'));
		}
	}

	$rootScope.COUNTRIES = COUNTRIES
	$rootScope.country = _.filter(DATA.get("_countries"), {id:parseInt($localStorage['country'])})[0]
	$rootScope.change_country = function(id) {
		$rootScope.$broadcast('country:change');
		$rootScope.country = id
		COUNTRIES.set_id(id);
	};
	

	$scope.open_login = function(){
		$('#sign-in-up').modal('show')
	}

	$scope.open_registration = function(){
		$('#sign-in-up').modal('show')
	}

	/* multi step registration n login modal*/
	$scope.IsEnterPhoneVisible = true;
	$scope.IsVeriFormVisible = false;

	$scope.sms_available = false;
	$timeout(function(){

		$scope.sms_available = true
	}, 30000)


	$scope.open_verificationForm = function(){
		var pattern = /^[[0-9]{8,11}$/
		if(!$scope.login_phone){
			NOTIFIER.error(gettextCatalog.getString('Error'), gettextCatalog.getString('Please write your phone number'));
		} else if (!pattern.test($scope.login_phone)) {
			NOTIFIER.error(gettextCatalog.getString('Error'), gettextCatalog.getString('Invalid Phone number.'));
		} else {
			USER.resend($scope.selected_prefix + $scope.login_phone, 0).then(function(response) {
					NOTIFIER.success(gettextCatalog.getString('Login'), gettextCatalog.getString('We will send a code to verify your number.'));
					$scope.activation_code = response.data.activation_code
					$scope.IsEnterPhoneVisible = false;
			        $scope.IsVeriFormVisible = true;
				}, function(response) {
					NOTIFIER.error(gettextCatalog.getString('Error'), gettextCatalog.getString('Invalid Phone number.'));
				});
		}
    }
    
    $scope.close_verificationForm = function(){
    	if(!$scope.code_one && !$scope.code_two && !$scope.code_three && !$scope.code_four && !$scope.code_five && !$scope.code_six){
    		NOTIFIER.error(gettextCatalog.getString('Error'), gettextCatalog.getString('Please write all 6 verification digits'));
    	} else {
			if($scope.sending) {
				return;
			}

			$scope.activation_key = $scope.code_one + $scope.code_two + $scope.code_three + $scope.code_four + $scope.code_five + $scope.code_six

			API.post('/validate-code/'+$scope.activation_code, 
							{phone:$scope.selected_prefix + $scope.login_phone,
							code:$scope.activation_key}).then(function(response){
								console.log(response)
					if(response.data.status == 0){
						NOTIFIER.error(gettextCatalog.getString('Login'), gettextCatalog.getString('Invalid verification code.'));
					} else {
						AUTH.save_session({token: response.data.token, user_id:response.data.user.id}, 1).then(function(response) {
							$scope.sending = 0;
							$rootScope.$broadcast('loggedin');
					    	$('#sign-in-up').modal('hide');
					        $scope.IsVeriFormVisible = false;
					        $scope.IsEnterPhoneVisible = true;
					        $scope.selected_prefix = "+965"
					        $scope.login_phone = ""
							$state.go('root.account');

						})

					}
			})
		

    	}
    }

	$scope.resend = function() {
		USER.resend($scope.selected_prefix + $scope.login_phone, 0).then(function(response) {
			NOTIFIER.success(gettextCatalog.getString('Login'), gettextCatalog.getString('A new sms has been sent.'));

			$scope.activation_code = response.data.activation_code
			$scope.sms_available = false
			$timeout(function(){
					$scope.sms_available = true
				}, 30000)
		}, function(response) {
			if(response.data.non_field_errors) {
				$scope.message = response.data.non_field_errors;
			}
		});
	};

})

