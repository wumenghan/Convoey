var g_user = 0;
var g_markers = [];
var user = prompt("Enter user name");
$(document).ready(function() { 
	initialize_user();
	test_multiple_mark();
	update_user();
});

function test_multiple_mark() {

	function addMarker(location, i_map) {
		var marker = new google.maps.Marker({
			position:location,
			map:i_map	
		});
		g_markers.push(marker);
	}
	
	function setMapOnAll(i_map) {
		for( var i = 0; i<g_markers.length; i++) {
			g_markers[i].setMap(i_map);	
		}
	}
	
	function deleteMarkers() {
		g_markers = [];
	}

}

function initialize_user() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(initMap, error);	
	}

	function initMap (position) {
		var LatLng = {lat:position.coords.latitude, lng:position.coords.longitude};	
		var map_div = document.getElementById("map");	
		// this map object is global, it can be used anywhere
		window.map = new google.maps.Map(map_div, {
			center: LatLng,
			zoom:18
		});
		// send user info to server
		var user_position = JSON.stringify(LatLng)	
		$.ajax({
			url:"/10/new_user",
			type:"POST",
			data:{user:user, user_position:user_position},
			success: function(data) {
				console.log("initialize user success");	
			}
		});
	}

}

function update_user() {
	if (navigator.geolocation) {
		var optn = {
			enableHighAccurarcy: true,
			timeout: Infinity,
			maximumAge:0
		};
		navigator.geolocation.watchPosition(function(position) {
			var LatLng = {lat:position.coords.latitude, lng:position.coords.longitude};
			var user_position = JSON.stringify(LatLng); 
			map.setCenter(LatLng);
			$.ajax({
				url:"/10/update_user_location",
				type:"POST",
				data:{user:user, user_position:user_position, g_user:g_user},
				success: function(data) {
					console.log(data.locations);
					data.locations.s = {lat:20, lng:76};
					var user_num = Object.keys(data.locations).length;
					var keys = Object.keys(data.locations);
					var results = data.locations;
					for (var i=0; i<g_markers.length; i++) {
						g_markers[i].setMap(null);	
					}
					g_markers = [];
					for (var i=0; i<user_num; i++) {
						var marker = new google.maps.Marker({
							position: data.locations[keys[i]],
							map:map,
							label: keys[i]
						});	
						g_markers.push(marker);	
					}
					//}
					//$.each(data.locations, function(key, val) {
					//	var marker = new google.maps.Marker({
					//		position:val,
					//		map:map,
					//		label:key	
					//	});
					//	g_markers.push(marker);
					//});
					g_user = user_num; 
					console.log("g_user", g_user);	
				
			}
			});
		}, error, optn);
	}
}


function error(err) {
		alert(err)	
}

