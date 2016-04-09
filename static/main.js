$(document).ready(function() { 
	getLocation();

});


function getLocation() {

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(initMap, error);

	} else{
		alert("Geolocation is not supported by this browser");
	}
}


function initMap(position) {
	
	var LatLng = {lat:position.coords.latitude, lng:position.coords.longitude};

	var map = new google.maps.Map(document.getElementById("map"), {
		zoom:4,
		center: LatLng
	});

	var marker = new google.maps.Marker({	
		position: LatLng,
		map:map
	});


}

function error(err){
	alert(err)
}