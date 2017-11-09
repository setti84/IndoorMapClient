// global

var map;
mapboxgl.accessToken = 'pk.eyJ1Ijoic2V0dGkiLCJhIjoiNmUyMDYzMjlmODNmY2VhOGJhZjc4MTIzNDJiMjkyOGMifQ.hdPIqIoI_VJ_RQW1MXJ18A';




// init

var cont = document.createElement("div");
cont.setAttribute("id", "map");
document.body.appendChild(cont);

map = new mapboxgl.Map({
    container: 'map',
    style: './style/background.json',
    center: [13.35230, 52.54407],
    zoom: 17.21,
    hash: true,
});

map.on('load', function() {

   addMapLogic();

});