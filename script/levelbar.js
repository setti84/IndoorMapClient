var levelbar = (function() {

    var create = function(urlLevel) {

        // interval for a frequent check if all tiles are loaded yet
         // if all tiles are loaded execute update of levelbar
        var intervalStart = setInterval(function() {

            if (!map.isSourceLoaded("indoor_source")) {
                console.log("indoor source not readdy yet")
                return;
            }

            // create container for level butttons
            var levelcont = document.createElement("div");
            levelcont.setAttribute("id", "levelcont");
            levelcont.classList.add("panel");
            document.getElementById("map").appendChild(levelcont);

            var rawlevel, startlevel;
            var cleanlevel = [];

            //returns all levels which are in the layer
            rawlevel = findalllevel(map);

            // separates levels and clean up like ";1" or "EG" or "1.3"  
            cleanlevel = getindividuallevel(rawlevel);

            //bring levels in the right order
            cleanlevel.sort(function(a, b) {
                return b - a
            });

            //create new div elements which show the levels
            var laenge = cleanlevel.length;
            var button, level;
            for (var i = 0; i < laenge; i++) {
                level = cleanlevel[i];
                button = document.createElement("button");
                button.classList.add("levelbuttons");
                button.setAttribute("id", "level" + cleanlevel[i]);
                button.innerHTML = cleanlevel[i];
                button.addEventListener("click", function(level) {
                    // wrapper function to send the right level to listener
                    return function() {
                        levelclick(level, rawlevel);
                    };
                }(level));
                document.getElementById("levelcont").appendChild(button);
            }

            // add event listener for map change so level-bar gets updated when move
            map.on('moveend', function() {
                update();
            });

            // check if a string is given for the first start otherwise take zero               
            startlevel = checkIfLevelIsAvailable(urlLevel, cleanlevel);

            // set elements for first visualization               
            levelclick(startlevel, rawlevel);

            clearInterval(intervalStart);


        }, 200);

    };

    var update = function() {

        // interval for a frequent check if all tiles are loaded yet        
        var interval = setInterval(function() {

            // if all tiles are loaded execute update of levelbar
            console.log("--------")
            if (!map.isSourceLoaded("indoor_source")) {
                console.log("out of intervall")
                return;
            }
            var rawlevel, cleanlevel;

            rawlevel = findalllevel(map);
            // seperates levels and clean up like ";1" or "EG" or "1.3"  
            cleanlevel = getindividuallevel(rawlevel);

            var selectedLevelbutton;
            // if no old level is available take zero 
            var selectedLevel = 0;

            //save old selected level to add later to levelbar again
            selectedLevelbutton = document.getElementsByClassName("levelbuttonsselected");
            if (selectedLevelbutton.length === 1) {
                selectedLevel = selectedLevelbutton[0].innerHTML;
            }

            // delete old level buttons and hide box shadow         
            var conti = document.getElementById("levelcont");
            while (conti.firstChild) {
                conti.removeChild(conti.firstChild);
            }

            //in case no new levels are available go back
            if (rawlevel.length === 0) {
                clearInterval(interval);
                return;
            }

            //create new div elements which show the levels
            var laenge = cleanlevel.length;
            var button, level;
            var levelbar = document.getElementById("levelcont");
            for (var i = 0; i < laenge; i++) {
                level = cleanlevel[i];
                button = document.createElement("button");
                button.classList.add("levelbuttons");
                button.setAttribute("id", "level" + level);
                button.innerHTML = level;

                button.addEventListener("click", function(level) {
                    // wrapper function to send the right level to listener
                    return function() {
                        levelclick(level, rawlevel);
                    };
                }(level));

                levelbar.appendChild(button);
            }

            // take the old selected level and update map

            levelclick(selectedLevel, rawlevel);
            clearInterval(interval);

        }, 200);

    };

    var levelclick = function(level, rawlevel) {
        var button, oldbutton;
        // set all level for graphics        
        selectLevel(level, rawlevel);
        // remove Styling from old Level
        oldbutton = document.getElementsByClassName("levelbuttonsselected");
        // if statement just for first start where no class "levelbuttonsselected" is set yet
        if (oldbutton.length === 1) {
            oldbutton[0].classList.add("levelbuttons");
            oldbutton[0].classList.remove("levelbuttonsselected");
        }
        // add Styling to new Level Button
        button = document.getElementById("level" + level);
        // check if button is avaiable in case user starts in empty indoor region
        if (button !== null) {
            button.classList.add("levelbuttonsselected");
            button.classList.remove("levelbuttons");
        }


    };

    var findalllevel = function(map) {

        var sourcelayer = ["point", "line", "polygon"],
            rawlevel = [],
            features, i = 0,
            source;

        //loop through all indoor layer to find all level 
        for (i; i < sourcelayer.length; i++) {

            features = map.querySourceFeatures('indoor_source', { sourceLayer: sourcelayer[i], filter: ['has', 'level'] });

            var j = 0;
            // in each indoor layer check each element for the level tag, if the feature from feature.properties doesn't exist in raw-level it will be added there
            for (j; j < features.length; j++) {
                if (rawlevel.indexOf(features[j].properties.level) === -1) {
                    rawlevel.push(features[j].properties.level);
                }
            }
        }
        return rawlevel;
    };

    var getindividuallevel = function(rawlevel) {

        var i = 0,
            workingarray = [],
            singleLevel;

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
        //bring levels in the right order
        workingarray.sort(function(a, b) {
            return b - a
        });
        return workingarray;
    };


    var selectLevel = function(level, rawlevel) {

        var j = 0,
            end = rawlevel.length,
            ele, levelsarray = [],
            info2;
        var info = level.toString();
        console.log(level)
        console.log(rawlevel)
       
        //create helper strings for Regular Expressions  
        if (info > 0) {
            info2 = eval("info - 1");
        } else if (info < -1) {
            info2 = parseInt(info) + 1;
        } else if (info == 0) {
            info2 = "-" + info;
        } else if (info == -1) {
            info2 = "-0";
        }

        var positiveexact = new RegExp('[;\s+]' + info + '[\s;]');
        var endexact = new RegExp('[;]' + info + '$');
        var begexact = new RegExp('^' + info + '[;]');
        var positiveval = new RegExp('[;+\\s]' + info + '\\.[0-5;]');
        var regex1 = new RegExp('^' + info + '\\.[0-5;]');
        var regex2 = new RegExp('[;+\\s]' + info + '\\.[0-5;]$');
        var regex3 = new RegExp('[;+\\s]' + info2 + '\\.[5-9;]');
        var regex4 = new RegExp('^' + info2 + '\\.[5-9;]');
        var regex5 = new RegExp('[;+\\s]' + info2 + '\\.[5-9;]$');
        var zerocase1 = new RegExp('[;+\\s]' + info2 + '\\.[0-5;]');
        var zerocase2 = new RegExp('^' + info2 + '\\.[0-5;]');
        var zerocase3 = new RegExp('[;+\\s]' + info2 + '\\.[0-5;]$');

        for (j; j < end; j++) {
            ele = rawlevel[j];

            if (info === ele || positiveexact.test(ele) || endexact.test(ele) || begexact.test(ele)) {

                levelsarray.push(ele);
                continue;
            } else if (positiveval.test(ele) || regex1.test(ele) || regex2.test(ele)) {

                levelsarray.push(ele);
                continue
            } else if (info !== 0 && (regex3.test(ele) || regex4.test(ele) || regex5.test(ele))) {

                levelsarray.push(ele);
                continue;
            } else if (info === 0 && (zerocase1.test(ele) || zerocase2.test(ele) || zerocase3.test(ele))) {
                levelsarray.push(ele);
                continue;
            }
        }
        console.log(levelsarray)
        for (var i = 0; i < indoorStyle.layers.length; i++) {

            var arra = [];
            arra.push(indoorStyle.layers[i].filter);
            console.log(arra)
            //var filtered = ["all", ["in", "level", ].concat(levelsarray)].concat(arra);
             var filtered = ["all", ["in", "level", ].concat([info])].concat(arra);
            // var filtered = ["all", ["in", "level", ].concat(levelsarray)].concat(arra);
            console.log(filtered.toString())
            map.setFilter(indoorStyle.layers[i].id, filtered);            
            map.setLayoutProperty(indoorStyle.layers[i].id, 'visibility', 'visible');
        }
    };


    var checkIfLevelIsAvailable = function(urlLevel, cleanlevel) {

        if (typeof urlLevel === "undefined" || isNaN(urlLevel)) {
            console.log("unknown level: " + urlLevel);
            return 0;
        }
        for (var i = 0; i < cleanlevel.length; i++) {
            if (cleanlevel[i] === urlLevel) {
                return urlLevel;
            }
        };
        // if level doesnt exist in tiles return zero
        console.log("Level doesnt exist in this area: " + urlLevel);
        return 0;


    }

    var getSelectedLevel = function() {

        return document.getElementsByClassName('levelbuttonsselected')[0].innerHTML;

    }

    return {
        create: create,
        update: update,
        getSelectedLevel: getSelectedLevel
    };

}());