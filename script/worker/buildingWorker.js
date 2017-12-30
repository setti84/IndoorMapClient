importScripts('./../helper/turf.min.js');

self.addEventListener('message', function(e) {

    var queryData = e.data[0];
    var center = e.data[1];
    var buildings = [];
    var selectedBuilding = e.data[2];
    var position;
    var bufferSelectedBuilding;
    var buildingFilter = ["none"];
    var buildingParts;
    var newSelectedBuilding = {
        "type": "Feature",
        "properties": {
            "size": 1,
            "distance": 10000,
            "id": 1

        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0]
                ]
            ]
        }
    };

    // sometimes buildings are split in different geometry's. Inn this loop only one part is given to building array
    for (var i = 0; i < queryData.length; i++) {
        if (queryData[i].geometry.type === "Polygon" && queryData[i].properties.kind === "building") {
            position = isInside(buildings, queryData[i]);
            if (position === -1) {
                // Gebäude noch nicht im Array und muß neu erstellt werden
                buildings.push({
                    "type": "Feature",
                    "properties": queryData[i].properties,
                    "geometry": {
                        "type": queryData[i].geometry.type,
                        "coordinates": queryData[i].geometry.coordinates // [queryData[i].geometry.coordinates[0]]
                    }
                });
            }
        };
    }

    // selection for size and distance to screen
    for (var i = 0; i < buildings.length; i++) {
        // calculation of distance and size of a feature
        //the idea is to use both parameter to calculate a probability for the building being selected            
        buildings[i].properties.size = Math.round(turf.area(buildings[i]));
        // calculate distance for each feature
        buildings[i].properties.distance = turf.distance(turf.centroid(buildings[i]).geometry.coordinates, [center.lng, center.lat], { units: 'kilometers' }) * 100;
        // compare the result of size and distance for the new and old feature to tell if the new feature is bigger than the old one
        if (newSelectedBuilding.properties.size / newSelectedBuilding.properties.distance <
            buildings[i].properties.size / buildings[i].properties.distance) {
            newSelectedBuilding = buildings[i];
        };
    }

    // in case both buildings are the same we don't need any calculation anymore and everything stays the same till the next move of the map
    if (newSelectedBuilding.properties.id === selectedBuilding.properties.id) {
        console.log("terminate worker")
        //self.postMessage([buildings, selectedBuilding, buildingFilter, true]);
        self.postMessage({buildings: buildings, selectedBuilding: selectedBuilding, buildingParts: buildingParts, newBuilding: false, buildingFilter: buildingFilter});

        return;
    };


    selectedBuilding = newSelectedBuilding;
    // start height extrusion
    //selectedBuilding.properties.height = 0.5;
    // buffer around building shape    
    bufferSelectedBuilding = turf.buffer(newSelectedBuilding, 0.01, { units: 'kilometers' });

    // check for all building parts which are inside of the selected buildings and take these id's 
    // used for selection in extrusion filter of 3d buildings
    /*
    for (var i = 0; i < queryData.length; i++) {
        if (queryData[i].geometry.type === "Polygon") {
            if (!turf.booleanDisjoint(bufferSelectedBuilding, queryData[i])) {
                buildingFilter.push(['==', 'id', queryData[i].properties.id])
            }
        };
    };
    */
    buildingParts = createBuildingParts(bufferSelectedBuilding, queryData);
    buildingParts.push(selectedBuilding);
    //console.log(JSON.stringify(buildingParts));
    
    for (var i = 0; i < buildingParts.length; i++) {
        buildingFilter.push(['==', 'id', buildingParts[i].properties.id])
    };


    // send data back to main thread
    //self.postMessage([buildings, selectedBuilding, buildingParts, false]);
    self.postMessage({buildings: buildings, selectedBuilding: selectedBuilding, buildingParts: buildingParts, newBuilding: true, buildingFilter: buildingFilter});

}, false);

function createBuildingParts(bufferSelectedBuilding, queryData) {
    var buildingParts = [];
    for (var i = 0; i < queryData.length; i++) {
        if (queryData[i].geometry.type === "Polygon") {
            if (!turf.booleanDisjoint(bufferSelectedBuilding, queryData[i])) {
                buildingParts.push(queryData[i])
            }
        };
    };

    return buildingParts;

}


function isInside(buildings, building) {
    // check if building is already in buildingsArray
    var numberOfBuildingInArray = -1;
    for (var i = 0; i < buildings.length; i++) {
        if (buildings[i].properties.id === building.properties.id) {
            numberOfBuildingInArray = i;
            break;
        } else {
            numberOfBuildingInArray = -1;
        }
    };
    return numberOfBuildingInArray;
}

/*

  
    for (var i = 0; i < queryData.length; i++) {       
        if (queryData[i].geometry.type === "Polygon" && queryData[i].properties.kind === "building") {
            position = isInside(buildings, queryData[i]);
            if (position === -1) {
                // Gebäude noch nicht im Array und muß neu erstellt werden
                buildings.push(JSON.parse(JSON.stringify({
                    "type": "Feature",
                    "properties": queryData[i].properties,
                    "geometry": {
                        "type": queryData[i].geometry.type,
                        "coordinates": [queryData[i].geometry.coordinates[0]]
                    }
                })));
            } else {

                // add the geometry because its the same building
            }
        };
    }
   






//console.log(e.data)
    var features = e.data[0];
    var center = e.data[1];
    
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
    for (var i = 0; i < features.length; i++) {
        if (features[i].geometry.type === "MultiPolygon") {
            for (var j = 0; j < features[i].geometry.coordinates.length; j++) {
                feature = {
                    "type": "Feature",
                    "properties": features[i].properties,
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": features[i].geometry.coordinates[j]
                    }
                };
            };
            singlePolys.push(feature);
        } else if (features[i].geometry.type === "Polygon") {
            feature = {
                "type": "Feature",
                "properties": features[i].properties,
                "geometry": features[i].geometry
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
        buildings[i].properties.distance = turf.distance(turf.centroid(buildings[i]).geometry.coordinates, [center.lng, center.lat], { units: 'kilometers' }) * 100;
        // compare the result of size and distance for the new and old feature to tell if the new feature is bigger than the old one
        if (selectedBuilding.properties.size / selectedBuilding.properties.distance <
            buildings[i].properties.size / buildings[i].properties.distance
        ) {
            selectedBuilding = buildings[i];
        };


*/