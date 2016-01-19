angular.module('maps-render',[])
.controller("MapRenderingController", function ($scope) {
  var myOptions = {
    center: {lat: -33.8688, lng: 151.2195},
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
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

    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];
    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(20, 20)
      };
      // Create a marker for each place.
      
      markers.push(new google.maps.Marker({
        map: mapy,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    $scope.click_me = function() {
      mapy.fitBounds(bounds);
    }
  });
});
