// global
var map;
mapboxgl.accessToken = 'pk.eyJ1Ijoic2V0dGkiLCJhIjoiNmUyMDYzMjlmODNmY2VhOGJhZjc4MTIzNDJiMjkyOGMifQ.hdPIqIoI_VJ_RQW1MXJ18A';
//var buildingMinSize = 100; // in Square Meter
var workerBuilding = new Worker("script/worker/buildingWorker.js");
var runningWorkerBuilding = false;
var workerIndoor = new Worker("script/worker/indoorWorker.js");
var runningWorkerIndoor = false;
var selectedBuilding = {
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

// init

(function() {

    map = new mapboxgl.Map({
        container: 'map',
        style: backgroundStyle,
        center: [13.35230, 52.54407],
        zoom: 17.21,
        hash: true,
    });
    map.showTileBoundaries = true;



    workerBuilding.addEventListener('message', function(event) {
        buildingWorkerDone(event);
    }, false);

    workerIndoor.onmessage = indoorWorkerDone;

    map.on('load', function() {

        levelbar.create();
        map.on('moveend', addMapLogic);
        map.on('click', function(e) {
            // add popup with details of the map
            debug.popupDetails(e);

        });

    });


    function addMapLogic() {

        var features = building.getData();

        if (features.length == 0) {
            console.log("building undefined")
            return;
        }

        selectedBuilding = building.bestBuilding(features);

    }

    function buildingWorkerDone(event) {

        console.log("BuildingWorkerDone")
        runningWorkerBuilding = false;        
        selectedBuilding = event.data.selectedBuilding;  
        console.log(selectedBuilding);
        //console.log(event.data.buildingParts);
        // debug visualization
        //debug.visualizeBuildings(event.selectedBuilding, event.buildings);
        //debug.addCenterToMap([map.getCenter().lng, map.getCenter().lat]);
        // test if building has changed or if its still the same. In this case no extra work is needed and we can stop here
        if (!event.data.newBuilding) {
            return; };        
        // delete the extrusion for the selected building and all its parts
        map.setFilter('building', event.data.buildingFilter);
        map.getSource('selectedBuilding').setData({
            "type": "FeatureCollection",
            "features": event.data.buildingParts
        });
        building.selectedBuildingparts = event.data.buildingParts;
        console.log(event.data.buildingParts);
        // request indoor data
        indoor.requestData(selectedBuilding);

    }

    function indoorWorkerDone(e) {
        console.log("indoorWorkerDone")
        runningWorkerIndoor = false;
        //console.log(e.data.levelList)
        map.getSource('indoor_polygon').setData({
            "type": "FeatureCollection",
            "features": e.data.polygons
        });
        levelbar.update(e.data.levelList)

    }

})();

console.log(window)

/*
https://sebastiansettgast.com/geoserver/indoor/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=indoor:planet_osm_polygon&srsName=EPSG:4326&bbox=52,13,53,14&outputFormat=application%2Fjson

https://sebastiansettgast.com/geoserver/indoor/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=indoor:planet_osm_polygon&srsName=EPSG:4326&bbox=13.168487548828123,52.4040945640241,13.7164306640625,52.617224016770685&outputFormat=application%2Fjson

https://sebastiansettgast.com/geoserver/wfs?service=wfs&version=1.0.0&request=getfeature&typename=indoor:planet_osm_polygon&PROPERTYNAME=level&CQL_FILTER=level%20LIKE%20%270%27

https://sebastiansettgast.com/geoserver/wfs?service=wfs&version=1.0.0&request=getfeature&typename=indoor:planet_osm_polygon&CQL_FILTER=level%20LIKE%20%270%27&outputFormat=application%2Fjson


https://sebastiansettgast.com/geoserver/wfs?service=wfs&version=1.0.0&request=getfeature&typename=indoor:planet_osm_polygon&srsName=EPSG:4326&CQL_FILTER=INTERSECTS(way, POLYGON((1113194.90793273 6446275.84101716, 1669792.36189910 6446275.84101716, 1669792.36189910 6982997.92038979 , 1113194.90793273 6982997.92038979, 1113194.90793273 6446275.84101716 )))&outputFormat=application%2Fjson

nur beuth haus bauwesen
https://sebastiansettgast.com/geoserver/wfs?service=wfs&version=1.0.0&request=getfeature&srsName=EPSG:4326&typename=indoor:planet_osm_polygon&CQL_FILTER=INTERSECTS(way,%20POLYGON((1486528.81399970 6899138.09629527, 1486842.32524123 6899138.09629527, 1486842.32524123 6899471.91111752, 1486528.81399970 6899471.91111752, 1486528.81399970 6899138.09629527)))&outputFormat=application%2Fjson



*/