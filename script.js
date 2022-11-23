//configuration
const initialCoordinate = [-3.6784679, 40.4103599];//The center of map
const initialZoom = 17;//Initial zoom level of map

let view;

const layers = {
    pointLayer: {},
    polylineLayer: {},
    polygonLayer: {},
};

const defaultSymbols = {
    pointLayer: {},
    polylineLayer: {
        type: "simple-line",
        color: 'rgb(252, 182, 0)',
        width: 4
    },
    polygonLayer: {}
}

const layersInfo = {
    pointLayer: {
        renderers: {
            simple: {},
            uniqueValue: {},
            classBreaks: {},
        }
    },
    polylineLayer: {
        renderers: {
            simple: {
                symbol: defaultSymbols.polylineLayer
            },
            uniqueValue: {
                field: "name",
                defaultSymbol: defaultSymbols.polylineLayer,
                uniqueValueInfos: [
                    {
                        value: "line1",
                        symbol: {
                            type: "simple-line",
                            color: 'rgb(33,131,236)',
                            width: 4
                        }
                    },
                    {
                        value: "line2",
                        symbol: {
                            type: "simple-line",
                            color: 'rgb(252, 182, 0)',
                            width: 4
                        }
                    }
                ]
            },
            classBreaks: {
                field: "ObjectID",
                defaultSymbol: defaultSymbols.polylineLayer,
                classBreakInfos: [
                    {
                        minValue: 0,
                        maxValue: 100,
                        symbol: defaultSymbols.polylineLayer
                    }
                ]
            },
        }
    },
    polygonLayer: {
        renderers: {
            simple: {},
            uniqueValue: {},
            classBreaks: {},
        }
    },
}

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
        path: [[-3.6805879, 40.4111599], [-3.6754979, 40.4084599]],
        name: 'line1'
    },
    {
        id: 2,
        path: [[-3.6754979, 40.4084599], [-3.6774979, 40.4114599]],
        name: 'line2'
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
let activeModalTab;
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
    "esri/symbols/support/symbolUtils",
    "esri/renderers/SimpleRenderer",
    "esri/renderers/UniqueValueRenderer",
    "esri/renderers/ClassBreaksRenderer",
    "esri/renderers/support/UniqueValueInfo",
    "esri/renderers/support/ClassBreakInfo"
], function (Map, MapView, Graphic, GraphicsLayer, FeatureLayer, LabelClass, Field, Sketch, symbolUtils, SimpleRenderer, UniqueValueRenderer, ClassBreaksRenderer, UniqueValueInfo, ClassBreakInfo) {
    window.UniqueValueInfo = UniqueValueInfo;
    window.ClassBreakInfo = ClassBreakInfo;
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

    layersInfo.polylineLayer.renderers.simple = new SimpleRenderer(layersInfo.polylineLayer.renderers.simple);
    layersInfo.polylineLayer.renderers.uniqueValue = new UniqueValueRenderer(layersInfo.polylineLayer.renderers.uniqueValue);
    layersInfo.polylineLayer.renderers.classBreaks = new ClassBreaksRenderer(layersInfo.polylineLayer.renderers.classBreaks);

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
        renderer: layersInfo.polylineLayer.renderers.uniqueValue,
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
        symbolUtils.renderPreviewHTML(getLayerSymbol(layers[layerName]), {
            node: document.getElementById(layerName + 'SymbologyIcon'),
            size: {
                width: 24,
                height: 4
            }
        });
    });
});

