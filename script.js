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
let pointIcon = "\ue61d";
let map;
let sketchLayer;

require([
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/layers/FeatureLayer",
    "esri/widgets/Sketch",
], function (Map, MapView, Graphic, GraphicsLayer, FeatureLayer, Sketch) {
    sketchLayer = new GraphicsLayer();

    map = new Map({
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
            layer: sketchLayer,
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

    view.ui.add(document.getElementById('toc'), 'bottom-left');

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
                type: "text",
                text: "\ue61d",
                font: {
                    size: 24,
                    family: "CalciteWebCoreIcons",
                }
            }
        },
        objectIdField: "ObjectID",
    });
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
                color: 'rgb(252, 182, 0)',
                width: 4
            }
        },
        objectIdField: "ObjectID",
    });

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
                color: "rgb(226, 0, 0)",
                outline: {
                    color: "rgb(69,0,0)",
                    width: 2
                }
            }
        },
        objectIdField: "ObjectID",
    });

    map.layers.addMany([layers.polygonLayer, layers.polylineLayer, layers.pointLayer, sketchLayer]);
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

function toggleTOC(element) {
    element.parentElement.querySelector(".nested").classList.toggle("active");
    element.classList.toggle("caret-down");
}

function openModal(id) {
    document.getElementById(id).style.display = "flex";
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target.role === 'dialog') {
        event.target.style.display = "none";
    }
}

window.onload = function (event) {
    document.getElementById('pointSymbologyIcon').innerText = pointIcon;
};

function savePointSymbology() {
    layers.pointLayer.renderer.symbol.font.size = document.getElementById('pointSize').value;
    layers.pointLayer.renderer.symbol.text = pointIcon;
    document.getElementById('pointSymbologyIcon').innerText = pointIcon;
    closeModal('pointLayerSymbologyModal');
}

function savePolylineSymbology() {
    const thickness = document.getElementById('polylineThickness').value;
    const color = document.getElementById('polylineColor').value;
    layers.polylineLayer.renderer.symbol.width = thickness;
    layers.polylineLayer.renderer.symbol.color = color;
    const icon = document.getElementById('polylineSymbologyIcon');
    icon.style.borderColor = color;
    icon.style.borderWidth = thickness + 'px';
    closeModal('polylineLayerSymbologyModal');
}

function savePolygonSymbology() {
    const backgroundColor = document.getElementById('polygonBackgroundColor').value;
    const borderColor = document.getElementById('polygonBorderColor').value;
    layers.polygonLayer.renderer.symbol.color = backgroundColor;
    layers.polygonLayer.renderer.symbol.outline.color = borderColor;
    const icon = document.getElementById('polygonSymbologyIcon');
    icon.style.backgroundColor = backgroundColor;
    icon.style.borderColor = borderColor;
    closeModal('polygonLayerSymbologyModal');
}

function setIcon(element) {
    pointIcon = String.fromCharCode(parseInt(element.dataset.code.replace('\\u', ''), 16));
    document.getElementsByClassName('active-icon')[0]?.classList?.remove('active-icon');
    element.classList.add('active-icon');
}

function initPointModal() {
    document.getElementById('pointSize').value = layers.pointLayer.renderer.symbol.font.size;
    document.getElementsByClassName('active-icon')[0]?.classList?.remove('active-icon');
    document.querySelector('[data-code$=' + pointIcon.charCodeAt(0).toString(16) + ']')?.classList.add('active-icon');
}

function initPolylineModal() {
    document.getElementById('polylineThickness').value = layers.polylineLayer.renderer.symbol.width;
    document.getElementById('polylineColor').value = layers.polylineLayer.renderer.symbol.color.toHex();
}

function initPolygonModal() {
    document.getElementById('polygonBackgroundColor').value = layers.polygonLayer.renderer.symbol.color.toHex();
    document.getElementById('polygonBorderColor').value = layers.polygonLayer.renderer.symbol.outline.color.toHex();
}

function dragStart(element, event) {
    event.dataTransfer.setData('id', element.id);
}

function dragEnter(element, event) {
}

function dragLeave(element, event) {
}

function dragOver(element, event) {
    event.preventDefault();
}

function dropped(element, event) {
    element.classList.remove('active');
    const sourceId = event.dataTransfer.getData('id');
    if (element.id === sourceId) {
        return;
    }
    const sourceElement = document.getElementById(sourceId);
    const siblings = Array.from(element.parentElement.children);
    const sourceIndex = siblings.indexOf(sourceElement);
    const targetIndex = siblings.indexOf(element);
    if (targetIndex === siblings.length - 1) {
        element.parentElement.append(sourceElement);
    } else if (sourceIndex > targetIndex) {
        element.parentElement.insertBefore(sourceElement, element);
    } else if (sourceIndex < targetIndex) {
        element.parentNode.insertBefore(sourceElement, element.nextSibling);
    }
    updateLayersOrder();
}

function updateLayersOrder() {
    const siblings = Array.from(document.getElementById('layers').children);
    map.reorder(layers.pointLayer, siblings.length - 1 - siblings.indexOf(document.getElementById('pointLayer')));
    map.reorder(layers.polylineLayer, siblings.length - 1 - siblings.indexOf(document.getElementById('polylineLayer')));
    map.reorder(layers.polygonLayer, siblings.length - 1 - siblings.indexOf(document.getElementById('polygonLayer')));
}