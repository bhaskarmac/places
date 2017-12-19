console.log('scripts loaded');
console.log('mapsKey=>', mapsKey);
console.log('placeTypes=>', placeTypes);

//loading and adding the Google maps js to DOM
var mapJSRef = document.createElement('script');
mapJSRef.setAttribute("type", "text/javascript");
mapJSRef.setAttribute('src', 'https://maps.googleapis.com/maps/api/js?key='+ mapsKey.key +'&libraries=places');
mapJSRef.onload = function () {
	console.log('mapJSRef loaded');
  getGeoLocation();
  loadPlaceTypes();
};
document.getElementsByTagName("head")[0].appendChild(mapJSRef);

var mapInstance, infowindow, currentLocationObj;

function loadPlaceTypes() {
  if(placeTypes.length > 0){
    var cmbPlaceType = document.getElementById('cmbPlaceType');
    console.log('cmbPlaceType=>', cmbPlaceType);
    for (var i = 0; i< placeTypes.length; i++){
      var opt = document.createElement('option');
      opt.value = placeTypes[i];
      opt.innerHTML = placeTypes[i];
      cmbPlaceType.appendChild(opt);
    }
  }
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
  
  currentLocationObj = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };

  mapInstance = new google.maps.Map(document.getElementById('map'), {
    center: currentLocationObj,
    zoom: 15
  });

  searchPlaces();
}

function searchPlaces(strPlaceType) {
  console.log('in searchPlaces=>', strPlaceType);

  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(mapInstance);
  service.nearbySearch({
    location: currentLocationObj,
    radius: 2000,
    type: ['restaurant']
  }, cbResults);

}

function cbResults(results, status) {
  console.log('in cbResults=>');
  if(results.length > 0){
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        console.log('results[i].name=>', results[i].name);
        console.log('results[i]=>', results[i]);
        addMarker(results[i]);
      }
    }
  }else{
    console.log('No results found=>', results);
  }
}

function addMarker(place) {
  console.log('in createMarker=>');
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: mapInstance,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}