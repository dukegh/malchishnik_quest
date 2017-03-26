var map;
var marker;
var positionOptions = {
	timeout: 60000,
	enableHighAccuracy: true,
	maximumAge: 5000
};
var watchID;

function initMap() {
	if (! isMobile()) {
		positionOptions = {enableHighAccuracy: false};
	}
	if (typeof navigator.permissions != "undefined") {
		navigator.permissions.query({name:'geolocation'}).then(function(permissionStatus) {
			//alert('geolocation permission state is ' + permissionStatus.state);

			permissionStatus.onchange = function() {
				//alert('geolocation permission state has changed to ' + this.state);
			};
		});
	}
	if (navigator.geolocation) {
		var mapDist = $('#mapDist');
		var mapCoord = $('#mapCoord');
		mapDist.html('Духи геолокации ищут Вас' + '<i class="fa fa-cog fa-spin fa-3x fa-fw"></i>');
		navigator.geolocation.getCurrentPosition(function(position){
			var latitude = position.coords.latitude;
			var longitude = position.coords.longitude;
			mapCoord.text('[ ' + (Math.round(latitude*1000000)/1000000) + ", " + (Math.round(longitude*1000000)/1000000) + ' ]');
			checkDistance(latitude, longitude);
			var coords = new google.maps.LatLng(latitude, longitude);
			var mapOptions = {
				zoom: 18,
				center: coords,
				mapTypeControl: true,
				navigationControlOptions: {
					style: google.maps.NavigationControlStyle.SMALL
				},
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			map = new google.maps.Map(
				document.getElementById("mapContainer"), mapOptions
			);
			if (currentQuest.id == 8) addElfPoints(map);
			marker = new google.maps.Marker({
				position: coords,
				map: map,
				title: "Я тут!",
				icon: {
					url: userData.icon,
					scaledSize: new google.maps.Size(50, 50)
				}
			});
			//setTimeout('updateMarker()', 1000);
		}, _html5Error.bind(this), positionOptions);
		watchID = navigator.geolocation.watchPosition(function(position) {
			var latitude = position.coords.latitude;
			var longitude = position.coords.longitude;
			if (mapCoord.length == 0) return;
			mapCoord.text('[ ' + (Math.round(latitude*1000000)/1000000) + ", " + (Math.round(longitude*1000000)/1000000) + ' ]');
			checkDistance(latitude, longitude);
			var coords = new google.maps.LatLng(latitude, longitude);
			if (typeof marker != "undefined") marker.setPosition(coords);
		}, _html5Error.bind(this), positionOptions);
	}else {
		alert("Geolocation API не поддерживается в вашем браузере");
	}

}

/*
function updateMarker() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var latitude = position.coords.latitude;
			var longitude = position.coords.longitude;
			var coord = $('#coord');
			if (coord.length == 0) return;

			coord.text(latitude + ", " + longitude + ' До цели: '
				+ Math.floor(latlng2distance(latitude, longitude, checkPoint.latitude, checkPoint.longitude)) + ' м.');

			var coords = new google.maps.LatLng(latitude, longitude);
			marker.setPosition(coords);
			setTimeout('updateMarker()', 1000);
		}, _html5Error.bind(this), positionOptions);
	}
}
*/

function _html5Error(error) {
	var error_value = "null";
	switch(error.code){
		case 1:
			error_value = "PERMISSION_DENIED";
			//$("#slider-geo-on-off").val("off");
			break;
		case 2:
			error_value = "POSITION_UNAVAILABLE";
			break;
		case 3:
			//Read more at http://dev.w3.org/geo/api/spec-source.html#timeout
			error_value = "TIMEOUT";
			break;
	}
	$('#coord').text('Духи отвернулись от Вас. Они сказали: ' + error_value);
	navigator.geolocation.clearWatch(watchID);
}

function isMobile() {
	testExp = new RegExp('Android|webOS|iPhone|iPad|' +
		'BlackBerry|Windows Phone|'  +
		'Opera Mini|IEMobile|Mobile' ,
		'i');

	return !!testExp.test(navigator.userAgent);
}