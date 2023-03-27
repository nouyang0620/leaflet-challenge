// Store URL
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Read in data with D3 library
d3.json(url).then(function(data){
    getFeatures(data.features);
  });
    

function getFeatures(earthquakeData){

    // Assign pop up text
    function featureData(feature, layer){
        layer.bindPopup(`<p>Location: ${feature.properties.place}</p><hr>
                        <p>Date/Time: ${new Date(feature.properties.time)}</p><hr>
                        <p>Magnitude: ${feature.properties.mag}</p>`);
    }

    // Function to create markers
    function createMarker(feature, latlng){
       let options = {
        radius:feature.properties.mag*5,
        fillColor: markerColor(feature.properties.mag),
        color: markerColor(feature.properties.mag),
        weight: 1,
        opacity: .9,
        fillOpacity: 0.40
       } 
       return L.circleMarker(latlng,options);
    }
    // Create a variable for earthquakes to house marker data
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: featureData,
        pointToLayer: createMarker
    });


    createMap(earthquakes);
}

// Color selection based on earthquake magnitude
function markerColor(mag){
    switch(true){
        case(1.0 <= mag && mag <= 2.5):
            return "#fb6a4a"
        case (2.5 <= mag && mag <=4.0):
            return "#2c7fb8";
        case (4.0 <= mag && mag <=5.5):
            return "#54278f";
        case (5.5 <= mag && mag <= 8.0):
            return "#006d2c";
        case (8.0 <= mag && mag <=20.0):
            return "#BC0000";
        default:
            return "#E2FFAE";
    }
}

// Create map legend
let legend = L.control({position: 'bottomright'});

legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend');
    var grades = [1.0, 2.5, 4.0, 5.5, 8.0];
    var labels = [];
    var legendInfo = "<h3>Magnitude</h3>";

    div.innerHTML = legendInfo

    
    // For eat item, select marker color and add to list.
    for (var i = 0; i < grades.length; i++) {
          labels.push('<ul style="background-color:' + markerColor(grades[i] + 1) + '"> <span>' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '' : '+') + '</span></ul>');
        }

      // add each label list item to the div under the <ul> tag
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    
    return div;
  };


// Create map
function createMap(earthquakes) {
   let street = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
    maxZoom: 20,
  })


  //Define a baseMaps object 
  let baseMaps = {
    "Street Map": street,
  };

 // Create overlay object to hold marker layer
let overlayMaps = {
    Earthquakes: earthquakes
};

  // Create map object
  let myMap = L.map("map", {
    center: [
      0.00,0.00
    ],
    zoom: 1,
    layers: [street, earthquakes]
  });
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  legend.addTo(myMap);
}