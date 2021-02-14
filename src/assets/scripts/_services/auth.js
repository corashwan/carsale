'use strict';

angular.module('app')
	.service('AUTH', function(USER, API, $rootScope, $http, $localStorage, $httpParamSerializerJQLike, $sessionStorage, WISHLIST, $state, CONFIG, gettextCatalog, NOTIFIER) {
		var loaded = false;
		return {
			login: function(email, password) {
				return API.post('/login', {
					username: email,
					password: password,
				});
			},
			logout: function() {
				USER.destroy();
				loaded = false;
				delete $localStorage.token;
				delete $localStorage.user_id;
				delete $sessionStorage.token;
				delete $sessionStorage.user_id;
				// $state.go('root.home')
			},
			reset_password_email: function(email) {
				return API.post('/forgot-password', {
					email: email
				});
			},
			reset_password: function(token, p, cp) {
				return API.post('/password-reset/' + token, {
					token: token,
					password: p,
					confirm_password: cp
				});
			},
			reset_token_check: function(token) {
				return API._get('/password-reset/' + token);
			},
			save_session: function(data,remember) {
				if(!remember) remember = 0;
				if(!data['user_id']){
					data['user_id'] = data['id']
				}
				if(remember == 1){
					$localStorage.token = data.token;
					$localStorage.user_id = data.user_id;
				}else{
					$sessionStorage.token = data.token;
					$sessionStorage.user_id = data.user_id;
				}
				return USER.load_id(data.user_id);
			},
			has_session: function() {
				if(
					(_.isNumber($localStorage.user_id) && $localStorage.user_id > 0 && !_.isUndefined($localStorage.token)) ||
					(_.isNumber($sessionStorage.user_id) && $sessionStorage.user_id > 0 && !_.isUndefined($sessionStorage.token))
				)  {
					return true;
				} else {
					return false;
				}
			},
			session_loaded: function(data) {
				if(data) {
					loaded = true;
				}
				return loaded;
			},
			load_session: function() {
				return USER.load_id($localStorage.user_id||$sessionStorage.user_id);
			},
			social_register: function(data, type) {
				
				var post = {
					access_token: data.access_token,
					backend: type,
				};
				var save_session = this.save_session
				if(type == 'google'){
					var post_data = {
						'grant_type': 'authorization_code',
						'client_secret': CONFIG.get('GOOGLE_SECRET'),
						'client_id':  CONFIG.get('GOOGLE_KEY'),
						'redirect_uri': 'https://77carsale.com',
						'code': data.config.data['code']
					}
	
					$http({
						data: $httpParamSerializerJQLike(post_data),
						url: 'https://www.googleapis.com/oauth2/v3/token',
						method: 'POST',
						headers:{
						'Content-Type': 'application/x-www-form-urlencoded'
							}
						}).then(function(r){
							API.post('/social-register/', {
								backend: 'google-oauth2',
								access_token: r.data.access_token
							}).then(function(response){
								if(response.status == 200) {
									save_session(response.data).then(function(response) {
									WISHLIST.resume();
									$('#sign-in-up').modal('hide')
									$('#sign-up').modal('hide')
									NOTIFIER.success(gettextCatalog.getString('Login'), gettextCatalog.getString('Welcome'));
									$state.go('root.account');

								});

								}
							})
						}, function(r){
							console.log(r)
						})
				} else {

					if(data.data && data.data.oauth_token) post.access_token = {oauth_token:data.data.oauth_token[0], oauth_token_secret:data.data.oauth_token_secret[0]};

					//linkedin
					if(data.expires_in) post.expires_in = data.expires_in;
					if(data.code) post.code = data.code;
					if(data.client_id) post.client_id = data.client_id;
					if(data.state) post.state = data.state;

					return API.post('/social-register/', post);
				}
			},
		};

	})

;
