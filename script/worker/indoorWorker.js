importScripts('./../helper/turf.min.js');

this.onmessage = function(e) {

    var features = e.data.features;

    var indoorobjects;

    //console.log(features);

    indoorobjects = createObjects(features);

    //console.log(indoorobjects);

    this.postMessage(indoorobjects);
};


function createObjects(features) {

    var indoorobjects;
    var levelList = [];
    var polygons = [];
    var points = [];
    var line = [];
    var objectList;
    var feature;

    for (var i = 0; i < features.length; i++) {

        if (features[i].geometry.type === "Polygon") {
            polygons.push(features[i])
        } else if (features[i].geometry.type === "Line") {
            line.push(features[i])
        } else if (features[i].geometry.type === "Point") {
            points.push(features[i])
        };

        if (features[i].properties.level.indexOf(";") !== -1) {
            objectList = features[i].properties.level.split(";");
            for (var j = 0; j < objectList.length; j++) {

                features.push(createNewFeatures(features[i], objectList[j]));

                if (levelList.indexOf(objectList[j]) === -1) {
                    levelList.push(objectList[j]);
                };
            };
        } else {
            if (levelList.indexOf(features[i].properties.level) === -1) {
                levelList.push(features[i].properties.level);
            };
        }
    };
    //bring levels in the right order for levelbar
    levelList.sort(function(a, b) {
        return b - a
    });

    indoorobjects = { levelList: levelList, polygons: polygons, line: line, points: points };
    

    return indoorobjects;
}


function createNewFeatures(featuresItem, listItem) {

    var feature = {
        "type": "Feature",
        "properties": featuresItem.properties,
        "geometry": featuresItem.geometry
    };
    feature.properties.level = listItem;

    return feature;

}