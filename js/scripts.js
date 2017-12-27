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

var mapInstance, infowindow, currentLocationObj, markers = [];
var radiusSlider, txtsearchRadius;

function loadPlaceTypes() {
  if(placeTypes.length > 0){
    var cmbPlaceType = document.getElementById('cmbPlaceType');
    for (var i = 0; i< placeTypes.length; i++){
      var opt = document.createElement('option');
      opt.value = placeTypes[i];
      opt.innerHTML = (placeTypes[i].charAt(0).toUpperCase() + placeTypes[i].slice(1)).replace("_", " ");
      cmbPlaceType.appendChild(opt);
    }
  }
}

function getSelectedPlace() {
  var selectedValue = document.getElementById("cmbPlaceType").value;
  console.log('selectedValue=>', selectedValue);
  searchPlaces(selectedValue);
}

function getGeoLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setLocationByGeo, showError);
  } else {
    console.log('Something went wrong!');
  }
}

function showError(error) {
  var errorDiv = document.getElementById("errorDiv");
  switch(error.code) {
    case error.PERMISSION_DENIED:
    console.log("User denied the request for Geolocation.");
    errorDiv.innerHTML = "User denied the request for Geolocation.";
    break;
    case error.POSITION_UNAVAILABLE:
    console.log("Location information is unavailable.");
    errorDiv.innerHTML = "Location information is unavailable.";
    break;
    case error.TIMEOUT:
    console.log("The request to get user location timed out.");
    errorDiv.innerHTML = "The request to get user location timed out.";
    break;
    case error.UNKNOWN_ERROR:
    console.log("An unknown error occurred.");
    errorDiv.innerHTML = "An unknown error occurred.";
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

  getSelectedPlace();
}

function searchPlaces(strPlaceType) {
  console.log('in searchPlaces=>', strPlaceType);
  var searchRadiusElValue = document.getElementById('searchRadius').value;
  if(!searchRadiusElValue){
    searchRadiusElValue = 2;
    document.getElementById('searchRadius').value = 2;

    //changing the search radius
    var radiusSlider = document.querySelector('#radiusSlider'),
    txtsearchRadius = document.querySelector('#searchRadius');
    radiusSlider.value = 2;
    txtsearchRadius.innerHTML = radiusSlider.value;
  }

  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(mapInstance);

  radiusSlider.addEventListener('change', function () {
    console.log('radiusSlider.value=>', radiusSlider.value);
    txtsearchRadius.value = radiusSlider.value;
    searchRadiusElValue = radiusSlider.value;

    var radiusInMeter = searchRadiusElValue * 1000;

    service.nearbySearch({
      location: currentLocationObj,
      radius: radiusInMeter,
      type: [strPlaceType]
    }, cbResults);

  }, false);

  var radiusInMeter = searchRadiusElValue * 1000;

  service.nearbySearch({
    location: currentLocationObj,
    radius: radiusInMeter,
    type: [strPlaceType]
  }, cbResults);

}

function cbResults(results, status) {
  console.log('in cbResults=>');
  if(results.length > 0){
    document.getElementById('placeCount').innerHTML = '(' + results.length + ')';
    clearMarkers();
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        console.log('results[i].name=>', results[i].name);
        addMarker(results[i]);
      }
    }
  }else{
    console.log('No results found=>', results);
  }
}

function addMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    animation: google.maps.Animation.DROP,
    map: mapInstance,
    position: place.geometry.location
  });

  markers.push(marker);

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}