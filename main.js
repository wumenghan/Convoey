$(document).read(function() { 

});


function initMap(position) {
	var LatLng = {lat:position.coords.latitude, lng:position.coords.longitude};

	var map = new google.maps.Map($("#map"), {
		zoom:4,
		center: LatLng
	});

	var marker = new google.maps.Marker({	
		position: LatLng,
		map:map
	});


}


function getLocation() {

	if (navigator.geolocation) {
		navigator.geolocatoin.getCurrentPosition(initMap);
	} else{
		alert("Geolocation is not supported by this browser");
	}
}
