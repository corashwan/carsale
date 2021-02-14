'use strict';

var is_root_ar = 0;

angular
.module('app', [
	'ngAnimate',
	'ngCookies', 'ngStorage',
	'ngResource',
	'ngRoute', 'slugifier',
	'ngSanitize',
	'ngTouch',
	'ui.router', ,
	'gettext', 'angularMoment',
	'toastr', 
	'vcRecaptcha',
	'ui.select',
	'ui.select2',
	'GoogleMapsNative',
	'ngMap',
	'satellizer',
	'rzModule',
	'720kb.socialshare',
	'ngFileUpload',
	'timer',


])
.constant('_', window._)
.config(function($stateProvider, $urlRouterProvider, $compileProvider, $authProvider) {
	$urlRouterProvider.otherwise('/');
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|whatsapp|fb-messenger):/);
	var root_lang = '/';

	$stateProvider
		.state('root', {
			url: root_lang,
			abstract: true,
			resolve: {
				preloader: function(preloader) {
					return preloader;
				}
			},
			views: {
				'top': {
					templateUrl: 'scripts/home/header.html',
					controller: 'HeaderCtrl'
				},
				'bottom': {
					templateUrl: 'scripts/home/footer.html',
					controller: 'FooterCtrl'
				}
			}
		});
	$authProvider.facebook({
		clientId: site_config.FACEBOOK_KEY,
		responseType: 'token',
		url: ''
	});
	$authProvider.google({
		clientId: site_config.GOOGLE_KEY,
		// responseType: 'token',
		// url: ''
	});
})
.factory('bootloader',function(CONFIG, API, $state, WISHLIST, AUTH,$localStorage, $rootScope, $sessionStorage, $q, DATA, LANGUAGE){
	CONFIG.set(site_config); //loaded from config.js
	var df = $q.defer();
	var promises = [];
	$rootScope.is_ready = false;
	if ($localStorage['country'] == undefined){
		$localStorage['country'] = 1
	}

	promises.push(API.get('/recaptcha-settings', '_recaptchakey', 'public_key'));
	promises.push(API.getAll('/countries', '_countries'));
	promises.push(API.getAll('/categories-with-price-range', '_categories'));
	$q.all(promises).then(function() {
		df.resolve();
		if($localStorage.user_id){

			promises.push(API.getAll('/user/'+$localStorage.user_id, '_user').then(function(r){

			},function(){//if token is expired or invalid
				
				delete $localStorage.token;
				delete $sessionStorage.token;
				delete $localStorage.user_id;
				delete $sessionStorage.user_id;
				$state.go('root.home');
			}));

		} else {
			delete $localStorage.token;
			delete $sessionStorage.token;
			delete $localStorage.user_id;
			delete $sessionStorage.user_id;

		}
		$rootScope.is_ready = true;
	});
	return df.promise;
})
.factory('preloader', function(bootloader, API, $location, AUTH, $timeout, WISHLIST, $rootScope, $state, $localStorage, NOTIFIER, $q, DATA, gettextCatalog) {
	var df = $q.defer();
	var promises = [];

	bootloader.then(function(){
		if(AUTH.has_session()){
			if(!AUTH.session_loaded()) {
				promises.push(
					AUTH.load_session().then(function(data){
						if(data != 404) {
							AUTH.session_loaded(true);
							WISHLIST.resume();
						}
					})
				);
			}
		}else{
			delete $localStorage.token;
		}

		
		promises.push(API.getAll('/social-links', '_social-links'));
		promises.push(API.get('/mobile-links', '_mobile_links'));
		promises.push(API.get('/logo', '_logo'));
		promises.push(API.get('/copyright', '_copyright'));
		promises.push(API.getAll('/flat-pages', 'pages'));	
		$q.all(promises).then(function(){
			df.resolve();
			// var promises = [];
			// $rootScope.is_ready = true;
			// if($location.path() == '/') {
			// 	$timeout(function(){
			// 		$rootScope.is_ready = true;
			// 	}, 1000)

			// } else {
			// }
		});
	});
	return df.promise;
})
.controller('rootCtrl', function($scope, $rootScope, $stateParams, LANGUAGE, $state, DATA, preloader, Slug) {



})
.run(function($state, $rootScope, $route, $interval, $transitions, WISHLIST, gettextCatalog, $q, $localStorage, AUTH, USER, NOTIFIER, LANGUAGE, CONFIG, DATA, $location, preloader, $timeout) {
	$rootScope.active_menu = 'home'
	$rootScope.show_sidemenu = false;
	$rootScope._ = window._;
	$rootScope.$state = $state;
	$rootScope.WISHLIST = WISHLIST;
	$rootScope.DATA = DATA;
	$rootScope.USER = USER;
	$rootScope.LANGUAGE = LANGUAGE;
	$rootScope.GMAP_KEY = CONFIG.get('GMAP_KEY');

	function makeid(length) {
	   var result           = '';
	   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	   var charactersLength = characters.length;
	   for ( var i = 0; i < length; i++ ) {
	      result += characters.charAt(Math.floor(Math.random() * charactersLength));
	   }
	   return result;
	}

	if (!$localStorage['serial_key']){
		$localStorage['serial_key'] = makeid(25);
	}

	gettextCatalog.setCurrentLanguage(LANGUAGE.current_code());
	// gettextCatalog.debug = true;
	$rootScope.css_list = [];
	$rootScope.q = '';
	if(LANGUAGE.current_id()==1){
		$rootScope.css_list.push('/styles/ar.css');
		// $rootScope.css_list.push('/styles/bootstrap-rtl.css');
		// $rootScope.css_list.push('/styles/rtl.css');
	}

	if(!$localStorage['ads']){
		$localStorage['ads'] = {};
	}
	if(!$localStorage['auctions']){
		$localStorage['auctions'] = {};
	}
	$interval(function(){
		if($localStorage['ads']){
			for(var key in $localStorage['ads']){
				var current_date = new Date()
				var diff = Math.abs(new Date() - $localStorage['ads'][key]);
				var minutes = Math.floor((diff/1000)/60);

				if(minutes >= 15){
					delete $localStorage['ads'][key]

				}
			}
		}
		if($localStorage['auctions']){
			for(var key in $localStorage['auctions']){
				var current_date = new Date()
				var diff = Math.abs(new Date() - $localStorage['auctions'][key]);
				var minutes = Math.floor((diff/1000)/60);

				if(minutes >= 15){
					delete $localStorage['auctions'][key]

				}
			}
		}
	}, 15*60000)


	$rootScope.dir = ""
	$rootScope.change_language = function() {
		$rootScope.$broadcast('language:change');
		if(LANGUAGE.current_id()==0){
			LANGUAGE.set_id(1);
			$rootScope.dir = "rtl"
			$rootScope.css_list.push('/styles/ar.css');
			// $rootScope.css_list.push('/styles/bootstrap-rtl.css');
			// $rootScope.css_list.push('/styles/rtl.css');
		} else {
			LANGUAGE.set_id(0);
			$rootScope.dir = ""
			$rootScope.css_list = [];
		}
		gettextCatalog.setCurrentLanguage(LANGUAGE.current_code());

	};

	if($localStorage.language == "ar_AR"){
		// root_lang = '/ar/';
		is_root_ar = 1;
		$rootScope.dir = "rtl"
	}
	$rootScope.is_root_ar = is_root_ar;
	// if(is_root_ar || LANGUAGE.current_code()=='ar'){
	// 	$rootScope.change_language(1);

	// }

	$rootScope.previousState;
	$rootScope.previousStateParams;
	$rootScope.in_checkout_page = false
	$transitions.onSuccess({}, function(trans) {
	 $rootScope.previousState = trans.from().name
	 $rootScope.previousStateParams = trans.params('from')
	if($(".search").is(":visible")){

		$(".search").slideToggle();
	}
	 if(trans.to().name == "root.checkout"){

	 	$rootScope.in_checkout_page = true
	 } else {
	 	$rootScope.in_checkout_page = false
	 	
	 }

	});
	
	var check_if_mobile = function() {
	  var check = false;
	  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	  return check;
	};
	
	$rootScope.is_mobile = check_if_mobile()


})
.config(['$resourceProvider', function($resourceProvider) {
	$resourceProvider.defaults.stripTrailingSlashes = true; // Don't strip trailing slashes from calculated URLs
}])
.config(['$locationProvider', function($locationProvider) {
	$locationProvider.html5Mode(true);
}])
.config(function(toastrConfig) {
  angular.extend(toastrConfig, {
    autoDismiss: false,
  });
})
.config(['uiSelectConfig', function(uiSelectConfig) {
  uiSelectConfig.theme = 'select2';
}]);