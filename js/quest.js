var mapLoaded = false;
var photoswipeInited = false;
var viewedQuest = 1;

var app = angular.module('Quest', [
	"ngRoute",
	"mobile-angular-ui",
	'mobile-angular-ui.gestures',
	"angularFileUpload"
]);

app.run(function($transform) {
	window.$transform = $transform;
});

app.config(function($routeProvider) {
	$routeProvider.when('/', {templateUrl: 'home.html'});
	$routeProvider.when('/q1', {templateUrl: 'q1.html'});
	$routeProvider.when('/q2', {templateUrl: 'q2.html'});
	$routeProvider.when('/q3', {templateUrl: 'q3.html'});
	$routeProvider.when('/q4', {templateUrl: 'q4.html'});
	$routeProvider.when('/q5', {templateUrl: 'q5.html'});
	$routeProvider.when('/q6', {templateUrl: 'q6.html'});
	$routeProvider.when('/q7', {templateUrl: 'q7.html'});
	$routeProvider.when('/q8', {templateUrl: 'q8.html'});
	$routeProvider.when('/q9', {templateUrl: 'q9.html'});
	$routeProvider.when('/map', {templateUrl: 'map.html'});
	$routeProvider.when('/uploadPage', {templateUrl: 'uploadPage.php'});
	$routeProvider.when('/carousel', {templateUrl: 'carousel.php'});
	$routeProvider.when('/photoswipe:ext?', {templateUrl: 'photoswipe.php', reloadOnSearch: false});
	$routeProvider.otherwise({redirectTo:'/'});
});


app.controller('MainController', function($rootScope, $scope){
	// Needed for the loading screen
	/*$rootScope.$on('$routeChangeStart', function(){
		$rootScope.loading = true;
	});

	$rootScope.$on('$routeChangeSuccess', function(){
		$rootScope.loading = false;
	});*/

	$rootScope.$on('$routeChangeSuccess',
		function(event, current, previous){
			console.info("Start event:");
			//if (typeof event != "undefined") console.info('event:', event);
			//if (typeof current != "undefined") console.info('current:', current);
			//if (typeof previous != "undefined") console.info('prev:', previous);
			clearTimeout(timerId);
			timerId = null;
			if (current.loadedTemplateUrl == 'photoswipe.php' && (! previous || previous.loadedTemplateUrl != 'photoswipe.php')) {
				setTimeout('initPhoto()', 10);
			}
			if (current.loadedTemplateUrl == 'map.html') {
				if (! mapLoaded) {
					mapLoaded = true;
					var js = document.createElement("script");
					js.type = "text/javascript";
					js.src = '/js/geomap.js';
					document.body.appendChild(js);
					js = document.createElement("script");
					js.type = "text/javascript";
					js.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCeDXH6osvNE0x4VHxbuYsahHx8pC3G_Yo&callback=initMap';
					document.body.appendChild(js);
				} else {
					console.info("INIT MAP");
					setTimeout('initMap()', 10);
				}
			} else {
				if (navigator.geolocation && typeof watchID != "undefined")
				navigator.geolocation.clearWatch(watchID);
			}
			if (current.loadedTemplateUrl.substr(0, 1) == 'q' && current.loadedTemplateUrl.substr(2) == '.html') {
				viewedQuest = current.loadedTemplateUrl.substr(1, 1);
				setTimeout('updateQuestPage()', 10);
			}
		});

	$rootScope.$on('$routeChangeError',
		function(event, current, previous, rejection) {
			console.info("Start event:");
			console.info(event);
			console.info(current);
			console.info(previous);
			console.info(rejection);
		});

	$rootScope.$on('$routeChangeStart',
		function(event, next, current) {
			//console.info("Start event:");
			//console.info(event);
			//console.info(next);
			//console.info(current);
		});

});

