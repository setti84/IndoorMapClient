var building = (function() {

    var find = function(buildings) {

        /*
         Bedingungen für ein selektiertes Gebäude
         1. Gebäude muss nah am Bildschirmmittelpunkt sein
         2. Gebäude werden nach größe bevorzugt behandelt
        */


        var center = map.getCenter();

        visualize(buildings);

    };


    var visualize = function(buildings) {
        var features = [];
        var feature;
        var selectedBuilding;

        for (var i = 0; i < buildings.length; i++) {            
            if (buildings[i].geometry.type == "Polygon") {
                feature = {
                    "type": "Feature",
                    "properties": {

                    },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": buildings[i].geometry.coordinates
                    }
                };
            } else if (buildings[i].geometry.type == "MultiPolygon") { // this is necessary to only get outer rings of multis
                feature = {
                    "type": "Feature",
                    "properties": {

                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": buildings[i].geometry.coordinates
                    }
                };
            }
            // calculation of distance and size of a feature
            //the idea is to use both parameter to calculate a probability for the building of being selected
            feature.properties.size = turf.area(feature);            
            feature.properties.distance = turf.distance(turf.centroid(feature).geometry.coordinates, [map.getCenter().lng, map.getCenter().lat], { units: 'kilometers' }) * 100;

            features.push(feature);
            if (i > 0) {
                if (selectedBuilding.properties.size < features[i].properties.size / feature.properties.distance) { // /feature.properties.distance
                    selectedBuilding = features[i];
                }
            } else {
                selectedBuilding = features[i];
            }
        };
        console.log(features);

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
                    'fill-opacity': 0.2
                }
            });
        } else {

            bui = {
                "type": "FeatureCollection",
                "features": features
            };
            map.getSource('allselectedBuilding').setData(bui);
        }

        if (map.getLayer('selectedBuilding') === undefined) {

            map.addLayer({
                "id": "selectedBuilding",
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
                    'fill-opacity': 0.6
                }
            });
        } else {

            bui2 = {
                "type": "FeatureCollection",
                "features": [selectedBuilding]
            };
            map.getSource('selectedBuilding').setData(bui2);
        }
    }

    var boxBuildingSize = function(zoom) {
        // returns in dependency to a zoomlevel a number for the size of a polygon
        var area = 100;
        if (zoom >= 20) {
            area = 10;
        } else if (zoom >= 19) {
            area = 18;
        } else if (zoom >= 18) {
            area = 35;
        } else if (zoom >= 17) {
            area = 70;
        }
        return area;
    }

    return {
        find: find,
        boxBuildingSize: boxBuildingSize
    };

}());