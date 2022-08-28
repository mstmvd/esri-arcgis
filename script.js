//configuration
const initialCoordinate = [-3.6814679, 40.4103599];//The center of map
const initialZoom = 16;//Initial zoom level of map

let view;

const layers = {
    pointLayer: {},
    polylineLayer: {},
    polygonLayer: {},
};

const layerButtons = [
    {text: 'Point Layer', layer: 'pointLayer'},
    {text: 'Polyline Layer', layer: 'polylineLayer'},
    {text: 'Polygon Layer', layer: 'polygonLayer'},
];

//Sample data
const pointsData = [
    {
        id: 1,
        longitude: -3.6814679,
        latitude: 40.4103599
    },
    {
        id: 2,
        longitude: -3.6754979,
        latitude: 40.4094599
    },
    {
        id: 2,
        longitude: -3.6784979,
        latitude: 40.4114599
    }
];
const polylineData = [
    {
        id: 1,
        path: [[-3.6814679, 40.4103599], [-3.6754979, 40.4094599], [-3.6784979, 40.4114599]]
    },
];
const polygonData = [
    {
        id: 1,
        ring: [[-3.6814679, 40.4103599], [-3.6754979, 40.4094599], [-3.6784979, 40.4114599], [-3.6814679, 40.4103599]]
    },
];

require([
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/layers/FeatureLayer",
    "esri/widgets/Sketch",
], function (Map, MapView, Graphic, GraphicsLayer, FeatureLayer, Sketch) {
    const graphicsLayer = new GraphicsLayer();

    const map = new Map({
        basemap: "hybrid",
    });

    view = new MapView({
        container: "viewDiv",
        map: map,
        zoom: initialZoom,
        center: initialCoordinate,
    });
    view.when(() => {
        const sketch = new Sketch({
            layer: graphicsLayer,
            view: view,
            creationMode: "update"
        });
        view.ui.add([{component: sketch, index: 0, position: "top-left"}]);
    });

    layerButtons.forEach(button => {
        const btn = document.createElement('button');
        btn.classList.add('layer-button');
        btn.onclick = () => {
            showLayer(button.layer)
        };
        btn.innerHTML = button.text;
        view.ui.add(btn, 'top-right');
    });

    //Define layers
    layers.pointLayer = new FeatureLayer({
        source: pointsData.map(function (place) {
            return new Graphic({
                attributes: {
                    ObjectId: place.id,
                },
                geometry: {
                    type: "point",
                    longitude: place.longitude,
                    latitude: place.latitude
                },
            });
        }),
        renderer: {
            type: "simple",
            symbol: {
                type: "simple-marker",
                color: "#ff0000",
                outline: {
                    color: "#000000",
                    width: 2
                }
            }
        },
        objectIdField: "ObjectID",
    });
    map.layers.add(layers.pointLayer);
    layers.polylineLayer = new FeatureLayer({
        source: polylineData.map(function (line) {
            return new Graphic({
                attributes: {
                    ObjectId: line.id,
                },
                geometry: {
                    type: "polyline",
                    paths: line.path
                },
            });
        }),
        renderer: {
            type: "simple",
            symbol: {
                type: "simple-line",
                color: [226, 119, 40],
                width: 4
            }
        },
        objectIdField: "ObjectID",
    });
    map.layers.add(layers.polylineLayer);

    layers.polygonLayer = new FeatureLayer({
        source: polygonData.map(function (polygon) {
            return new Graphic({
                attributes: {
                    ObjectId: polygon.id,
                },
                geometry: {
                    type: "polygon",
                    rings: polygon.ring
                }
            });
        }),
        renderer: {
            type: 'simple',
            symbol: {
                type: "simple-fill",
                color: [226, 0, 0, 0.5],
                outline: {
                    color: "rgba(69,0,0,0.5)",
                    width: 2
                }
            }
        },
        objectIdField: "ObjectID",
    });
    map.layers.add(layers.polygonLayer);

    map.layers.addMany([graphicsLayer]);
});

function showLayer(layerName) {
    Object.keys(layers).forEach(layer => {
        layers[layer].visible = layer === layerName;
    });
    layers[layerName]
        .when((layer) => {
            return layer.queryExtent();
        })
        .then((response) => {
            view.goTo(response.extent);
        });
}