app.controller('FileUploadController', ['$scope', 'FileUploader', function($scope, FileUploader) {
	var uploader = $scope.uploader = new FileUploader({
		url: 'upload.php'
	});

	// FILTERS

	uploader.filters.push({
		name: 'imageFilter',
		fn: function(item /*{File|FileLikeObject}*/, options) {
			var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
			return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
		}
	});

	// CALLBACKS

	uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
		console.info('onWhenAddingFileFailed', item, filter, options);
	};
	uploader.onAfterAddingFile = function(fileItem) {
		console.info('onAfterAddingFile', fileItem);
	};
	uploader.onAfterAddingAll = function(addedFileItems) {
		console.info('onAfterAddingAll', addedFileItems);
	};
	uploader.onBeforeUploadItem = function(item) {
		console.info('onBeforeUploadItem', item);
	};
	uploader.onProgressItem = function(fileItem, progress) {
		console.info('onProgressItem', fileItem, progress);
	};
	uploader.onProgressAll = function(progress) {
		console.info('onProgressAll', progress);
	};
	uploader.onSuccessItem = function(fileItem, response, status, headers) {
		console.info('onSuccessItem', fileItem, response, status, headers);
	};
	uploader.onErrorItem = function(fileItem, response, status, headers) {
		console.info('onErrorItem', fileItem, response, status, headers);
	};
	uploader.onCancelItem = function(fileItem, response, status, headers) {
		console.info('onCancelItem', fileItem, response, status, headers);
	};
	uploader.onCompleteItem = function(fileItem, response, status, headers) {
		console.info('onCompleteItem', fileItem, response, status, headers);
	};
	uploader.onCompleteAll = function() {
		console.info('onCompleteAll');
	};

	console.info('uploader', uploader);
}]);

app.directive('carousel', function(){
	return {
		restrict: 'C',
		scope: {},
		controller: function() {
			this.itemCount = 0;
			this.activeItem = null;

			this.addItem = function(){
				var newId = this.itemCount++;
				this.activeItem = this.itemCount === 1 ? newId : this.activeItem;
				return newId;
			};

			this.next = function(){
				this.activeItem = this.activeItem || 0;
				this.activeItem = this.activeItem === this.itemCount - 1 ? 0 : this.activeItem + 1;
			};

			this.prev = function(){
				this.activeItem = this.activeItem || 0;
				this.activeItem = this.activeItem === 0 ? this.itemCount - 1 : this.activeItem - 1;
			};
		}
	};
});

app.directive('carouselItem', function($drag) {
	return {
		restrict: 'C',
		require: '^carousel',
		scope: {},
		transclude: true,
		template: '<div class="item"><div ng-transclude></div></div>',
		link: function(scope, elem, attrs, carousel) {
			scope.carousel = carousel;
			var id = carousel.addItem();

			var zIndex = function(){
				var res = 0;
				if (id === carousel.activeItem){
					res = 2000;
				} else if (carousel.activeItem < id) {
					res = 2000 - (id - carousel.activeItem);
				} else {
					res = 2000 - (carousel.itemCount - 1 - carousel.activeItem + id);
				}
				return res;
			};

			scope.$watch(function(){
				return carousel.activeItem;
			}, function(){
				elem[0].style.zIndex = zIndex();
			});

			$drag.bind(elem, {
				//
				// This is an example of custom transform function
				//
				transform: function(element, transform, touch) {
					//
					// use translate both as basis for the new transform:
					//
					var t = $drag.TRANSLATE_BOTH(element, transform, touch);

					//
					// Add rotation:
					//
					var Dx    = touch.distanceX,
						t0    = touch.startTransform,
						sign  = Dx < 0 ? -1 : 1,
						angle = sign * Math.min( ( Math.abs(Dx) / 700 ) * 30 , 30 );

					t.rotateZ = angle + (Math.round(t0.rotateZ));

					return t;
				},
				move: function(drag){
					if(Math.abs(drag.distanceX) >= drag.rect.width / 4) {
						elem.addClass('dismiss');
					} else {
						elem.removeClass('dismiss');
					}
				},
				cancel: function(){
					elem.removeClass('dismiss');
				},
				end: function(drag) {
					elem.removeClass('dismiss');
					if(Math.abs(drag.distanceX) >= drag.rect.width / 4) {
						scope.$apply(function() {
							carousel.next();
						});
					}
					drag.reset();
				}
			});
		}
	};
});

function initPhoto() {
	console.info('initPhoto');
	var pswpElement = document.querySelectorAll('.pswp')[0];
	var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, photoItems);
	gallery.init();

}

function latlng2distance(lat1, long1, lat2, long2) {
	//радиус Земли
	var R = 6372795;

	//перевод коордитат в радианы
	lat1 *= Math.PI / 180;
	lat2 *= Math.PI / 180;
	long1 *= Math.PI / 180;
	long2 *= Math.PI / 180;

	//вычисление косинусов и синусов широт и разницы долгот
	var cl1 = Math.cos(lat1);
	var cl2 = Math.cos(lat2);
	var sl1 = Math.sin(lat1);
	var sl2 = Math.sin(lat2);
	var delta = long2 - long1;
	var cdelta = Math.cos(delta);
	var sdelta = Math.sin(delta);

	//вычисления длины большого круга
	var y = Math.sqrt(Math.pow(cl2 * sdelta, 2) + Math.pow(cl1 * sl2 - sl1 * cl2 * cdelta, 2));
	var x = sl1 * sl2 + cl1 * cl2 * cdelta;
	var ad = Math.atan2(y, x);
	var dist = ad * R; //расстояние между двумя координатами в метрах

	return dist;
}

