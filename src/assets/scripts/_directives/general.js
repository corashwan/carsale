'use strict';
/******* show partner table/tree ******************/
function pad(number) {
	if(number < 10) {
		return '0' + number;
	}
	return number;
};
function ampm(hours,minutes, gettextCatalog){
	//var hours = hour.substr(0, 2);
	//var minutes = hour.substr(3, 2);


	//24:00 - 1 AM
	//25:00 - 2 AM

	var meridian = gettextCatalog.getString('AM');
	if(hours == '00'){
		hours = 12;
	}
	if(hours == 12){
		meridian = gettextCatalog.getString('PM');
		hours = 12;
	}
	if(hours >= 13 && hours <= 23) {
		meridian = gettextCatalog.getString('PM');
		hours = hours - 12;
	}
	if(hours==24){
		meridian = gettextCatalog.getString("AM");
		hours = 12;
	}
	if(hours>24){
		meridian = gettextCatalog.getString("AM");
		hours = hours-24;
	}


	var m = ':00';
	if(minutes!='00'){
		m = ':' + pad(minutes)
	}
	return parseInt(hours) + m + ' ' + meridian;
};

angular.module('app')
.filter('resizeto', function(CONFIG,DATA,LANGUAGE) {
	return function(src, w, h) {
		if (!src) src = LANGUAGE.localize(DATA.get('noimg'),'image');
		if(src && w && h) {
            var rel = src.replace(CONFIG.get('API_HOST'),'');
			return CONFIG.api_url()+'/image-resizer?fit=true&url='+encodeURIComponent(rel)+'&width='+w+'&height='+h;
		} else {
			return src;
		}
	};
})
.filter('imgsrcfix', function(CONFIG) {
	return function(text) {
		var path = CONFIG.get('API_HOST');

		return text.replace(/(img.+src=")(\/media)/gi, '$1'+path+'$2');
	};
})
.filter('srcfix', function(CONFIG) {
	return function(text) {
		var path = CONFIG.get('API_HOST');

		return text.replace(/(\/media)/gi, path+'$1');
	};
})
.filter('ifEmpty', function() {
    return function(input, defaultValue) {
        if (angular.isUndefined(input) || input === null || input === '') {
            return defaultValue;
        }

        return input;
    }
})
.filter('description_dots', function($filter) {
    return function(input, limit, begin, dots) {
        if (!input || input.length <= limit) {
            return input;
        }

        begin = begin || 0;
        dots = dots || '...';

        return $filter('limitTo')(input, limit, begin) + dots;
    };
})
.directive('ngReallyClick', function(gettextCatalog, $uibModal) {
	return {
		restrict: 'A',
		scope: {
			ngReallyClick: "&",
			ngReallyCancel: "&",
			item: "=",
		},
		link: function(scope, element, attrs) {
			var default_message = gettextCatalog.getString("Are you sure ?");
			var default_cancel_message = gettextCatalog.getString("Cancel");
			var default_approve_message = gettextCatalog.getString("OK");
			var message = attrs.ngReallyMessage || default_message
			var cancel_message = attrs.ngReallyCancelMessage || default_cancel_message
			var approve_message = attrs.ngReallyApproveMessage || default_approve_message
			element.bind('click', function() {
				var modalHtml = '<div class="modal-body text-center"><h4>' + message + '</h4></div><div class="modal-footer text-center"><button class="btn btn-default" ng-click="ok()">'+ approve_message +'</button><button class="btn btn-default btn-secondary" ng-click="cancel()">'+ cancel_message +'</button></div>';
				var modalInstance = $uibModal.open({
					size: 'sm',
					template: modalHtml,
					controller: 'ngReallyCtrl',

				});

				modalInstance.result.then(function() {
					scope.ngReallyClick({
						item: scope.item,
					}); //raise an error : $digest already in progress
				}, function() {
					if(scope.ngReallyCancel){
						scope.ngReallyCancel({
								 item: scope.item,
								})

					}
					//Modal dismissed
				});

			});

		}
	};
})
.controller('ngReallyCtrl', function($scope, $uibModalInstance) {
	$scope.ok = function() {
		$uibModalInstance.close();
	};
	$scope.cancel = function() {

			$uibModalInstance.dismiss('cancel');


	};
})
.directive('ngEnter', function() {
	return function(scope, element, attrs) {
		element.bind("keydown", function(e) {
			if(e.which === 13) {
				scope.$apply(function() {
					scope.$eval(attrs.ngEnter, {
						'e': e
					});
				});
				e.preventDefault();
			}
		});
	};
})
.filter('htmlToPlaintext', function() {
	return function(text) {
		return text ? String(text).replace(/<[^>]+>/gm, '') : '';
	};
})
.directive('placeholder', function(gettextCatalog) {
	//gettext to automatically process placeholder attributes
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var translatedPlaceholder = gettextCatalog.getString(attrs.placeholder);
			element.attr('placeholder', translatedPlaceholder);
		}
	};
})
.directive('starRating', function() {
	return {
		restrict: 'AE',
		templateUrl: 'scripts/_directives/stars.html',
		scope: {
			ratingValue: '=ngModel',
			is_editable: '=?editable',
			max: '=?' // optional (default is 5)
		},
		link: function(scope, element, attributes) {
			if(!scope.is_editable) {
				scope.is_editable = false;
			}
			if(scope.max === undefined) {
				scope.max = 5;
			}
			scope.stars = [];
			for(var i = 1; i <= scope.max; i++) {
				scope.stars.push({
					num: i,
					filled: i <= scope.ratingValue
				});
			}
		},
		controller: function($scope) {
			$scope.set_rating = function(item) {
				if($scope.is_editable) {
					$scope.ratingValue = item.num;
					_.forEach($scope.stars, function(i) {
						if(i.num <= $scope.ratingValue) {
							i.filled = true;
						} else {
							i.filled = false;
						}
					});
				}
			};
		}
	};
})





