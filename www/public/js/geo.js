if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(postPosition, onError);
  // also monitor position as it changes
 // navigator.geolocation.watchPosition(postPosition);
} else {
  onError();
}

function postPosition(position) {
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
}

function onError() {
//no pos
}