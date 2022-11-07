//configuration
const initialCoordinate = [-3.6784679, 40.4103599];//The center of map
const initialZoom = 17;//Initial zoom level of map

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
        longitude: -3.6804679,
        latitude: 40.4103000,
        name: 'First point'
    },
    {
        id: 2,
        longitude: -3.6764979,
        latitude: 40.4096999,
        name: 'Second point'
    },
    {
        id: 2,
        longitude: -3.6784979,
        latitude: 40.4108599,
        name: 'Third point'
    }
];
const polylineData = [
    {
        id: 1,
        path: [[-3.6805879, 40.4111599], [-3.6754979, 40.4084599], [-3.6774979, 40.4114599]],
        name: 'Polyline'
    },
];
const polygonData = [
    {
        id: 1,
        ring: [[-3.6814679, 40.4103599], [-3.6754979, 40.4094599], [-3.6784979, 40.4114599], [-3.6814679, 40.4103599]],
        name: 'Polygon'
    },
];
let pointIcon = "\ue61d";
let map;
let sketchLayer;

const labelPlacement = {
    pointLayer: ['above-center', 'above-left', 'above-right', 'below-center', 'below-left', 'below-right', 'center-center', 'center-left', 'center-right'],
    // polyline: ['above-after', 'above-along', 'above-before', 'above-start', 'above-end', 'below-after', 'below-along', 'below-before', 'below-start', 'below-end', 'center-after', 'center-along', 'center-before', 'center-start', 'center-end'],
    polylineLayer: ['center-along'],
    polygonLayer: ['always-horizontal'],
}

let activeTocLayer;
let globalSymbolUtils;