function getLayerSymbol(layer) {
    let symbol;
    switch (layer.renderer.type) {
        case 'simple':
            symbol = layer.renderer.symbol;
            break
        case 'unique-value':
            symbol = layer.renderer.uniqueValueInfos[0].symbol;
            break;
        case 'class-breaks':
            symbol = layer.renderer.classBreakInfos[0].symbol;
            break;
    }
    return symbol?.clone();
}

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
            for (const key of Object.keys(layersInfo.polylineLayer.renderers)) {
                const rendererType = key.ucFirst();
                const symbolsElement = document.getElementById(`polylineLayer${rendererType}SymbolSetting`);
                let index = 0
                switch (key) {
                    case 'simple':
                        layersInfo.polylineLayer.renderers.simple.symbol.width = document.getElementById(activeTocLayer + rendererType + 'Thickness_0').value;
                        layersInfo.polylineLayer.renderers.simple.symbol.color = document.getElementById(activeTocLayer + rendererType + 'Color_0').value;
                        break;
                    case 'uniqueValue':
                        layersInfo.polylineLayer.renderers.uniqueValue.field = document.getElementById(activeTocLayer + rendererType + 'LayerField').value;
                        layersInfo.polylineLayer.renderers.uniqueValue.uniqueValueInfos = [];
                        for (const symbolSetting of symbolsElement.children) {
                            const i = symbolSetting.id.split('_')[1];
                            layersInfo.polylineLayer.renderers.uniqueValue.uniqueValueInfos[index++] = new UniqueValueInfo({
                                value: document.getElementById(activeTocLayer + rendererType + 'FieldValue_' + i).value,
                                symbol: {
                                    type: 'simple-line',
                                    width: document.getElementById(activeTocLayer + rendererType + 'Thickness_' + i).value,
                                    color: document.getElementById(activeTocLayer + rendererType + 'Color_' + i).value,
                                }
                            });
                        }
                        break;
                    case 'classBreaks':
                        layersInfo.polylineLayer.renderers.classBreaks.field = document.getElementById(activeTocLayer + rendererType + 'LayerField').value;
                        layersInfo.polylineLayer.renderers.classBreaks.classBreakInfos = [];
                        for (const symbolSetting of symbolsElement.children) {
                            const i = symbolSetting.id.split('_')[1];
                            layersInfo.polylineLayer.renderers.classBreaks.classBreakInfos[i] = new ClassBreakInfo({
                                minValue: document.getElementById(activeTocLayer + rendererType + 'FieldMinValue_' + i).value,
                                maxValue: document.getElementById(activeTocLayer + rendererType + 'FieldMaxValue_' + i).value,
                                symbol: {
                                    type: 'simple-line',
                                    width: document.getElementById(activeTocLayer + rendererType + 'Thickness_' + i).value,
                                    color: document.getElementById(activeTocLayer + rendererType + 'Color_' + i).value,
                                }
                            });
                        }
                        break;
                }
            }
            layers.polylineLayer.renderer = layersInfo.polylineLayer.renderers[activeModalTab];
            break;
        case 'polygonLayer':
            layers.polygonLayer.renderer.symbol.color = document.getElementById('polygonBackgroundColor').value;
            layers.polygonLayer.renderer.symbol.outline.color = document.getElementById('polygonBorderColor').value;
            break;
    }
    document.getElementById(layerName + 'SymbologyIcon').innerHTML = ''
    globalSymbolUtils.renderPreviewHTML(getLayerSymbol(layers[layerName]), {
        node: document.getElementById(layerName + 'SymbologyIcon'),
        size: {
            width: 24,
            height: 4
        }
    });
    activeModalTab = undefined;
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
    for (const key of Object.keys(layersInfo.polylineLayer.renderers)) {
        const renderer = layersInfo.polylineLayer.renderers[key];
        const rendererType = key.ucFirst();
        const symbolSetting = document.getElementById('polylineLayer' + rendererType + 'SymbolSetting');
        switch (renderer.type) {
            case "simple":
                symbolSetting.innerHTML = createPolylineLayerSymbolFields(0, rendererType);
                document.getElementById(activeTocLayer + rendererType + 'Thickness_0').value = renderer.symbol.width;
                document.getElementById(activeTocLayer + rendererType + 'Color_0').value = renderer.symbol.color.toHex();
                break;
            case "unique-value":
                symbolSetting.innerHTML = '';
                if (!document.getElementById(activeTocLayer + rendererType + 'LayerField')) {
                    symbolSetting.parentElement.prepend(document.createElement('hr'));
                    symbolSetting.parentElement.prepend(createLayerFieldsSelect(layers.polylineLayer, activeTocLayer + rendererType + 'LayerField'));
                }
                document.getElementById(activeTocLayer + rendererType + 'LayerField').value = renderer.field;
                for (let i = 0; i < renderer.uniqueValueInfos.length; i++) {
                    symbolSetting.insertAdjacentHTML('beforeend', createPolylineLayerUniqueValueRendererSymbolSetting(i));
                    document.getElementById(activeTocLayer + rendererType + 'FieldValue_' + i).value = renderer.uniqueValueInfos[i].value;
                    document.getElementById(activeTocLayer + rendererType + 'Thickness_' + i).value = renderer.uniqueValueInfos[i].symbol.width;
                    document.getElementById(activeTocLayer + rendererType + 'Color_' + i).value = renderer.uniqueValueInfos[i].symbol.color.toHex();
                }
                break;
            case "class-breaks":
                symbolSetting.innerHTML = '';
                if (!document.getElementById(activeTocLayer + rendererType + 'LayerField')) {
                    symbolSetting.parentElement.prepend(document.createElement('hr'));
                    symbolSetting.parentElement.prepend(createLayerFieldsSelect(layers.polylineLayer, activeTocLayer + rendererType + 'LayerField'));
                }
                document.getElementById(activeTocLayer + rendererType + 'LayerField').value = renderer.field;
                for (let i = 0; i < renderer.classBreakInfos.length; i++) {
                    symbolSetting.insertAdjacentHTML('beforeend', createPolylineLayerClassBreaksRendererSymbolSetting(i));
                    document.getElementById(activeTocLayer + rendererType + 'FieldMinValue_' + i).value = renderer.classBreakInfos[i].minValue;
                    document.getElementById(activeTocLayer + rendererType + 'FieldMaxValue_' + i).value = renderer.classBreakInfos[i].maxValue;
                    document.getElementById(activeTocLayer + rendererType + 'Thickness_' + i).value = renderer.classBreakInfos[i].symbol.width;
                    document.getElementById(activeTocLayer + rendererType + 'Color_' + i).value = renderer.classBreakInfos[i].symbol.color.toHex();
                }
                break;
        }
    }
    openTab(layers.polylineLayer.renderer.type.toPascalCase().lcFirst());
}

