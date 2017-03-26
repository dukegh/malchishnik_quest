<!DOCTYPE HTML>
<html>
<head>
	<title>HTML5 Geolocation API - Google Maps</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>

	<link rel="stylesheet" href="https://code.jquery.com/mobile/1.3.2/jquery.mobile-1.3.2.min.css" />
	<script src="https://code.jquery.com/jquery-1.9.1.min.js"></script>
	<script src="https://code.jquery.com/mobile/1.3.2/jquery.mobile-1.3.2.min.js"></script>

	<script type="text/javascript">
		var map;
		var marker;
		function initMap() {
			navigator.permissions.query({name:'geolocation'})
				.then(function(permissionStatus) {
					//alert('geolocation permission state is ' + permissionStatus.state);

					permissionStatus.onchange = function() {
						alert('geolocation permission state has changed to ' + this.state);
					};
				});


			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position){
					var latitude = position.coords.latitude;
					var longitude = position.coords.longitude;
					document.getElementById('coord').innerText = latitude + ", " + longitude;
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
					marker = new google.maps.Marker({
						position: coords,
						map: map,
						title: "Your current location!"
					});
					setTimeout('updateMarker()', 1000);
				}, _html5Error.bind(this),
					{
						timeout: 60000,
						enableHighAccuracy: true,
						maximumAge: 60000
					});
			}else {
				alert("Geolocation API не поддерживается в вашем браузере");
			}

		}

		function updateMarker() {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					var latitude = position.coords.latitude;
					var longitude = position.coords.longitude;
					document.getElementById('coord').innerText = latitude + ", " + longitude;
					var coords = new google.maps.LatLng(latitude, longitude);
					marker.setPosition(coords);
					setTimeout('updateMarker()', 1000);
				}, _html5Error.bind(this),
					{
						timeout: 60000,
						enableHighAccuracy: true,
						maximumAge: 60000
					});
			}
		}

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
				alert('There was a problem retrieving your location: ' + error_value);
		}

	</script>


	<style>
		html, body {
			height: 100%;
			margin: 0;
			padding: 0;
		}
		#mapContainer {
			height: 100%;
		}
		#wrap {
			height: 80%;
			width: 80%;
		}
	</style>

</head>
<body>
<!--<div id="wrap">-->
	<h2>HTML5 Geolocation и Google Maps</h2>
	<div id="mapContainer"></div>
	<p id="coord"></p>
<!--</div>-->



<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCeDXH6osvNE0x4VHxbuYsahHx8pC3G_Yo&callback=initMap"
		type="text/javascript"></script>

</body>
</html>