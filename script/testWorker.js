self.addEventListener('message', function(e) {

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
                if (workingarray.indexOf(doubleLevel[j]) === -1) {
                    workingarray.push(doubleLevel[j]);
                }
            }
        } else {
            if (workingarray.indexOf(singleLevel) === -1) {
                workingarray.push(singleLevel);
            }

        }
    }

    // this part cleans up the single level strings like "1" or "1;2" or ";1"     
    for (var i = 0; i < end; i++) {
        singleLevel2 = workingarray[i].trim();

        if (/^\-?[0-9]\d{0,2}$/.test(singleLevel2) && cleanlevel.indexOf(singleLevel2) === -1) {
            cleanlevel.push(singleLevel2);
        }
    }
    //return cleanlevel;


    //bring levels in the right order
    cleanlevel.sort(function(a, b) {
        return b - a
    });

    self.postMessage([cleanlevel, rawlevel]);

    close();


}, false);