//Googlemaps API variables
var map;
let geocoder;
var service;
var infowindow;
var response;
var marker;
var markersArray = [];
var index = 0;
var cityInput = document.querySelector("#city-input");

// Get references to page elements
const $exampleText = $("#example-text");
const $exampleDescription = $("#example-description");
const $submitBtn = $("#submit");
const $exampleList = $("#example-list");

// The API object contains methods for each kind of request we'll make
const API = {
  saveExample: function (example) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json",
      },
      type: "POST",
      url: "api/examples",
      data: JSON.stringify(example),
    });
  },
  getExamples: function () {
    return $.ajax({
      url: "api/examples",
      type: "GET",
    });
  },
  deleteExample: function (id) {
    return $.ajax({
      url: "api/examples/" + id,
      type: "DELETE",
    });
  },
};

// refreshExamples gets new examples from the db and repopulates the list
const refreshExamples = function () {
  API.getExamples().then(function (data) {
    const $examples = data.map(function (example) {
      const $a = $("<a>")
        .text(example.text)
        .attr("href", "/example/" + example.id);

      const $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id,
        })
        .append($a);

      const $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
const handleFormSubmit = function (event) {
  event.preventDefault();

  const example = {
    text: $exampleText.val().trim(),
    description: $exampleDescription.val().trim(),
    UserId: window.userId,
  };

  if (!(example.text && example.description)) {
    alert("You must enter an example text and description!");
    return;
  }

  API.saveExample(example).then(function () {
    refreshExamples();
  });

  $exampleText.val("");
  $exampleDescription.val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
const handleDeleteBtnClick = function () {
  const idToDelete = $(this).parent().attr("data-id");

  API.deleteExample(idToDelete).then(function () {
    refreshExamples();
  });
};

//Google Maps API functionality
var mapSubmitHandler = function (event) {
  var zipcode = cityInput.value;
  geocoder({ address: zipcode });
};

function initMap() {
  geocoder = new google.maps.Geocoder();
  // let location = new google.maps.LatLng(37.86430029068307, -76.88443400013752);
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 34.269, lng: 72.562 },
    zoom: 5,
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
      // map.setCenter(results[0].geometry.location);
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

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$submitBtn.on("click", initMap);
$exampleList.on("click", ".delete", handleDeleteBtnClick);
// initMap();
