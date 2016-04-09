$(document).ready(function() { 
	getLocation();
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
	var map = new google.maps.Map(put_map, {
		center: LatLng,
		zoom:18
	});

	var marker = new google.maps.Marker({	
		position: LatLng,
		map:map
	});

	// update center and marker
	if(navigator.geolocation){
		var optn = {
			enableHighAccurarcy: true,
			timeout            : Infinity,
			maximumAge         : 0
		};

		navigator.geolocation.watchPosition(function(position){
			var LatLng = {lat:position.coords.latitude, lng:position.coords.longitude};
			map.setCenter(LatLng);
			marker.setPosition(LatLng);
			// use ajax to send location and username to server
		},error,optn
		);	
	
	}


}

function error(err){
	alert(err);
}
