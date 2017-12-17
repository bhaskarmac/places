console.log('scripts loaded');
console.log('mapsKey=>', mapsKey);

//loading and adding the Google maps js to DOM
var mapJSRef = document.createElement('script');
mapJSRef.setAttribute("type", "text/javascript");
mapJSRef.setAttribute('src', 'https://maps.googleapis.com/maps/api/js?key='+ mapsKey.key +'&libraries=places');
mapJSRef.onload = function () {
	console.log('mapJSRef loaded');
	initMap();
};
document.getElementsByTagName("head")[0].appendChild(mapJSRef);

var mapInstance;

function initMap() {
	//Creating map and setting options
	mapInstance = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 18.5204, lng: 73.8567},
		zoom: 8
	});
}