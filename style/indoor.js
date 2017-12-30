var indoor = (function() {

    var requestData = function(selectedBuilding) {
        console.log(selectedBuilding)
       
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


*/