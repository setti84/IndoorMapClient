self.addEventListener('message', function(e) {
	
	var buildings = e.data;
	//var building = buildings[0].geometry.coordinates;

/*
	tasks
	1.
	
*/

	console.log(buildings[0].geometry)
  self.postMessage(e.data);
}, false);