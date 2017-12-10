var building = (function() {

    var find = function(queryData) {
     
        var feature;
        var building;
        var singlePolys = [];
        var buildings = [];

        var selectedBuilding = {
            "type": "Feature",
            "properties": {
                "size": 11,
                "distance": 1000

            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    []
                ]
            }
        };
        
        //    A polygon is commonly defined as an outer ring (the first ring in the polygon data) 
        //    with any number of holes (any other ring in the polygon following).
        //    A multipolygon is a set of polygons, where each polygon has 1 to n rings.    
        // make all data to Polygon        
        for (var i = 0; i < queryData.length; i++) {
            if (queryData[i].geometry.type === "MultiPolygon") {
                for (var j = 0; j < queryData[i].geometry.coordinates.length; j++) {
                    feature = {
                        "type": "Feature",
                        "properties": queryData[i].properties,
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": queryData[i].geometry.coordinates[j]
                        }
                    };
                };
                singlePolys.push(feature);
            } else if (queryData[i].geometry.type === "Polygon") {
                feature = {
                    "type": "Feature",
                    "properties": queryData[i].properties,
                    "geometry": queryData[i].geometry
                };
                singlePolys.push(feature);
            };
        };
        feature = {};

        //For vector tile splitting of buildings it needs to be known which geometry's are actually one building.  
        //Therefore we need to put these objects-parts of buildings back together to one building.
        // put together polygons at tile borders
        for (var i = 0; i < singlePolys.length; i++) {
            building = JSON.parse(JSON.stringify(singlePolys[i]))
            singlePolys.splice(i, 1);
            for (var j = 0; j < singlePolys.length; j++) {
                if (building.geometry.type === "Polygon" &&
                    singlePolys[j].geometry.type === "Polygon" &&
                    turf.union(singlePolys[j], building).geometry.type === "Polygon") {

                    building = turf.union(singlePolys[j], building);
                    singlePolys.splice(j, 1);
                    j = -1;
                }
            };
            buildings.push(building);
            i = -1;
        } 

        // find the most interesting building and it's outline
        for (var i = 0; i < buildings.length; i++) {    
            // calculation of distance and size of a feature
            //the idea is to use both parameter to calculate a probability for the building being selected            
            buildings[i].properties.size = Math.round(turf.area(buildings[i]));            
            // calculate distance for each feature
            buildings[i].properties.distance = turf.distance(turf.centroid(buildings[i]).geometry.coordinates, [map.getCenter().lng, map.getCenter().lat], { units: 'kilometers' }) * 100;
            // compare the result of size and distance for the new and old feature to tell if the new feature is bigger than the old one
            if (selectedBuilding.properties.size / selectedBuilding.properties.distance < 
                buildings[i].properties.size / buildings[i].properties.distance
                ) {
                selectedBuilding = buildings[i];
            };
        }  

        // add calculated features to map
        visualize(selectedBuilding, buildings);

    };


    var visualize = function(selectedBuilding, features) {


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


