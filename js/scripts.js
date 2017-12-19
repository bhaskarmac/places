console.log('scripts loaded');
console.log('mapsKey=>', mapsKey);

//loading and adding the Google maps js to DOM
var mapJSRef = document.createElement('script');
mapJSRef.setAttribute("type", "text/javascript");
mapJSRef.setAttribute('src', 'https://maps.googleapis.com/maps/api/js?key='+ mapsKey.key +'&libraries=places');
mapJSRef.onload = function () {
	console.log('mapJSRef loaded');
  getGeoLocation();
};
document.getElementsByTagName("head")[0].appendChild(mapJSRef);

var mapInstance;


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


function getGeoLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setLocationByGeo, showError);
  } else {
    console.log('Something went wrong!');
  }
}

function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
    console.log("User denied the request for Geolocation.");
    break;
    case error.POSITION_UNAVAILABLE:
    console.log("Location information is unavailable.");
    break;
    case error.TIMEOUT:
    console.log("The request to get user location timed out.");
    break;
    case error.UNKNOWN_ERROR:
    console.log("An unknown error occurred.");
    break;
  }
}

function setLocationByGeo(position) {
  console.log('currentPosition=>', position);
  
  var currentPosition = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude
  };

  mapInstance = new google.maps.Map(document.getElementById('map'), {
    center: {lat: currentPosition.latitude, lng: currentPosition.longitude},
    zoom: 15
  });

  otherThings();
}

function otherThings() {
 var addressURL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=18.5204,73.8567&radius=500&type=restaurant&key='+ mapsKey.key;

}