function initPolygonLayerModal() {
    document.getElementById('polygonBackgroundColor').value = layers.polygonLayer.renderer.symbol.color.toHex();
    document.getElementById('polygonBorderColor').value = layers.polygonLayer.renderer.symbol.outline.color.toHex();
}

function createPolylineLayerUniqueValueRendererFieldValue(index) {
    return `<div class="form-field"><label>Value: <input type="text" id="polylineLayerUniqueValueFieldValue_${index}"></label></div>`;
}

function createPolylineLayerClassBreaksRendererFieldValue(index) {
    return `
<div class="form-field"><label>Min Value: <input type="text" id="polylineLayerClassBreaksFieldMinValue_${index}"></label></div>
<div class="form-field"><label>Max Value: <input type="text" id="polylineLayerClassBreaksFieldMaxValue_${index}"></label></div>
`;
}

function createPolylineLayerSymbolFields(index, rendererType) {
    return `
    <div class="form-field"><label>Line thickness: <input type="number" id="polylineLayer${rendererType}Thickness_${index}"> px</label></div>
    <div class="form-field"><label>Line color: <input type="color" id="polylineLayer${rendererType}Color_${index}"></label></div>
`;
}

function createDeleteSymbolSettingButton() {
    return `<button class="delete-symbol-setting" onclick="this.parentElement.remove()">Delete</button>`;
}

function createPolylineLayerUniqueValueRendererSymbolSetting(index) {
    const fieldValue = createPolylineLayerUniqueValueRendererFieldValue(index);
    const symbolFields = createPolylineLayerSymbolFields(index, 'UniqueValue');
    const deleteSymbolSettingButton = createDeleteSymbolSettingButton();
    return `<div class="symbol-setting" id="polylineLayerUniqueValueSymbolSetting_${index}">${fieldValue}${symbolFields}${deleteSymbolSettingButton}</div>`
}

function createPolylineLayerClassBreaksRendererSymbolSetting(index) {
    const fieldValue = createPolylineLayerClassBreaksRendererFieldValue(index);
    const symbolFields = createPolylineLayerSymbolFields(index, 'ClassBreaks');
    const deleteSymbolSettingButton = createDeleteSymbolSettingButton();
    return `<div class="symbol-setting" id="polylineLayerUniqueValueSymbolSetting_${index}">${fieldValue}${symbolFields}${deleteSymbolSettingButton}`
}

function addUniqueValueSymbol(symbolSettingId) {
    const symbolSetting = document.getElementById(symbolSettingId);
    const index = symbolSetting.children.length;
    symbolSetting.insertAdjacentHTML('beforeend', createPolylineLayerUniqueValueRendererSymbolSetting(index));
}

function addClassBreaksSymbol(symbolSettingId) {
    const symbolSetting = document.getElementById(symbolSettingId);
    const index = symbolSetting.children.length;
    symbolSetting.insertAdjacentHTML('beforeend', createPolylineLayerClassBreaksRendererSymbolSetting(index));
}

function createLayerFieldsSelect(layer, id) {
    const fields = layers[activeTocLayer].fields;
    const formField = document.createElement('div');
    formField.classList.add('form-field');
    const label = document.createElement('label');
    label.innerHTML = 'Field: ';
    const fieldSelect = document.createElement('select');
    fieldSelect.id = id;
    fields.forEach((field) => {
        const option = document.createElement('option');
        option.value = field.name;
        option.innerHTML = field.name;
        fieldSelect.append(option);
    });
    label.append(fieldSelect);
    formField.append(label);
    return formField;
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
    value: function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
});

Object.defineProperty(String.prototype, 'lcFirst', {
    value: function () {
        return this.charAt(0).toLowerCase() + this.slice(1);
    },
    enumerable: false
});

Object.defineProperty(String.prototype, 'toPascalCase', {
    value: function () {
        return this.replace(/\w+/g, function (w) {
            return w[0].toUpperCase() + w.slice(1).toLowerCase();
        }).replace(/-/, "");
    },
    enumerable: false
});

function openTab(tab) {
    activeModalTab = tab.lcFirst();
    const modal = document.getElementById(activeTocLayer + 'SymbologyModal');
    for (let el of modal.getElementsByClassName('renderer-setting')) {
        el.classList.add('hidden');
    }
    for (let el of modal.getElementsByClassName('tab-button')) {
        el.classList.remove('tab-button-active');
    }
    const button = document.getElementById(activeTocLayer + 'ButtonOpenTab' + tab.ucFirst())
    button.classList.add('tab-button-active');
    document.getElementById(activeTocLayer + tab.ucFirst() + 'RendererSetting').classList.remove('hidden');
}