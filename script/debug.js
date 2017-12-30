var debug = (function() {

    var addCenterToMap = function(centerCoord) {

        if (map.getLayer('center') === undefined) {

            map.addLayer({
                "id": "center",
                "type": "symbol",
                "source": {
                    "type": "geojson",
                    "data": {
                        "type": "FeatureCollection",
                        "features": [{
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": centerCoord
                            },
                            "properties": {
                                "title": "Mapbox DC",
                                "icon": "monument"
                            }
                        }]
                    }
                },
                "layout": {
                    "icon-image": "{icon}-15"
                }
            });
        } else {
            map.getSource('center').setData({
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Point",
                        "coordinates": centerCoord
                    },
                    "properties": {
                        "title": "Mapbox DC",
                        "icon": "monument"
                    }
                }]
            });
        }
    }

    var visualizeBuildings = function(selectedBuilding, features) {

        if (features !== undefined) {
            if (map.getLayer('allselectedBuilding') === undefined) {
                map.addLayer({
                    "id": "allselectedBuilding",
                    "type": "fill",
                    "source": {
                        "type": "geojson",
                        "data": {
                            "type": "FeatureCollection",
                            "features": features
                        }
                    },
                    'paint': {
                        'fill-color': 'yellow',
                        'fill-opacity': 0.4
                    }
                });
            } else {
                map.getSource('allselectedBuilding').setData({
                    "type": "FeatureCollection",
                    "features": features
                });
            }
        };

        if (selectedBuilding !== undefined) {
            if (map.getLayer('debugSelectedBuilding') === undefined) {
                map.addLayer({
                    "id": "debugSelectedBuilding",
                    "type": "fill",
                    "source": {
                        "type": "geojson",
                        "data": {
                            "type": "FeatureCollection",
                            "features": [selectedBuilding]
                        }
                    },
                    'paint': {
                        'fill-color': 'green',
                        'fill-opacity': 0.3
                    }
                });
            } else {
                map.getSource('debugSelectedBuilding').setData({
                    "type": "FeatureCollection",
                    "features": [selectedBuilding]
                });
            }
        };

    }

    function popupDetails(e) {
        // add popup with map details on click
        var featuresRendered = map.queryRenderedFeatures(e.point);
        var properties = [];
        var nummer = 1;
        for (var i = 0; i < featuresRendered.length; i++) {


            properties.push("Object " + nummer + ": " + JSON.stringify(featuresRendered[i].properties) + "<br>");

            nummer++;
        }
        if (!properties.length) {
            return;
        }
        var width = document.getElementById("map").offsetWidth - 100;
        var popup = new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML("<div style='font-size:12pt; max-width: " + width + "px; overflow: scroll;'>" + properties + "</div>")
            .addTo(map);
    }

    return {
        addCenterToMap: addCenterToMap,
        visualizeBuildings: visualizeBuildings,
        popupDetails: popupDetails
    };

}());