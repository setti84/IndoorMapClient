

function addMapLogic(){
	//console.log(map)

	// Background layer and layer for indoor data are separated. So indoor layer need to be added to map.
	for (var i = 0; i < indoorStyle.layers.length; i++) {
		map.addLayer(indoorStyle.layers[i]);
	}

	levelbar.create(0);
}