.filter('toFixed', function() {
	return function(value) {
		return parseFloat(value).toFixed(2)
	};
})
.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
})
.filter('ampm', function(gettextCatalog) {
	//00:00 - 12 AM
	//01:00 - 1 AM
	//11:59 - 11:59 AM
	//12:00 - 12 PM
	//13:00 - 1 PM
	//23:59 - 11:59 PM
	//00:00 - 12 AM

	//24:00 - 1 AM
	//25:00 - 2 AM
	return function(hour) {
		var ts = hour.split(':');
		return ampm(ts[0], ts[1], gettextCatalog);//hh:mm:ss
	};
})
.filter('ampm_later', function(gettextCatalog) {
	//this will show the end date +2 hours
	//00:00 - 12 AM
	//01:00 - 1 AM
	//11:59 - 11:59 AM
	//12:00 - 12 PM
	//13:00 - 1 PM
	//23:59 - 11:59 PM
	//00:00 - 12 AM

	//24:00 - 1 AM
	//25:00 - 2 AM
	return function(hour, appointment_duration) {
		var ts = hour.split(':');
		// if (ts[1]=='30') {
		// 	ts[1]=0;
		// }

		var hour = parseInt(ts[0])+ parseInt(appointment_duration.split(':')[0])

		var minutes = parseInt(appointment_duration.split(':')[1] % 60) + parseInt(ts[1])


		if (minutes >= 60) {
			hour += parseInt(minutes / 60)
			minutes = parseInt(minutes % 60)
		}
		return ampm(hour, minutes, gettextCatalog);//hh:mm:ss
	};
})
.filter('plus2hours', function() {
	return function(date) {
		if(!date){return date;}//undefined
		if(typeof date === 'object'){//date object
			date = angular.copy(date);
			return date.setHours(date.getHours()+2);
		}else{
			var t = Date.parse(date) - 3*60*60*1000 + 2*60*60*1000;// UTC+2 hours
			return new Date(t);
		}
	};
})
.filter('get_by_index', function() {
	return function(items, index) {
		return items[index+1]
	};
})
.filter('locale_hour', function() {
	return function(date) {
		if(!date){return date;}//undefined
		if(typeof date === 'object'){//date object
			date = angular.copy(date);
			return date.setHours(date.getHours()+2);
		}else{
			var offset = - new Date().getTimezoneOffset()/60;
			var t = Date.parse(date) - 3*60*60*1000;// UTC // + offset*60*60*1000
			return new Date(t);
		}
	};
})
.filter('locale_date', function(gettextCatalog) {

	var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	var months = ["January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July ",
		"August",
		"September",
		"October",
		"November",
		"December"
	];

	//13:00:00 + timezone
	return function(date) {
		var now = new Date(date);
		var AST = now.getTime() - (180 * 60 * 1000); //convert to AST timezone -300
		var local = new Date(AST);

		var hours = local.getHours();
		var minutes = local.getMinutes();

		/*
		var meridian = 'AM';
		if(hours > 12) {
			meridian = 'PM';
			hours = hours - 12;
		}
		*/

		var d = local.getDate();
		if(d == 1) {
			d += 'st';
		}
		if(d == 2) {
			d += 'nd';
		}
		if(d == 3) {
			d += 'rd';
		}
		if(d >= 4) {
			d += 'th';
		}

		return months[local.getMonth()] + ' ' + d + ' ' + local.getFullYear() + ' ' + ampm(hours,minutes, gettextCatalog);
	};
})
.filter('localampm', function(gettextCatalog) {

	//13:00:00 + timezone
	return function(hour) {

		var now = new Date();
		var y = now.getUTCFullYear();
		var m = now.getUTCMonth();
		var d = now.getUTCDate();
		var AST = Date.UTC(y, m, d, hour.substr(0, 2), hour.substr(3, 2)) - (180 * 60 * 1000); //convert to AST timezone -300
		var local = new Date(AST);

		var hours = local.getHours();
		var minutes = local.getMinutes();

		return ampm(hours,minutes, gettextCatalog);
		// var meridian = 'AM';
		// if(hours > 12) {
		// 	meridian = 'PM';
		// 	hours = hours - 12;
		// }
		// return parseInt(hours) + ':' + pad(minutes) + ' ' + meridian;
	};
});
