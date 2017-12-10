## IndoorMapClient

Web client for the visualization of [OpenStreetMap](https://osm.org) Indoor data. **Work in progress**
For the visualization of Indoor features in OSM two Vector Sources are used. Mapbox and another Vector Source with indoor tiles. The Web view library is [Mapbox GL](https://github.com/mapbox/mapbox-gl-js). These components allow a performant visualization of this data.

Working example [here](https://sebastiansettgast.com/IndoorMapClient/). 

![alt text](./example.png?raw=true "Example")

## Motivation

For the development and growing process of OSM Indoor Data it needs a consumer which is able to interpret the existing data and give an example what can be done with it. It is not new that people map a lot more objects if they can see the result of a map afterwards.
Therefore this web client is an illustration of how to render and visualize OSM Indoor Data. It is a side project with no further goal than showing interested people what can be done with OSM indoor data. 
Another very good visualization of Indoor Data in OSM is [OpenLevelUp!](https://openlevelup.net/)


## Indoor data - Tiles supply

For general map features like streets, rivers and parks common Mapbox vector tiles from Mapbox are used. However, for indoor features a special vector tile source is used. This Source delivers tiles with indoor features like rooms, corridors and many more objects. 
The tile source consists of a PostgreSQL database which is updated once a day(OSM2PostgreSQL) with new OSM data. 
The reliability of OSM tagging schema can be confusing sometimes. Especially because of this the tags are postprocessed before they go into the database.


## Indoor data detection

In OSM is no link between buildings and indoor data. The only way of knowing to which building indoor data belongs to is the geographical position. For the visualization of indoor features to a certain building on this map, a logic is implemented:

1. Query all building-polygons in the screen
2. put together polygons at tile borders
3. Evaluate size of all buildings
4. Evaluate the distance from the center of the screen to all buildings
5. Decide which building is selected by the user in dependency to size and distance
6. Use this selected building to query indoor features
