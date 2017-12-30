var levelbar = (function() {

    var create = function() {

        // create container for level butttons
        var levelcont = document.createElement("div");
        levelcont.setAttribute("id", "levelcont");
        levelcont.classList.add("panel");
        document.getElementById("map").appendChild(levelcont);

        /*

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

        */




    };

    var update = function(levelList) {

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
        if (levelList.length === 0) {
            return;
        }

        //create new div elements which show the levels        
        var button, level;
        var levelbar = document.getElementById("levelcont");
        for (var i = 0; i < levelList.length; i++) {
            level = levelList[i];
            button = document.createElement("button");
            button.classList.add("levelbuttons");
            button.setAttribute("id", "level" + level);
            button.innerHTML = level;

            button.addEventListener("click", function(level) {
                // wrapper function to send the right level to listener
                return function() {
                    levelclick(level, levelList);
                };
            }(level));

            levelbar.appendChild(button);
        }

        // take the old selected level and update map
        levelclick(selectedLevel, levelList);

    };

    var levelclick = function(level, levelList) {

        var button, oldbutton;
        // set all level for graphics        
        selectLevel(level, levelList);
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

    var selectLevel = function(level, levelList) {
        var levelheight = 3;
        console.log(level)
        
        // this expression takes the min value from either level calculation(level*3) or the height of buildingpart
        // in case no height value is given the height is calculated from level*3
        // remember in selectedBuilding are all buildingparts not only the building itself   
        // more info about expression https://bl.ocks.org/anandthakker/raw/92449fb29285981d266b373c715bdc2b/#7
        map.setPaintProperty('selectedBuilding', 'fill-extrusion-height', ['case', ["has", "height"],
            ["number", ["min", ['*', parseInt(level), parseInt(levelheight)],
                ["number", ["get", "height"]]
            ]],
            ['*', parseInt(level), parseInt(levelheight)]
        ]);

       
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

/*


[           "interpolate", ["linear"], ["zoom"], 15, 0, 15.05, ["get", "height"]                ]


*/