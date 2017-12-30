var indoor = (function() {

    var requestData = function(selectedBuilding) {

        selectedBuilding = turf.toMercator(selectedBuilding);
        var queryString = Math.round(selectedBuilding.geometry.coordinates[0][0][0]) + " " + Math.round(selectedBuilding.geometry.coordinates[0][0][1]);
        for (var i = 1; i < selectedBuilding.geometry.coordinates[0].length; i++) {
            queryString = queryString + " , " + Math.round(selectedBuilding.geometry.coordinates[0][i][0]) + " " + Math.round(selectedBuilding.geometry.coordinates[0][i][1]);
        };

        $.ajax({
            url: "https://sebastiansettgast.com/geoserver/wfs?service=wfs&version=1.0.0&request=getfeature&srsName=EPSG:4326&typename=indoor:planet_osm_polygon&CQL_FILTER=INTERSECTS(way,%20POLYGON((" + queryString + ")))&outputFormat=application%2Fjson",
            success: function(result) {

                prepareData(result);
                // start worker 
                // create special geometry's
                // sort out level geometry'S
                // set level bar
                // special Geometry's: 
                // room: Boden, Wände, Öffnungen für Türen
                // Gebäude: Gebäude unter der aktuell angezeigten Etage visualisieren, also alle building:part teile
                // Treppen: gestückelt, animiert visualisieren? Aushöhlung bei Gebäude layer für Treppenteile
                // Fahrstüle animiert visualisieren?

            }
        });
    }

    var prepareData = function(result) {

        if (window.Worker) {
            if (runningWorkerIndoor) {
                workerIndoor.terminate();
            }
            runningWorkerIndoor = true;
            workerIndoor.postMessage(result); // Start the worker.
        } else {
            console.log("no support for indoor worker");
            //What to do here?          
        };
    }

    var style3D = {
        "name": "Indoor",
        "active": false,
        "extrusion": true,
        "layers": [
            // this layer is almost invisible in rendering but is needed because mapbox.gl doesnt check all layer for level if all layer are set invisible
            {
                "id": "justForRendering",
                "type": "line",
                "source": "indoor_source",
                "source-layer": "line",
                "filter": ["all", ["any", ["==", "railway", "rail"],
                    ["==", "railway", "light_rail"]
                ]],
                "layout": {
                    //  "visibility": "none", <<<< this is the difference to all other layer
                    "line-cap": "square"
                },
                "paint": {
                    "line-color": "#D6D6D6",
                    "line-width": 1
                },
            }, {
                "id": "room",
                "type": "fill",
                "source": "indoor_source",
                "source-layer": "polygon",
                "filter": ["all", ["any", ["any", ["==", "indoor", "room"],
                    ["==", "room", "yes"],
                    ["has", "shop"]
                ]]],
                "layout": {
                    "visibility": "none"
                },
                "paint": {
                    "fill-color": "#D6D6D6"
                }
            }, {
                "id": "corridor",
                "type": "fill",
                "source": "indoor_source",
                "source-layer": "polygon",
                "filter": ["all", ["any", ["==", "room", "corridor"],
                    ["==", "indoor", "corridor"],
                    ["==", "indoor", "area"],
                    ["==", "building_part", "floor"]
                ]],
                "layout": {
                    "visibility": "none"
                },
                "paint": {
                    "fill-color": "white"
                }
            }

            , {
                "id": "room_outline",
                "type": "line",
                "source": "indoor_source",
                "source-layer": "polygon",
                "filter": ["all", ["any", ["any", ["!=", "room", "corridor"],
                    ["!=", "indoor", "corridor"],
                    ["!=", "indoor", "area"],
                    ["!=", "building_part", "floor"]

                ]]],
                "layout": {
                    "visibility": "none"
                },
                "paint": {
                    "line-color": "#7E7760",
                    "line-width": 2

                }
            }
        ]
    }

    return {
        style3D: style3D,
        requestData: requestData
    };

}());



/*
time

var t0 = performance.now();
    
var t1 = performance.now();
console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")

 $.ajax({
            url: "https://sebastiansettgast.com/geoserver/wfs?service=wfs&version=1.0.0&request=getfeature&srsName=EPSG:4326&typename=indoor:planet_osm_polygon&CQL_FILTER=INTERSECTS(way,%20POLYGON((" + queryString + ")))&outputFormat=application%2Fjson",
            success: function(result) {
                console.log(result)
    
                prepareData(result);
                // start worker 
                // create special geometry's
                // sort out level geometry'S
                // set level bar
                // special Geometry's: 
                // room: Boden, Wände, Öffnungen für Türen
                // Gebäude: Gebäude unter der aktuell angezeigten Etage visualisieren, also alle building:part teile
                // Treppen: gestückelt, animiert visualisieren? Aushöhlung bei Gebäude layer für Treppenteile
                // Fahrstüle animiert visualisieren?
                

                var levelist;
                for (var i = 0; i < result.features.length; i++) {

                    if (result.features[i].properties.level.indexOf(";") != -1) {
                        console.log(result.features[i].properties.level);
                        levellist = result.features[i].properties.level.split(";");
                        console.log(levellist);
                    };
                };
            }
        });
*/