self.addEventListener('message', function(e) {
    var t0 = performance.now();
    console.log("innerhalb worker")

    var features = e.data,
        rawlevel = [];
    var workingarray = [],
        singleLevel;
    var singleLevel2;
    var cleanlevel = [];
    var end = workingarray.length;



    // loop through all elements to find alll available levels
    for (var i = 0; i < features.length; i++) {
        for (var j = 0; j < features[i].length; j++) {
            if (rawlevel.indexOf(features[i][j].properties.level) === -1) {
                rawlevel.push(features[i][j].properties.level);
            }
        }

    };


    for (i; i < rawlevel.length; i++) {
        singleLevel = rawlevel[i].trim();
        if (singleLevel.includes(";")) {
            var doubleLevel = [],
                j = 0;
            doubleLevel = singleLevel.split(";");
            var end = doubleLevel.length;
            for (j; j < end; j++) {
                if (workingarray.indexOf(parseInt(doubleLevel[j])) === -1) {                    
                    workingarray.push(parseInt(doubleLevel[j]));
                }
            }
        } else {
            if (workingarray.indexOf(parseInt(singleLevel)) === -1) {
                workingarray.push(parseInt(singleLevel));
            }

        }
    }
    
    // delete values which occur more than once
    for (var i = 0; i < workingarray.length; i++) {
        singleLevel2 = workingarray[i];
        if(cleanlevel.indexOf(singleLevel2) === -1){
            cleanlevel.push(singleLevel2);
        }        
    };

    //bring levels in the right order
    cleanlevel.sort(function(a, b) {
        return b - a
    });


     console.log(rawlevel)
    console.log(workingarray)
    console.log(cleanlevel)

    self.postMessage([cleanlevel, rawlevel]);

    close();
    var t1 = performance.now();
                console.log("web worker time " + (t1 - t0) + " milliseconds.")


}, false);

