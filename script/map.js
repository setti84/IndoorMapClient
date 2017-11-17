function addMapLogic() {


    map.on('moveend', function() {


        var buildings = map.queryRenderedFeatures(map.project(map.getCenter()), { layers: ['building'] });
        if (buildings.length == 0) {
            console.log("building undefined")
            return;
        }


        var building = buildings[0].geometry.coordinates;
        var bbox = turf.bboxPolygon(turf.bbox(turf.polygon(building)));
        var centerCoord = [
            [map.getCenter().lng, map.getCenter().lat],
            [map.getCenter().lng - 0.5, map.getCenter().lat + 0.5],
            [map.getCenter().lng + 0.5, map.getCenter().lat + 0.5],
            [map.getCenter().lng + 0.5, map.getCenter().lat - 0.5],
            [map.getCenter().lng - 0.5, map.getCenter().lat - 0.5]
        ]
        var coords2 = map.getCenter().toBounds(100).toArray();
        

        console.log(building)
        //console.log(centerCoord[0])
        console.log(coords2)

        if (map.getLayer('selectedBuilding') != undefined) {
            map.removeSource('selectedBuilding')
            map.removeLayer('selectedBuilding');
        }

        if (map.getLayer('bbox') != undefined) {
            map.removeSource('bbox')
            map.removeLayer('bbox');
        }

        if (map.getLayer('center') != undefined) {
            map.removeSource('center')
            map.removeLayer('center');
        }

        map.addLayer({
            'id': 'selectedBuilding',
            'type': 'fill',
            'source': {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Polygon',
                        'coordinates': building
                    }
                }
            },
            'layout': {},
            'paint': {
                'fill-color': '#088',
                'fill-opacity': 0.8
            }
        });


        map.addLayer({
            'id': 'bbox',
            'type': 'fill',
            'source': {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Polygon',
                        'coordinates': bbox.geometry.coordinates
                    }
                }
            },
            'layout': {},
            'paint': {
                'fill-color': 'green',
                'fill-opacity': 0.2
            }
        });
        /*
        map.addLayer({
            'id': 'center',
            'type': 'fill',
            'source': {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Polygon',
                        'coordinates': centerCoord
                    }
                }
            },
            'layout': {},
            'paint': {
                'fill-color': 'black',
                'fill-opacity': 0.7
            }
        });
*/
        map.loadImage('https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Cat_silhouette.svg/400px-Cat_silhouette.svg.png', function(error, image) {
            if (error) throw error;
            map.addImage('cat', image);
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
                                "coordinates": centerCoord[0]
                            }
                        }]
                    }
                },
                "layout": {
                    "icon-image": "cat",
                    "icon-size": 0.5
                }
            });
        });

        // body...
    });

    // Background layer and layer for indoor data are separated. So indoor layer need to be added to map.
    /*
    for (var i = 0; i < indoorStyle.layers.length; i++) {
    	map.addLayer(indoorStyle.layers[i]);
    }
    */

    //levelbar.create(0);
}