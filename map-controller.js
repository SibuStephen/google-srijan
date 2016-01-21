angular.module('maps-render',[])
.controller("MapRenderingController", function ($scope,$http) {
 var bounds = new google.maps.LatLngBounds();
 var infowindow = new google.maps.InfoWindow();
 navigator.geolocation.getCurrentPosition(function(position) {
  var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  var my_position_marker =  new google.maps.Marker ({
    position: geolocate
  });
  var myOptions = {
    center: geolocate,
    map : mapy,
    zoom: 15
  }

  // Create the search box and link it to the UI element.
  var input = document.getElementById('searchbar');
  var mapy = new google.maps.Map(document.getElementById('map'), myOptions);
      infowindow.setContent("You are here");
      infowindow.open(mapy,my_position_marker);
      bounds.extend(my_position_marker.position);
      // infowindow.setCenter(geolocate);
  // bounds.extend(my_position_marker.position);
  mapy.setCenter(bounds.getCenter());
  var searchBox = new google.maps.places.SearchBox(input);
  // Bias the SearchBox results towards current map's viewport.
  mapy.addListener('bounds_changed', function() {
    searchBox.setBounds(mapy.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
 $scope.click_me = function() {
    mapy.fitBounds(bounds);
  }
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();
 });

    /*Marker Placement from the json data available*/
    $http.get("goa-bikes.json").then(function(response) {
      var er = response.data.Bikes;
      for (var i = 0; i < er.length; i++) {
        var data = er[i];
        var myLatlng = new google.maps.LatLng(data.lat, data.long);
        var marker = new google.maps.Marker({
          position: myLatlng,
          map: mapy,
          title: data.title
        });
        (function (markerq, data) {
          google.maps.event.addListener(markerq, "click", function (e) {
                  infowindow.setContent("<div style = 'width:200px;min-height:40px'>" + data.Address + "</div>");
                  infowindow.open(mapy, markerq);
                });
        })(marker, data);
        bounds.extend(marker.position);
      }
      mapy.setCenter(bounds.getCenter());
    });
     $scope.click_me = function() {
    mapy.fitBounds(bounds);
  }

  /*For adding address onto the map*/
  $scope.add_marker = function() {
     var geocoder = new google.maps.Geocoder();
     var address = document.getElementById('add_marker').value;
        geocoder.geocode({ 'address': address }, function (results, status) {

            if (status == google.maps.GeocoderStatus.OK) {
                var latitude = results[0].geometry.location.lat();
                var longitude = results[0].geometry.location.lng();
            }
        /*Setting the latitude and longitude on map as a marker*/
        var myLatlng = new google.maps.LatLng(latitude, longitude);
        var marker = new google.maps.Marker({
          position: myLatlng,
          map: mapy
        });
   bounds.extend(marker.position);
  });
  }
});

});