require([
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/layers/FeatureLayer",
    "esri/layers/support/LabelClass",
    "esri/layers/support/Field",
    "esri/widgets/Sketch",
    "esri/symbols/support/symbolUtils"
], function (Map, MapView, Graphic, GraphicsLayer, FeatureLayer, LabelClass, Field, Sketch, symbolUtils) {
    globalSymbolUtils = symbolUtils;
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
                    name: place.name,
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
        fields: [
            {
                name: "ObjectID",
                alias: "ObjectID",
                type: "oid"
            }, {
                name: "name",
                alias: "name",
                type: "string"
            },
        ],
        labelingInfo: [{  // autocasts as new LabelClass()
            symbol: {
                type: "text",  // autocasts as new TextSymbol()
                color: "black",
                font: {  // autocast as new Font()
                    size: 12,
                    weight: "normal"
                }
            },
            labelPlacement: "below-center",
            labelExpressionInfo: {
                expression: "$feature.name"
            },
        }],
        objectIdField: "ObjectID",
    });
    layers.polylineLayer = new FeatureLayer({
        source: polylineData.map(function (line) {
            return new Graphic({
                attributes: {
                    ObjectId: line.id,
                    name: line.name,
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
        fields: [
            {
                name: "ObjectID",
                alias: "ObjectID",
                type: "oid"
            }, {
                name: "name",
                alias: "name",
                type: "string"
            },
        ],
        labelingInfo: [{  // autocasts as new LabelClass()
            symbol: {
                type: "text",  // autocasts as new TextSymbol()
                color: "black",
                font: {  // autocast as new Font()
                    size: 12,
                    weight: "normal"
                }
            },
            labelPlacement: "center-along",
            labelExpressionInfo: {
                expression: "$feature.name"
            },
        }],
        objectIdField: "ObjectID",
    });

    layers.polygonLayer = new FeatureLayer({
        source: polygonData.map(function (polygon) {
            return new Graphic({
                attributes: {
                    ObjectId: polygon.id,
                    name: polygon.name,
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
        fields: [
            {
                name: "ObjectID",
                alias: "ObjectID",
                type: "oid"
            }, {
                name: "name",
                alias: "name",
                type: "string"
            },
        ],
        labelingInfo: [{  // autocasts as new LabelClass()
            symbol: {
                type: "text",  // autocasts as new TextSymbol()
                color: "black",
                font: {  // autocast as new Font()
                    size: 12,
                    weight: "normal"
                }
            },
            labelPlacement: "always-horizontal",
            labelExpressionInfo: {
                expression: "$feature.name"
            },
        }],
        objectIdField: "ObjectID",
    });

    map.layers.addMany([layers.polygonLayer, layers.polylineLayer, layers.pointLayer, sketchLayer]);

    Object.keys(layers).forEach((layerName) => {
        symbolUtils.renderPreviewHTML(layers[layerName].renderer.symbol.clone(), {
            node: document.getElementById(layerName + 'SymbologyIcon'),
            size: {
                width: 24,
                height: 4
            }
        });
    });
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

function toggleLayer(layerName) {
    layers[layerName].visible = !layers[layerName].visible;
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

function saveSymbology(layerName) {
    switch (layerName) {
        case 'pointLayer':
            layers.pointLayer.renderer.symbol.font.size = document.getElementById('pointSize').value;
            layers.pointLayer.renderer.symbol.text = pointIcon;
            break;
        case 'polylineLayer':
            layers.polylineLayer.renderer.symbol.width = document.getElementById('polylineThickness').value;
            layers.polylineLayer.renderer.symbol.color = document.getElementById('polylineColor').value;
            break;
        case 'polygonLayer':
            layers.polygonLayer.renderer.symbol.color = document.getElementById('polygonBackgroundColor').value;
            layers.polygonLayer.renderer.symbol.outline.color = document.getElementById('polygonBorderColor').value;
            break;
    }
    document.getElementById(layerName + 'SymbologyIcon').innerHTML = ''
    globalSymbolUtils.renderPreviewHTML(layers[layerName].renderer.symbol.clone(), {
        node: document.getElementById(layerName + 'SymbologyIcon'),
        size: {
            width: 24,
            height: 4
        }
    });
    closeModal(layerName + 'SymbologyModal');
}

function setIcon(element) {
    pointIcon = String.fromCharCode(parseInt(element.dataset.code.replace('\\u', ''), 16));
    document.getElementsByClassName('active-icon')[0]?.classList?.remove('active-icon');
    element.classList.add('active-icon');
}

function initPointLayerModal() {
    document.getElementById('pointSize').value = layers.pointLayer.renderer.symbol.font.size;
    document.getElementsByClassName('active-icon')[0]?.classList?.remove('active-icon');
    document.querySelector('[data-code$=' + pointIcon.charCodeAt(0).toString(16) + ']')?.classList.add('active-icon');
}

function initPolylineLayerModal() {
    document.getElementById('polylineThickness').value = layers.polylineLayer.renderer.symbol.width;
    document.getElementById('polylineColor').value = layers.polylineLayer.renderer.symbol.color.toHex();
}

function initPolygonLayerModal() {
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

function showLayerOptionsMenu(event, layer) {
    event.preventDefault();
    activeTocLayer = layer;
    const menuContainer = document.getElementById('layerOptionMenuContainer');
    menuContainer.style.display = 'block';
    const menu = document.getElementById('layerOptionMenu');
    menu.style.top = event.clientY + 'px';
    menu.style.left = event.clientX + 'px';
}

function dismissMenu() {
    const menuContainer = document.getElementById('layerOptionMenuContainer');
    menuContainer.style.display = 'none';
}

function saveLayerLabel() {
    layers[activeTocLayer].labelingInfo[0].labelExpression = document.getElementById('layerLabelFreeText').value;
    layers[activeTocLayer].labelingInfo[0].symbol.color = document.getElementById('layerLabelTextColor').value;
    layers[activeTocLayer].labelingInfo[0].symbol.font.size = document.getElementById('layerLabelTextSize').value;
    layers[activeTocLayer].labelingInfo[0].symbol.font.weight = document.getElementById('layerLabelTextStyle').value;
    layers[activeTocLayer].labelingInfo[0].labelPlacement = document.getElementById('layerLabelRelativeLocation').value;
    const field = document.getElementById('layerLabelField').value;
    if (field) {
        layers[activeTocLayer].labelingInfo[0]['labelExpressionInfo']['expression'] = field;
    } else {
        layers[activeTocLayer].labelingInfo[0].labelExpressionInfo.expression = "return " + "\"" + document.getElementById('layerLabelFreeText').value + "\"";
    }
    closeModal('layerLabelModal');
}

function openLayerOptionModal() {
    const labelInfo = layers[activeTocLayer].labelingInfo[0];
    const fields = layers[activeTocLayer].fields;

    document.getElementById('layerLabelFreeText').value = labelInfo.labelExpression;
    document.getElementById('layerLabelTextColor').value = labelInfo.symbol.color.toHex();
    document.getElementById('layerLabelTextSize').value = labelInfo.symbol.font.size;
    document.getElementById('layerLabelTextStyle').value = labelInfo.symbol.font.weight;
    const relativeLocationSelect = document.getElementById('layerLabelRelativeLocation');
    relativeLocationSelect.innerHTML = '';
    labelPlacement[activeTocLayer].forEach((placement) => {
        const option = document.createElement('option');
        option.value = placement;
        option.innerHTML = placement;
        relativeLocationSelect.append(option);
    });
    relativeLocationSelect.value = labelInfo.labelPlacement;
    const fieldSelect = document.getElementById('layerLabelField');
    fieldSelect.innerHTML = '<option value="">Use free text</option>'
    fields.forEach((field) => {
        const option = document.createElement('option');
        option.value = '$feature.' + field.name;
        option.innerHTML = field.name;
        fieldSelect.append(option);
    });
    fieldSelect.value = labelInfo.labelExpressionInfo?.expression.startsWith('return ') ? '' : labelInfo.labelExpressionInfo?.expression;
    openModal('layerLabelModal');
}

function openLayerEditModal() {
    window['init' + activeTocLayer.ucFirst() + 'Modal']();
    openModal(activeTocLayer + 'SymbologyModal');
}

Object.defineProperty(String.prototype, 'ucFirst', {
    value: function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
});