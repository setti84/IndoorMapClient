function addMapLogic() {


    map.on('moveend', function() {

        var centerCoord = [map.getCenter().lng, map.getCenter().lat];
        // BBOX for the area which is to query for building data
        var boxBuilding = map.getCenter().toBounds(building.boxBuildingSize(map.getZoom())).toArray();

        var centerBox = [
            [boxBuilding[0],
                [boxBuilding[0][0], boxBuilding[1][1]], boxBuilding[1],
                [boxBuilding[1][0], boxBuilding[0][1]], boxBuilding[0]
            ]
        ];

        addLayerToMap(centerCoord, centerBox);
        
        var queryData = map.queryRenderedFeatures([
            [map.project(boxBuilding[0]).x, map.project(boxBuilding[0]).y],
            [map.project(boxBuilding[1]).x, map.project(boxBuilding[1]).y]
        ], { layers: ['building'] });
        /*
        var buildings2 = map.querySourceFeatures('mapbox', { sourceLayer: 'building', filter: ['!=', 'type','building:part']});
        console.log(buildings2)
        for (var i = 0; i < buildings2.length; i++) {
            console.log(buildings2[i]);
        };
        console.log("-------------------")
        */
        if (queryData.length == 0) {
            console.log("building undefined")
            return;
        }

        // find the right building of all requested buildings    
        building.find(queryData);


    });

    // Background layer and layer for indoor data are separated. So indoor layer need to be added to map.
    /*
    for (var i = 0; i < indoorStyle.layers.length; i++) {
        map.addLayer(indoorStyle.layers[i]);
    }
    */

}

function addLayerToMap(centerCoord, centerBox) {


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
        poini = {
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
        };
        map.getSource('center').setData(poini);
    }


    if (map.getLayer('centerbbox') === undefined) {

        map.addLayer({
            'id': 'centerbbox',
            'type': 'fill',
            'source': {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Polygon',
                        'coordinates': centerBox
                    }
                }
            },
            'layout': {},
            'paint': {
                'fill-color': 'black',
                'fill-opacity': 0.7
            }
        });
    } else {
        cenboxi = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": centerBox
                }
            }]
        };
        map.getSource('centerbbox').setData(cenboxi);
    }


}




/*
start worker task to locate the right building
logic: start new worker if its undefined, if an old worker is already 
running terminate the old worker first and start a new one with 
the newest coordinates and user view 
*/

/*        if (typeof(worker) == "undefined") {
            //console.log("worker undefinded")
            worker = new Worker("script/worker/building.js");

        } else {
            worker.terminate();
            worker = undefined;
            worker = new Worker("script/worker/building.js");
            //console.log(worker)
        }

        worker.addEventListener('message', function(e) {
            console.log("worker finished");
            //console.log(e.data);
        }, false);

        worker.postMessage(buildings); // Start the worker.
    */