function spoilerTrigger(_this) {
	$(_this).parent().next().toggle();
}

function updateCheckPoint(latitude, longitude, cq) {
	currentQuest.latitude = latitude;
	currentQuest.longitude = longitude;
	currentQuest.id = cq;
	window.location = 'https://quest.sn00.net/#/map'

}

var checkDistanceFired = false;
var timerId = null;

function timerCheckCode() {
	if (timerId == null) return;
	$.ajax({
		url: "/core.php?action=getCurrentQuest&quest=" + currentQuest.id + '&part=' + currentQuest.part,
		dataType: 'json'
	}).done(function(data) {
		var icon = data.userComplete;
		if (icon) {
			timerId = null;
			currentQuest = data.currentQuest;
			updateQuestPage();
			updateQuestMenu();
			playSound('success');
			$('#successButton').click();
			$('#modalMapMsg').html('<p>Правильный код ввёл:</p><img src="' + icon + '" width="50">');
		}
		if (timerId != null) timerId = setTimeout(timerCheckCode, 3000);
	});
}

function timerCheckDistance() {
	if (timerId == null) return;
	$.ajax({
		url: "/core.php?action=getCurrentQuest&quest=" + currentQuest.id + '&part=' + currentQuest.part,
		dataType: 'json'
	}).done(function(data) {
		var icon = data.userComplete;
		if (icon) {
			timerId = null;
			currentQuest = data.currentQuest;
			playSound('success');
			$('#successButton').click();
			$('#modalMapMsg').html('<p>Первым добрался до цели:</p><img src="' + icon + '" width="50">');
		}
		if (timerId != null) timerId = setTimeout(timerCheckDistance, 3000);
	});
}

function checkDistance(latitude, longitude) {
	if (currentQuest.id == 8) {
		checkElfs(latitude, longitude);
		return;
	}
	var distance = Math.floor(latlng2distance(latitude, longitude, currentQuest.latitude, currentQuest.longitude));
	$('#mapDist').text('До цели: ' + distance + ' м.');
	if (checkDistanceFired) return;
	if (distance <= 10) {
		checkDistanceFired = true;
		$.ajax({
			url: "/core.php?action=updateQuest&quest=" + currentQuest.id + "&part=2",
			dataType: 'json'
		}).done(function(data) {
			currentQuest = data.currentQuest;
			playSound('success');
			var icon = data.userComplete;
			$('#successButton').click();
			if (icon) {
				$('#modalMapMsg').html('<p>Первым добрался до цели:</p><img src="' + icon + '" width="50">');
			}
		});
	} else {
		if (timerId == null) timerId = setTimeout(timerCheckDistance, 3000);
	}
}

function updateQuestMenu() {
	var i = 1;
	$('#questMenu').find('a').each(function(){
		var href = $(this).attr('href');
		if (href.indexOf('#/q') != -1 || href == "") {
			$(this).find('i').each(function() {
				if (! $(this).hasClass('pull-right')) $(this).remove();
			});
			href = '#/q' + i;
			$(this).attr('href', href);
			$(this).css('color', '');
			var qNum = parseInt(href.substr(3));
			if (qNum < currentQuest.id) $(this).prepend('<i class="fa fa-check text-success"></i>');
			if (qNum == currentQuest.id) $(this).prepend('<i class="fa fa-unlock text-current"></i>');
			if (qNum > currentQuest.id) {
				$(this).prepend('<i class="fa fa-lock text-danger"></i>');
				$(this).attr('href', '');
				$(this).css('color', '#aaa');
			}
			i = i + 1;
		}
	});
}

function goToCurrentQuest() {
	checkDistanceFired = false;
	var qId = currentQuest.id;
	if (qId == 9) qId = 8;
	window.location = 'https://quest.sn00.net/#/q' + qId;
}

function updateQuestPage() {
	var qb = $('#questBlock');
	if (qb.length) {
		var part1 = qb.find('#part1');
		var part2 = qb.find('#part2');
		var part3 = qb.find('#part3');
		if (viewedQuest < currentQuest.id || currentQuest.part > 1) {
			if (part1.length) {
				part1.find('i').attr('class', 'fa fa-check text-success');
				part1.find('h3').contents().last()[0].textContent = ' Задание (часть 1) выполнено';
			}
			qb.find('#part1map').hide();
			part2.show();
			qb.find('#part2code').show();
		}
		if (viewedQuest < currentQuest.id || currentQuest.part > 2) {
			if (part2.length) {
				part2.find('i').attr('class', 'fa fa-check text-success');
				part2.find('h3').contents().last()[0].textContent = ' Задание (часть 2) выполнено';
			}
			qb.find('#part2code').hide();
			part3.show();
		}
		if (viewedQuest == currentQuest.id && currentQuest.part == 2) {
			if (timerId == null) timerId = setTimeout(timerCheckCode, 3000);
		}
	} else {
		console.info('#questBlock not found');
		console.trace();
	}
}

