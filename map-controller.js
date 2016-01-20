angular.module('maps-render',[])
.controller("MapRenderingController", function ($scope,$http) {
 var bounds = new google.maps.LatLngBounds();
 navigator.geolocation.getCurrentPosition(function(position) {

  var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  var myOptions = {
    center: geolocate,
    zoom: 20
  }

  var infowindow = new google.maps.InfoWindow();
  var mapy = new google.maps.Map(document.getElementById('map'), myOptions);
  // Create the search box and link it to the UI element.
  var input = document.getElementById('searchbar');
  var searchBox = new google.maps.places.SearchBox(input);
  // Bias the SearchBox results towards current map's viewport.
  mapy.addListener('bounds_changed', function() {
    searchBox.setBounds(mapy.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.

  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    /*Marker Placement from json data*/
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
                  // alert("Place name - "+ markerq.title);
                  infowindow.setContent("<div style = 'width:200px;min-height:40px'>" + data.Address + "</div>");
                  infowindow.open(map, markerq);
                });
        })(marker, data);
        bounds.extend(marker.position);
      }
      mapy.setCenter(bounds.getCenter());
    });
  });
  $scope.click_me = function() {
    mapy.fitBounds(bounds);
  }
});
});
