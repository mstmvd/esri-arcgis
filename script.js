//configuration
const pointLayerUrl = 'https://example.com/features/point';//Url of point layer source
const polylineLayerUrl = 'https://example.com/features/polyline';//Url of polyline layer source
const polygonLayerUrl = 'https://example.com/features/polygon';//Url of polygon layer source
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

require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/GraphicsLayer",
    "esri/layers/FeatureLayer",
    "esri/widgets/Sketch"
], function (Map, MapView, GraphicsLayer, FeatureLayer, Sketch) {
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
    layers.pointLayer = new FeatureLayer();
    fetch(pointLayerUrl).then((features) => {
        layers.pointLayer.source = features
        map.layers.add(layers.pointLayer);
    }).catch(e => {
        console.error('Could not fetch point layer');
        console.error(e);
    });

    layers.polylineLayer = new FeatureLayer();
    fetch(polylineLayerUrl).then((features) => {
        layers.polylineLayer.source = features
        map.layers.add(layers.polylineLayer);
    }).catch(e => {
        console.error('Could not fetch polyline layer');
        console.error(e);
    });

    layers.polygonLayer = new FeatureLayer();
    fetch(polygonLayerUrl).then((features) => {
        layers.polygonLayer.source = features
        map.layers.add(layers.polygonLayer);
    }).catch(e => {
        console.error('Could not fetch polygon layer');
        console.error(e);
    });

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