function checkCode(obj) {
	var code = $(obj).parent().find('input').val();
	$.ajax({
		url: "/core.php?action=checkCode&quest=" + currentQuest.id + "&code=" + encodeURI(code),
		//async: false,
		dataType: 'json'
	}).done(function(data) {
		if (data.res == 'good') {
			$('#codeMsg').text('');
			currentQuest = data.currentQuest;
			updateQuestPage();
			updateQuestMenu();
			playSound('success');
		} else {
			$('#codeMsg').text('Код неверный')
		}
	});
}

function addElfPoints(map) {
	elfPoints.forEach(function(item, i, arr){
		var coords = new google.maps.LatLng(item.latitude, item.longitude);
		item.checked = item.checked == "1";
		var imgUrl = item.checked ? '/img/cannabisSmallBW.png' : '/img/cannabisSmall.png';
		item.marker = new google.maps.Marker({
			position: coords,
			map: map,
			title: "Elf",
			icon: {
				url: imgUrl,
				scaledSize: new google.maps.Size(25, 25)
			}
		});
	});
}

function timerElfPoints() {
	if (timerId == null) return;
	$.ajax({
		url: "/core.php?action=getCheckPoints",
		dataType: 'json'
	}).done(function(data) {
		updateElfPoints(data.checkPoints);
		if (timerId != null) timerId = setTimeout(timerElfPoints, 3000);
	});
}

function updateElfPoints(checkPoints) {
	var leafs = 0;
	if (typeof elfPoints[0].marker == "undefined") return;
	elfPoints.forEach(function(item, i, arr){
		if (item.checked) return;
		if (typeof item.marker == "undefined") return;
		var itemChanged = false;
		checkPoints.forEach(function (point) {
			if (point.id == item.id && point.checked == "1") itemChanged = true;
		});
		if (itemChanged) {
			item.checked = true;
			playSound('beep5');
			var marker = new google.maps.Marker({
				position: item.marker.getPosition(),
				map: item.marker.getMap(),
				title: "Elf",
				icon: {
					url: '/img/cannabisSmallBW.png',
					scaledSize: new google.maps.Size(25, 25)
				}
			});
			item.marker.setMap(null);
			item.marker = marker;
		} else {
			leafs = leafs + 1;
		}
	});
	$('#mapDist').text('Не найдено листов: ' + leafs);
	if (leafs == 0) allPointsChecked();
}

function checkElfs(latitude, longitude) {
	var leafs = 0;
	if (typeof elfPoints[0].marker == "undefined") return;
	elfPoints.forEach(function(item, i, arr) {
		if (item.checked) return;
		if (typeof item.marker == "undefined") return;
		var distance = Math.floor(latlng2distance(latitude, longitude, item.latitude, item.longitude));
		if (distance <= 10) {
			item.checked = true;
			playSound('beep15');
			var marker = new google.maps.Marker({
				position: item.marker.getPosition(),
				map: item.marker.getMap(),
				title: "Elf",
				icon: {
					url: '/img/cannabisSmallBW.png',
					scaledSize: new google.maps.Size(25, 25)
				}
			});
			item.marker.setMap(null);
			item.marker = marker;
			$.ajax({
				url: "/core.php?action=updatePoint&point=" + item.id,
				dataType: 'json'
			}).done(function(data) {
				updateElfPoints(data.checkPoints);
			});
		} else {
			leafs = leafs + 1;
		}
	});
	$('#mapDist').text('Не найдено листов: ' + leafs);
	if (leafs == 0) {
		allPointsChecked();
	} else {
		if (timerId == null) timerId = setTimeout(timerElfPoints, 3000);
	}
}

function allPointsChecked() {
	if (checkDistanceFired) return;
	checkDistanceFired = true;
	clearTimeout(timerId);
	timerId = null;
	$('#successButton').click();
	$('#modalMapMsg').html('<p>Вы собрали силу всех эльфийских листьев!</p>');
	playSound('success');
	$.ajax({
		url: "/core.php?action=finishQuest&quest=8",
		dataType: 'json'
	}).done(function(data) {
		currentQuest = data.currentQuest;
		updateQuestMenu();
	});
}