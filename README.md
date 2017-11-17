## IndoorMapClient

Web client for the visualization of [OpenStreetMap](https://osm.org) Indoor data based on [Mapbox-GL](https://github.com/mapbox/mapbox-gl-js).

Working example [here](https://sebastiansettgast.com/IndoorMapClient/). 

![alt text](./example.png?raw=true "Example")

## Motivation

For the development of OSM Indoor Data it needs a consumer which is able to interpret the existing data and give an example what can be done with it.
Therefore this web client is an illustration of how to render and visualize OSM Indoor Data. It is a side project with no further goal  than showing interested people what can be done with indoor data. 

## Installation

Just download this repository and open index.html. It should work out of the box.

## Tiles supply

For general map features like streets, rivers and parks common Mapbox vector tiles are used. However, for indoor features a special vector tile source is used. This Source delivers tiles with indoor features like rooms, corridors,... 

## Building detection

All indoor features are loaded for a single building. In OpenStreetMap is usually no identification which indoor features belong to a building. To solve that problem...


