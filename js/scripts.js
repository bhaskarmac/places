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

	var addressURL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=18.5204,73.8567&radius=500&type=restaurant&key='+ mapsKey.key;

	get(addressURL).then(function(response) {
		var finalResults = JSON.parse(response);
		console.log('finalResults=>', finalResults);
	}, function(error) {
		console.log("Promise failed=>", error);
	});
}

/**
 * [get method for XHR]
 * @param  {[string]} url [accepts the url to make call]
 * @return {[Promise]}     [returns Promise of call]
 */
 function get(url) {
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      if (req.status == 200) {
        // Resolve the promise with the response text
        resolve(req.response);
      }
      else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(req.statusText));
      }
    };

    // Handle network errors
    req.onerror = function() {
    	reject(Error("Network Error"));
    };

    // Make the request
    req.send();
  });
} //get ends here