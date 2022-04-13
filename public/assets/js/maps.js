var map;
var geocoder;
var service;
var infowindow;
var response;
var marker;
var markersArray = [];
var index = 0;

var mapSubmitHandler = function (event) {
  console.alert("Awoooooooo");

  var zipcode = zipInput.value.trim();
  geocoder({ address: zipcode });
};

function initMap() {
  geocoder = new google.maps.Geocoder();
  let location = new google.maps.LatLng(37.86430029068307, -76.88443400013752);
  map = new google.maps.Map(document.getElementById("map"), {
    center: location,
    zoom: 8,
  });
}

function geocode(request) {
  geocoder
    .geocode(request)
    .then((result) => {
      const { results } = result;

      let ask = {
        location: results[0].geometry.location,
        radius: "60000",
        type: ["establishment"],
      };
      map.setCenter(results[0].geometry.location);
      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, callback);
      return results;
    })
    .catch((err) => {
      console.log("map search not successful for this reason" + err);
    });
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
      var serviceDetails = {
        serviceId: `${results[i].place_id}`,
        fields: ["name", "formatted_address", "website", "photos", "geometry"],
      };
      var addtServices = new google.maps.places.PlacesService(map);
      // used getDetails method to get more info
      addtServices.serviceDetails(placeDetails, getDetails);
    }
  }
}

var serviceDetails = function (placeDetails) {
  createMarker(placeDetails);
  if (index == 4) {
    index = 0;
  }
};

function createMarker(place) {
  // Checks if markers are on map already. If they are, calls function below to remove them
  if (markersArray.length > 3) {
    setMapOnAll(null);
  }

  var contentString = `
    <div style="display: flex;">
    ${
      place?.photos
        ? `<img class="image is-128x128" src=${place.photos[0].getUrl()} alt=${
            place.name
          } />`
        : ""
    }
      <div><a href=${place.website} target="_blank">${place.name}</a></div>
    </div>`;

  if (!place.geometry || !place.geometry.location) return;

  const infowindow = new google.maps.InfoWindow({
    content: contentString,
  });

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  markersArray.push(marker);

  marker.addListener("click", () => {
    infowindow.open({
      anchor: marker,
      map,
      shouldFocus: false,
    });
  });
}

function setMapOnAll(map) {
  for (let i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(map);
  }
  markersArray = [];
}

$("submitBtn").on("submit", mapSubmitHandler);
