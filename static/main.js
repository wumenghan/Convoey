var g_num_seen = 0;
$(document).ready(function() { 
	getLocation();
	poll();
});


function getLocation() {

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(initMap, error);
		//var watchID = navigator.geolocation.watchPosition(showPosition);
		//navigator.geolocation.watchPosition(initMap,error, optn);

	} else{
		alert("Geolocation is not supported by this browser");
	}
}

function initMap(position) {	
	var LatLng = {lat:position.coords.latitude, lng:position.coords.longitude};

	console.log(position.coords.latitude, position.coords.longitude)
	var put_map = document.getElementById("map"); 
	window.map = new google.maps.Map(put_map, {
		center: LatLng,
		zoom:18
	});

	//var marker = new google.maps.Marker({	
	//	position: LatLng,
	//	map:map,
	//});

	// update center and marker
	if(navigator.geolocation){
		var optn = {
			enableHighAccurarcy: true,
			timeout            : Infinity,
			maximumAge         : 0
		};
		var user = prompt("Enter user name");
		navigator.geolocation.watchPosition(function(position){
			var LatLng = {lat:position.coords.latitude, lng:position.coords.longitude};
			var position = JSON.stringify(LatLng);
			map.setCenter(LatLng);
			//marker.setPosition(LatLng);
			// use ajax to send location and username to server
			$.ajax({
				url:"/10/new",
				type:"POST",
				data:{locations:position, user:user}, // user name will be changed in the future
				success: function(data, text_status, jq_xhr){
					console.log("success")	
				},
				error: function(jq_xhr, text_status, error_thrown) {
					console.log("ERROR POSTING NEW MESSAGE:", error_thrown);
				}
			});	
		},error,optn
		);	
	}
}

function poll(){
	$.ajax({
		url:"/10/update",
		type:"POST",
		data:{num_seen:g_num_seen},
		success: function(data, text_status, jq_xhr) {
			var i = 0;
			$.each(data.locations, function(key, val) {
				var marker = new google.maps.Marker({
					position:val,
					label:key,
					map:map
				});

				i++;
			})
		console.log(i);
		g_num_seen = i;
		poll();	
		}
	});


}


function error(err){
	alert(err);
}
