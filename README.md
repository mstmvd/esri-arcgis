#esri-arcgis

##How to run
You can run the project using `http-server`.

First install it using _npm_ by run following command:

`npm install http-server`

Then run with following command:

`http-server -o`

##Configuration
Remember to update following variables in `script.js` file, with proper values:

`pointLayerUrl` The url of an external service to retrieve source of point layer

`polylineLayerUrl` The url of an external service to retrieve source of polyline layer

`polygonLayerUrl` The url of an external service to retrieve source of polygon layer

You can also set the center of map by update `initialCoordinate` variable.