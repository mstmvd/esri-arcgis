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
    pointLayer: {
        type: "text",
        text: "\ue61d",
        font: {
            size: 24,
            family: "CalciteWebCoreIcons",
        }
    },
    polylineLayer: {
        type: "simple-line",
        color: 'rgb(252, 182, 0)',
        width: 4
    },
    polygonLayer: {
        type: "simple-fill",
        color: "rgb(226, 0, 0)",
        outline: {
            color: "rgb(69, 0, 0)",
            width: 2
        }
    }
}

const layersInfo = {
    pointLayer: {
        renderers: {
            simple: {
                symbol: defaultSymbols.pointLayer
            },
            uniqueValue: {
                field: "name",
                defaultSymbol: defaultSymbols.pointLayer,
                uniqueValueInfos: [
                    {
                        value: "point1",
                        symbol: {
                            type: "text",
                            text: "\ue61d",
                            font: {
                                size: 24,
                                family: "CalciteWebCoreIcons",
                            }
                        }
                    },
                    {
                        value: "point2",
                        symbol: {
                            type: "text",
                            text: "\ue608",
                            font: {
                                size: 16,
                                family: "CalciteWebCoreIcons",
                            }
                        }
                    }
                ]
            },
            classBreaks: {
                field: "ObjectID",
                defaultSymbol: defaultSymbols.pointLayer,
                classBreakInfos: [
                    {
                        minValue: 0,
                        maxValue: 100,
                        symbol: defaultSymbols.pointLayer
                    }
                ]
            },
            heatmap: {
                // field: "ObjectID",
                colorStops: [
                    {ratio: 0, color: "rgba(255, 255, 255, 0)"},
                    {ratio: 0.5, color: "rgba(255, 140, 0, 1)"},
                    {ratio: 1, color: "rgba(255, 0, 0, 1)"}
                ],
                maxDensity: 0.005,
                minDensity: 0,
                radius: 15
            }
        },
        initialDefinitionExpression: '',
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
        },
        initialDefinitionExpression: '',
    },
    polygonLayer: {
        renderers: {
            simple: {
                symbol: defaultSymbols.polygonLayer
            },
            uniqueValue: {
                field: "name",
                defaultSymbol: defaultSymbols.polygonLayer,
                uniqueValueInfos: [
                    {
                        value: "shape1",
                        symbol: {
                            type: "simple-fill",
                            color: "rgb(166,0,226)",
                            outline: {
                                color: "rgb(25,1,62)",
                                width: 2
                            }
                        }
                    },
                    {
                        value: "shape2",
                        symbol: {
                            type: "simple-fill",
                            color: "rgb(94,226,0)",
                            outline: {
                                color: "rgb(20,57,1)",
                                width: 2
                            }
                        }
                    }
                ]
            },
            classBreaks: {
                field: "ObjectID",
                defaultSymbol: defaultSymbols.polygonLayer,
                classBreakInfos: [
                    {
                        minValue: 0,
                        maxValue: 100,
                        symbol: defaultSymbols.polygonLayer
                    }
                ]
            },
        },
        initialDefinitionExpression: '',
    },
}

//Sample data
const pointsData = [
    {
        id: 1,
        longitude: -3.6804679,
        latitude: 40.4103000,
        name: 'point1',
        time: new Date(2001, 1, 1).getTime()
    },
    {
        id: 2,
        longitude: -3.6774979,
        latitude: 40.4099999,
        name: 'point2',
        time: new Date(2002, 1, 1).getTime()
    },
    {
        id: 3,
        longitude: -3.6784979,
        latitude: 40.4108599,
        name: 'point3',
        time: new Date(2003, 1, 1).getTime()
    }
];
const polylineData = [
    {
        id: 1,
        path: [[-3.6805879, 40.4111599], [-3.6754979, 40.4084599]],
        name: 'line1',
        time: new Date(2004, 1, 1).getTime()
    },
    {
        id: 2,
        path: [[-3.6754979, 40.4084599], [-3.6774979, 40.4114599]],
        name: 'line2',
        time: new Date(2005, 1, 1).getTime()
    },
];
const polygonData = [
    {
        id: 1,
        ring: [[-3.6814679, 40.4103599], [-3.6754979, 40.4094599], [-3.6784979, 40.4114599], [-3.6814679, 40.4103599]],
        name: 'shape1',
        time: new Date(2006, 1, 1).getTime(),
    },
    {
        id: 2,
        ring: [[-3.6834679, 40.4113599], [-3.6814979, 40.4104599], [-3.6804979, 40.4124599], [-3.6834679, 40.4113599]],
        name: 'shape2',
        time: new Date(2007, 1, 1).getTime(),
    },
];
let map;
let sketchLayer;

const labelPlacement = {
    pointLayer: ['above-center', 'above-left', 'above-right', 'below-center', 'below-left', 'below-right', 'center-center', 'center-left', 'center-right'],
    polylineLayer: ['center-along'],
    polygonLayer: ['always-horizontal'],
}

let activeTocLayer;
let activeModalTab;
let globalSymbolUtils;
let activeIconInput;
let timeSlider;
let timeSliderLayers = [];
let timeSliderCheckedLayers = [];
const timeSliderPlayRates = [
    {title: 'Slow', playRate: 1000},
    {title: 'Normal', playRate: 500},
    {title: 'Fast', playRate: 100},
]
let timeSliderPlayRateIndex = 1;

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
    "esri/renderers/HeatmapRenderer",
    "esri/renderers/support/UniqueValueInfo",
    "esri/renderers/support/ClassBreakInfo",
    "esri/renderers/support/HeatmapColorStop",
    "esri/widgets/TimeSlider"
], function (Map, MapView, Graphic, GraphicsLayer, FeatureLayer, LabelClass, Field, Sketch, symbolUtils, SimpleRenderer, UniqueValueRenderer, ClassBreaksRenderer, HeatmapRenderer, UniqueValueInfo, ClassBreakInfo, HeatmapColorStop, TimeSlider) {
    window.UniqueValueInfo = UniqueValueInfo;
    window.ClassBreakInfo = ClassBreakInfo;
    window.HeatmapColorStop = HeatmapColorStop;
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

    view.ui.add(document.getElementById('toc'), 'bottom-left');

    timeSlider = new TimeSlider({
        container: "timeSliderDiv",
        mode: "time-window",
        layout: "compact",
        timeExtent: {
            start: new Date(2000, 1, 1),
            end: new Date(2001, 1, 1)
        },
        stops: {
            interval: {
                unit: "years",
                value: 1
            }
        },
        playRate: timeSliderPlayRates[timeSliderPlayRateIndex].playRate,
    });

    timeSlider.when(function () {
        document.querySelector('#timeSliderDiv > div:nth-child(3) > .esri-time-slider__previous').insertAdjacentHTML("beforebegin", `<div class="esri-time-slider__beginning"><button onclick="timeSliderToBeginning()" aria-disabled="false" aria-label="Beginning" class="esri-widget--button esri-time-slider__beginning-button" title="Beginning" type="button"><div class="esri-icon-beginning"></div></button></div>`);
        document.querySelector('#timeSliderDiv > div:nth-child(3) > .esri-time-slider__next').insertAdjacentHTML("afterend", `<div class="esri-time-slider__end"><button onclick="timeSliderToEnd()" aria-disabled="false" aria-label="End" class="esri-widget--button esri-time-slider__end-button" title="End" type="button"><div class="esri-icon-end"></div></button></div>`);
        const timeSliderTools = document.createElement('div');
        timeSliderTools.classList.add('esri-time-slider__row');
        timeSliderTools.insertAdjacentHTML("beforeend", `<div><div style="margin-bottom: 8px;"><label>Play rate: <input onchange="timeSliderPlayRate(this)" oninput="timeSliderPlayRate(this)" type="range" min="100" max="1000" step="100" value="${timeSliderPlayRates[timeSliderPlayRateIndex].playRate}"> <span id="timeSliderPlayRate">${timeSliderPlayRates[timeSliderPlayRateIndex].playRate}</span><span> ms</span></label></div><div><label><input onchange="timeSliderToggleMode()" type="checkbox"> Cumulative from start</label></div></div>`);
        timeSliderTools.insertAdjacentHTML("beforeend", `<details><summary>Layers</summary><ul id="timeSliderLayers"></ul></detailsb>`);
        timeSliderTools.insertAdjacentHTML("beforeend", ``);
        const ts = document.getElementById('timeSliderDiv');
        ts.append(timeSliderTools);
        dragElement(document.getElementById('timeSliderDiv'));
    }, function () {
        alert("error");
    });

    view.ui.add(timeSlider, "bottom-trailing");

    layersInfo.pointLayer.renderers.simple = new SimpleRenderer(layersInfo.pointLayer.renderers.simple);
    layersInfo.pointLayer.renderers.uniqueValue = new UniqueValueRenderer(layersInfo.pointLayer.renderers.uniqueValue);
    layersInfo.pointLayer.renderers.classBreaks = new ClassBreaksRenderer(layersInfo.pointLayer.renderers.classBreaks);
    layersInfo.pointLayer.renderers.heatmap = new HeatmapRenderer(layersInfo.pointLayer.renderers.heatmap);

    layersInfo.polylineLayer.renderers.simple = new SimpleRenderer(layersInfo.polylineLayer.renderers.simple);
    layersInfo.polylineLayer.renderers.uniqueValue = new UniqueValueRenderer(layersInfo.polylineLayer.renderers.uniqueValue);
    layersInfo.polylineLayer.renderers.classBreaks = new ClassBreaksRenderer(layersInfo.polylineLayer.renderers.classBreaks);

    layersInfo.polygonLayer.renderers.simple = new SimpleRenderer(layersInfo.polygonLayer.renderers.simple);
    layersInfo.polygonLayer.renderers.uniqueValue = new UniqueValueRenderer(layersInfo.polygonLayer.renderers.uniqueValue);
    layersInfo.polygonLayer.renderers.classBreaks = new ClassBreaksRenderer(layersInfo.polygonLayer.renderers.classBreaks);

    //Define layers
    layers.pointLayer = new FeatureLayer({
        source: pointsData.map(function (place) {
            return new Graphic({
                attributes: {
                    ObjectId: place.id,
                    name: place.name,
                    time: place.time,
                },
                geometry: {
                    type: "point",
                    longitude: place.longitude,
                    latitude: place.latitude
                },
            });
        }),
        renderer: layersInfo.pointLayer.renderers.heatmap,
        fields: [
            {
                name: "ObjectID",
                alias: "ObjectID",
                type: "oid"
            }, {
                name: "name",
                alias: "name",
                type: "string"
            }, {
                name: "time",
                alias: "time",
                type: "date"
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
        fullTimeExtent: { // entire extent of the timeSlider
            start: new Date(2000, 1, 1).getTime(),
            end: new Date(2004, 1, 1).getTime()
        },
        definitionExpression: '',
    });
    layers.polylineLayer = new FeatureLayer({
        source: polylineData.map(function (line) {
            return new Graphic({
                attributes: {
                    ObjectId: line.id,
                    name: line.name,
                    time: line.time,
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
            }, {
                name: "time",
                alias: "time",
                type: "date"
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
        fullTimeExtent: { // entire extent of the timeSlider
            start: new Date(2003, 1, 1).getTime(),
            end: new Date(2006, 1, 1).getTime()
        },
        definitionExpression: '',
    });

    layers.polygonLayer = new FeatureLayer({
        source: polygonData.map(function (polygon) {
            return new Graphic({
                attributes: {
                    ObjectId: polygon.id,
                    name: polygon.name,
                    time: polygon.time,
                },
                geometry: {
                    type: "polygon",
                    rings: polygon.ring
                }
            });
        }),
        renderer: layersInfo.polygonLayer.renderers.uniqueValue,
        fields: [
            {
                name: "ObjectID",
                alias: "ObjectID",
                type: "oid"
            }, {
                name: "name",
                alias: "name",
                type: "string"
            }, {
                name: "time",
                alias: "time",
                type: "date"
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
        fullTimeExtent: { // entire extent of the timeSlider
            start: new Date(2005, 1, 1).getTime(),
            end: new Date(2008, 1, 1).getTime()
        },
        definitionExpression: '',
    });

    map.layers.addMany([layers.polygonLayer, layers.polylineLayer, layers.pointLayer, sketchLayer]);

    Object.keys(layers).forEach((layerName) => {
        const layer = layers[layerName];
        symbolUtils.renderPreviewHTML(getLayerSymbol(layer), {
            node: document.getElementById(layerName + 'SymbologyIcon'),
            size: {
                width: 24,
                height: 4
            }
        });
        layersInfo[layerName].initialDefinitionExpression = layers[layerName].definitionExpression;
        updateLayerFeaturesCount(layerName);
    });
    timeSlider.watch("timeExtent", () => {
        applyTimeExtentToLayers();
    });
});

function timeSliderToBeginning() {
    const start = new Date(timeSlider.fullTimeExtent.start.getTime());
    timeSlider.timeExtent = {
        start: start,
        end: new Date(start.getTime()).setFullYear(start.getFullYear() + 1)
    };
}
function timeSliderToEnd() {
    const end = new Date(timeSlider.fullTimeExtent.end.getTime());
    timeSlider.timeExtent = {
        start: new Date(end.getTime()).setFullYear(end.getFullYear() - 1),
        end: end
    };
}

function timeSliderToggleMode() {
    const timeExtent = {
        start: timeSlider.timeExtent.start,
        end: timeSlider.timeExtent.end
    };
    timeSlider.mode = timeSlider.mode === 'time-window' ? 'cumulative-from-start' : 'time-window';
    switch (timeSlider.mode) {
        case 'time-window':
            const start = new Date(timeExtent.end);
            start.setFullYear(timeExtent.end.getFullYear() - 1);
            timeSlider.timeExtent = {
                start: Math.max(start.getTime(), timeSlider.fullTimeExtent.start.getTime()),
                end: timeExtent.end
            }
            break;
        case 'cumulative-from-start':
            timeSlider.timeExtent = {
                start: null,
                end: timeExtent.end
            }
            break;
    }
}

function timeSliderPlayRate(range) {
    timeSlider.set({
        playRate: range.value
    });
    document.getElementById('timeSliderPlayRate').innerHTML = range.value;
}

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
        case 'heatmap':
            symbol = layersInfo.pointLayer.renderers.simple.symbol;
            break;
    }
    return symbol?.clone();
}

function showLayer(layerName) {
    layers[layerName]
        .when((layer) => {
            return layer.queryExtent();
        })
        .then((response) => {
            view.goTo(response.extent);
        });
}

function toggleLayer(event, layerName) {
    layers[layerName].visible = event.target.checked;
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
            for (const key of Object.keys(layersInfo.pointLayer.renderers)) {
                const rendererType = key.ucFirst();
                const symbolsElement = document.getElementById(`pointLayer${rendererType}SymbolSetting`);
                let index = 0
                switch (key) {
                    case 'simple':
                        layersInfo.pointLayer.renderers.simple.symbol.font.size = document.getElementById(activeTocLayer + rendererType + 'PointSize_0').value;
                        layersInfo.pointLayer.renderers.simple.symbol.text = document.getElementById(activeTocLayer + rendererType + 'Icon_0').value;
                        break;
                    case 'uniqueValue':
                        layersInfo.pointLayer.renderers.uniqueValue.field = document.getElementById(activeTocLayer + rendererType + 'LayerField').value;
                        layersInfo.pointLayer.renderers.uniqueValue.uniqueValueInfos = [];
                        for (const symbolSetting of symbolsElement.children) {
                            const i = symbolSetting.id.split('_')[1];
                            layersInfo.pointLayer.renderers.uniqueValue.uniqueValueInfos[index++] = new UniqueValueInfo({
                                value: document.getElementById(activeTocLayer + rendererType + 'FieldValue_' + i).value,
                                symbol: {
                                    type: 'text',
                                    text: document.getElementById(activeTocLayer + rendererType + 'Icon_' + i).value,
                                    font: {
                                        size: document.getElementById(activeTocLayer + rendererType + 'PointSize_' + i).value,
                                        family: "CalciteWebCoreIcons",
                                    },
                                }
                            });
                        }
                        break;
                    case 'classBreaks':
                        layersInfo.pointLayer.renderers.classBreaks.field = document.getElementById(activeTocLayer + rendererType + 'LayerField').value;
                        layersInfo.pointLayer.renderers.classBreaks.classBreakInfos = [];
                        for (const symbolSetting of symbolsElement.children) {
                            const i = symbolSetting.id.split('_')[1];
                            layersInfo.pointLayer.renderers.classBreaks.classBreakInfos[index++] = new ClassBreakInfo({
                                minValue: document.getElementById(activeTocLayer + rendererType + 'FieldMinValue_' + i).value,
                                maxValue: document.getElementById(activeTocLayer + rendererType + 'FieldMaxValue_' + i).value,
                                symbol: {
                                    type: 'text',
                                    text: document.getElementById(activeTocLayer + rendererType + 'Icon_' + i).value,
                                    font: {
                                        size: document.getElementById(activeTocLayer + rendererType + 'PointSize_' + i).value,
                                        family: "CalciteWebCoreIcons",
                                    },
                                }
                            });
                        }
                        break;
                    case 'heatmap':
                        layersInfo.pointLayer.renderers.heatmap.radius = document.getElementById(activeTocLayer + rendererType + 'Radius').value;
                        layersInfo.pointLayer.renderers.heatmap.minDensity = document.getElementById(activeTocLayer + rendererType + 'MinDensity').value;
                        layersInfo.pointLayer.renderers.heatmap.maxDensity = document.getElementById(activeTocLayer + rendererType + 'MaxDensity').value;
                        layersInfo.pointLayer.renderers.heatmap.colorStops = [];
                        for (const colorStop of document.getElementById('pointLayerHeatmapColorStops').children) {
                            const i = colorStop.id.split('_')[1];
                            var opacity = document.getElementById(activeTocLayer + rendererType + 'ColorStopColorOpacity_' + i).value;
                            var color = document.getElementById(activeTocLayer + rendererType + 'ColorStopColor_' + i).value;
                            layersInfo.pointLayer.renderers.heatmap.colorStops[index++] = new HeatmapColorStop({
                                ratio: document.getElementById(activeTocLayer + rendererType + 'ColorStopRatio_' + i).value,
                                color: 'rgba(' + parseInt(color.slice(-6, -4), 16) + ',' + parseInt(color.slice(-4, -2), 16) + ',' + parseInt(color.slice(-2), 16) + ',' + opacity + ')',
                            });
                        }
                        break;
                }
            }
            layers.pointLayer.renderer = layersInfo.pointLayer.renderers[activeModalTab];
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
                            layersInfo.polylineLayer.renderers.classBreaks.classBreakInfos[index++] = new ClassBreakInfo({
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
            for (const key of Object.keys(layersInfo.polygonLayer.renderers)) {
                const rendererType = key.ucFirst();
                const symbolsElement = document.getElementById(`polygonLayer${rendererType}SymbolSetting`);
                let index = 0
                switch (key) {
                    case 'simple':
                        layersInfo.polygonLayer.renderers.simple.symbol.color = document.getElementById(activeTocLayer + rendererType + 'Background_0').value;
                        layersInfo.polygonLayer.renderers.simple.symbol.outline.color = document.getElementById(activeTocLayer + rendererType + 'Border_0').value;
                        break;
                    case 'uniqueValue':
                        layersInfo.polygonLayer.renderers.uniqueValue.field = document.getElementById(activeTocLayer + rendererType + 'LayerField').value;
                        layersInfo.polygonLayer.renderers.uniqueValue.uniqueValueInfos = [];
                        for (const symbolSetting of symbolsElement.children) {
                            const i = symbolSetting.id.split('_')[1];
                            layersInfo.polygonLayer.renderers.uniqueValue.uniqueValueInfos[index++] = new UniqueValueInfo({
                                value: document.getElementById(activeTocLayer + rendererType + 'FieldValue_' + i).value,
                                symbol: {
                                    type: 'simple-fill',
                                    color: document.getElementById(activeTocLayer + rendererType + 'Background_' + i).value,
                                    outline: {
                                        color: document.getElementById(activeTocLayer + rendererType + 'Border_' + i).value,
                                    }
                                }
                            });
                        }
                        break;
                    case 'classBreaks':
                        layersInfo.polygonLayer.renderers.classBreaks.field = document.getElementById(activeTocLayer + rendererType + 'LayerField').value;
                        layersInfo.polygonLayer.renderers.classBreaks.classBreakInfos = [];
                        for (const symbolSetting of symbolsElement.children) {
                            const i = symbolSetting.id.split('_')[1];
                            layersInfo.polygonLayer.renderers.classBreaks.classBreakInfos[index++] = new ClassBreakInfo({
                                minValue: document.getElementById(activeTocLayer + rendererType + 'FieldMinValue_' + i).value,
                                maxValue: document.getElementById(activeTocLayer + rendererType + 'FieldMaxValue_' + i).value,
                                symbol: {
                                    type: 'simple-fill',
                                    color: document.getElementById(activeTocLayer + rendererType + 'Background_' + i).value,
                                    outline: {
                                        color: document.getElementById(activeTocLayer + rendererType + 'Border_' + i).value,
                                    }
                                }
                            });
                        }
                        break;
                }
            }
            layers.polygonLayer.renderer = layersInfo.polygonLayer.renderers[activeModalTab];
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
    document.getElementsByClassName('active-icon')[0]?.classList?.remove('active-icon');
    element.classList.add('active-icon');
}

function initPointLayerModal() {
    for (const key of Object.keys(layersInfo.pointLayer.renderers)) {
        const renderer = layersInfo.pointLayer.renderers[key];
        const rendererType = key.ucFirst();
        const symbolSetting = document.getElementById('pointLayer' + rendererType + 'SymbolSetting');
        switch (renderer.type) {
            case "simple":
                symbolSetting.innerHTML = createPointLayerSymbolFields(0, rendererType);
                document.getElementById(activeTocLayer + rendererType + 'PointSize_0').value = renderer.symbol.font.size;
                document.getElementById(activeTocLayer + rendererType + 'Icon_0').value = renderer.symbol.text;
                document.getElementById(activeTocLayer + rendererType + 'Icon_0').nextElementSibling.classList = document.querySelector('[data-code$=' + renderer.symbol.text.charCodeAt(0).toString(16) + ']')?.classList;
                break;
            case "unique-value":
                symbolSetting.innerHTML = '';
                if (!document.getElementById(activeTocLayer + rendererType + 'LayerField')) {
                    symbolSetting.parentElement.prepend(document.createElement('hr'));
                    symbolSetting.parentElement.prepend(createLayerFieldsSelect(layers.pointLayer, activeTocLayer + rendererType + 'LayerField'));
                }
                document.getElementById(activeTocLayer + rendererType + 'LayerField').value = renderer.field;
                for (let i = 0; i < renderer.uniqueValueInfos.length; i++) {
                    symbolSetting.insertAdjacentHTML('beforeend', createRendererSymbolSetting(activeTocLayer, rendererType, i));
                    document.getElementById(activeTocLayer + rendererType + 'FieldValue_' + i).value = renderer.uniqueValueInfos[i].value;
                    document.getElementById(activeTocLayer + rendererType + 'PointSize_' + i).value = renderer.uniqueValueInfos[i].symbol.font.size;
                    document.getElementById(activeTocLayer + rendererType + 'Icon_' + i).value = renderer.uniqueValueInfos[i].symbol.text;
                    document.getElementById(activeTocLayer + rendererType + 'Icon_' + i).nextElementSibling.classList = document.querySelector('[data-code$=' + renderer.uniqueValueInfos[i].symbol.text.charCodeAt(0).toString(16) + ']')?.classList;
                }
                break;
            case "class-breaks":
                symbolSetting.innerHTML = '';
                if (!document.getElementById(activeTocLayer + rendererType + 'LayerField')) {
                    symbolSetting.parentElement.prepend(document.createElement('hr'));
                    symbolSetting.parentElement.prepend(createLayerFieldsSelect(layers.pointLayer, activeTocLayer + rendererType + 'LayerField'));
                }
                document.getElementById(activeTocLayer + rendererType + 'LayerField').value = renderer.field;
                for (let i = 0; i < renderer.classBreakInfos.length; i++) {
                    symbolSetting.insertAdjacentHTML('beforeend', createRendererSymbolSetting(activeTocLayer, rendererType, i));
                    document.getElementById(activeTocLayer + rendererType + 'FieldMinValue_' + i).value = renderer.classBreakInfos[i].minValue;
                    document.getElementById(activeTocLayer + rendererType + 'FieldMaxValue_' + i).value = renderer.classBreakInfos[i].maxValue;
                    document.getElementById(activeTocLayer + rendererType + 'PointSize_' + i).value = renderer.classBreakInfos[i].symbol.font.size;
                    document.getElementById(activeTocLayer + rendererType + 'Icon_' + i).value = renderer.classBreakInfos[i].symbol.text;
                    document.getElementById(activeTocLayer + rendererType + 'Icon_' + i).nextElementSibling.classList = document.querySelector('[data-code$=' + renderer.classBreakInfos[i].symbol.text.charCodeAt(0).toString(16) + ']')?.classList;
                }
                break;
            case "heatmap":
                const colorStops = document.getElementById('pointLayerHeatmapColorStops');
                colorStops.innerHTML = '';
                for (let i = 0; i < renderer.colorStops.length; i++) {
                    colorStops.insertAdjacentHTML('beforeend', createHeatmapColorStopSetting(i));
                    document.getElementById(activeTocLayer + rendererType + 'ColorStopRatio_' + i).value = renderer.colorStops[i].ratio;
                    document.getElementById(activeTocLayer + rendererType + 'ColorStopColor_' + i).value = renderer.colorStops[i].color.toHex();
                    document.getElementById(activeTocLayer + rendererType + 'ColorStopColorOpacity_' + i).value = renderer.colorStops[i].color.toRgba()[3];
                    document.getElementById(activeTocLayer + rendererType + 'Radius').value = renderer.radius;
                    document.getElementById(activeTocLayer + rendererType + 'MinDensity').value = renderer.minDensity;
                    document.getElementById(activeTocLayer + rendererType + 'MaxDensity').value = renderer.maxDensity;
                }
        }
    }
    openTab(layers.pointLayer.renderer.type.toPascalCase().lcFirst());
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
                    symbolSetting.insertAdjacentHTML('beforeend', createRendererSymbolSetting(activeTocLayer, rendererType, i));
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
                    symbolSetting.insertAdjacentHTML('beforeend', createRendererSymbolSetting(activeTocLayer, rendererType, i));
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
    for (const key of Object.keys(layersInfo.polygonLayer.renderers)) {
        const renderer = layersInfo.polygonLayer.renderers[key];
        const rendererType = key.ucFirst();
        const symbolSetting = document.getElementById('polygonLayer' + rendererType + 'SymbolSetting');
        switch (renderer.type) {
            case "simple":
                symbolSetting.innerHTML = createPolygonLayerSymbolFields(0, rendererType);
                document.getElementById(activeTocLayer + rendererType + 'Background_0').value = renderer.symbol.color.toHex();
                document.getElementById(activeTocLayer + rendererType + 'Border_0').value = renderer.symbol.outline.color.toHex();
                break;
            case "unique-value":
                symbolSetting.innerHTML = '';
                if (!document.getElementById(activeTocLayer + rendererType + 'LayerField')) {
                    symbolSetting.parentElement.prepend(document.createElement('hr'));
                    symbolSetting.parentElement.prepend(createLayerFieldsSelect(layers.polygonLayer, activeTocLayer + rendererType + 'LayerField'));
                }
                document.getElementById(activeTocLayer + rendererType + 'LayerField').value = renderer.field;
                for (let i = 0; i < renderer.uniqueValueInfos.length; i++) {
                    symbolSetting.insertAdjacentHTML('beforeend', createRendererSymbolSetting(activeTocLayer, rendererType, i));
                    document.getElementById(activeTocLayer + rendererType + 'FieldValue_' + i).value = renderer.uniqueValueInfos[i].value;
                    document.getElementById(activeTocLayer + rendererType + 'Background_' + i).value = renderer.uniqueValueInfos[i].symbol.color.toHex();
                    document.getElementById(activeTocLayer + rendererType + 'Border_' + i).value = renderer.uniqueValueInfos[i].symbol.outline.color.toHex();
                }
                break;
            case "class-breaks":
                symbolSetting.innerHTML = '';
                if (!document.getElementById(activeTocLayer + rendererType + 'LayerField')) {
                    symbolSetting.parentElement.prepend(document.createElement('hr'));
                    symbolSetting.parentElement.prepend(createLayerFieldsSelect(layers.polygonLayer, activeTocLayer + rendererType + 'LayerField'));
                }
                document.getElementById(activeTocLayer + rendererType + 'LayerField').value = renderer.field;
                for (let i = 0; i < renderer.classBreakInfos.length; i++) {
                    symbolSetting.insertAdjacentHTML('beforeend', createRendererSymbolSetting(activeTocLayer, rendererType, i));
                    document.getElementById(activeTocLayer + rendererType + 'FieldMinValue_' + i).value = renderer.classBreakInfos[i].minValue;
                    document.getElementById(activeTocLayer + rendererType + 'FieldMaxValue_' + i).value = renderer.classBreakInfos[i].maxValue;
                    document.getElementById(activeTocLayer + rendererType + 'Background_' + i).value = renderer.classBreakInfos[i].symbol.color.toHex();
                    document.getElementById(activeTocLayer + rendererType + 'Border_' + i).value = renderer.classBreakInfos[i].symbol.outline.color.toHex();
                }
                break;
        }
    }
    openTab(layers.polygonLayer.renderer.type.toPascalCase().lcFirst());
}

function createUniqueValueRendererFieldValue(layerName, index) {
    return `<div class="form-field"><label>Value: <input type="text" id="${layerName}UniqueValueFieldValue_${index}"></label></div>`;
}

function createClassBreaksRendererFieldValue(layerName, index) {
    return `
<div class="form-field"><label>Min Value: <input type="text" id="${layerName}ClassBreaksFieldMinValue_${index}"></label></div>
<div class="form-field"><label>Max Value: <input type="text" id="${layerName}ClassBreaksFieldMaxValue_${index}"></label></div>
`;
}

function createPointLayerSymbolFields(index, rendererType) {
    return `
    <div class="form-field"><label>Size: <input type="number" id="pointLayer${rendererType}PointSize_${index}"></label></div>
    <div class="form-field cur-pointer" onclick="openSelectIconModal('pointLayer${rendererType}Icon_${index}')"><label class="cur-pointer">Icon: <input type="hidden" id="pointLayer${rendererType}Icon_${index}"><span class="icon"></span></label></div>
`;
}

function createPolylineLayerSymbolFields(index, rendererType) {
    return `
    <div class="form-field"><label>Line thickness: <input type="number" id="polylineLayer${rendererType}Thickness_${index}"> px</label></div>
    <div class="form-field"><label>Line color: <input type="color" id="polylineLayer${rendererType}Color_${index}"></label></div>
`;
}

function createPolygonLayerSymbolFields(index, rendererType) {
    return `
    <div class="form-field"><label>Fill color: <input type="color" id="polygonLayer${rendererType}Background_${index}"></label></div>
    <div class="form-field"><label>Outline color: <input type="color" id="polygonLayer${rendererType}Border_${index}"></label></div>
`;
}

function createDeleteSymbolSettingButton() {
    return `<button class="delete-symbol-setting" onclick="this.parentElement.remove()">Delete</button>`;
}

function createRendererSymbolSetting(layerName, rendererType, index) {
    const fieldValue = window[`create${rendererType.ucFirst()}RendererFieldValue`](layerName, index);
    const symbolFields = window[`create${layerName.ucFirst()}SymbolFields`](index, rendererType.ucFirst());
    const deleteSymbolSettingButton = createDeleteSymbolSettingButton();
    return `<div class="symbol-setting" id="${layerName}${rendererType}SymbolSetting_${index}">${fieldValue}${symbolFields}${deleteSymbolSettingButton}</div>`
}

function addSymbol(layerName, rendererType) {
    const symbolSetting = document.getElementById(`${layerName}${rendererType.ucFirst()}SymbolSetting`);
    const lastSymbolSetting = symbolSetting.lastChild;
    const index = lastSymbolSetting ? Number(lastSymbolSetting.id.split('_')[1]) + 1 : 0;
    symbolSetting.insertAdjacentHTML('beforeend', createRendererSymbolSetting(layerName, rendererType, index));
}

function createHeatmapColorStopSetting(index) {
    const deleteSymbolSettingButton = createDeleteSymbolSettingButton();
    return `
    <div class="symbol-setting" id="pointLayerHeatmapColorStop_${index}">
        <div class="form-field"><label>Ratio: <input type="text" id="pointLayerHeatmapColorStopRatio_${index}"></label></div>
        <div class="form-field"><label>Color: <input type="color" id="pointLayerHeatmapColorStopColor_${index}"></label></div>
        <div class="form-field"><label>Opacity: <input type="range" min="0" max="1" step="0.1" id="pointLayerHeatmapColorStopColorOpacity_${index}"></label></div>
        ${deleteSymbolSettingButton}
    <div>
    `;
}

function addHeatmapColorStop() {
    const colorStops = document.getElementById(`pointLayerHeatmapColorStops`);
    const lastColorStop = colorStops.lastChild;
    const index = lastColorStop ? Number(lastColorStop.id.split('_')[1]) + 1 : 0;
    colorStops.insertAdjacentHTML('beforeend', createHeatmapColorStopSetting(index));
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
    menu.style.top = event.clientY - menu.offsetHeight + 'px';
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

function addLayerToTimeSlider() {
    if (!timeSliderLayers.includes(activeTocLayer)) {
        timeSliderLayers.push(activeTocLayer);
        timeSliderCheckedLayers.push(activeTocLayer);
        document.getElementById("timeSliderLayers").insertAdjacentHTML("beforeend", `<li id="${activeTocLayer}TimeSliderLayer"><label><input type="checkbox" checked onchange="this" onclick="toggleTimeSliderCheckedLayer('${activeTocLayer}')"> ${activeTocLayer}</label> <button class="esri-widget--button" title="Delete" onclick="removeLayerFromTimeSlider('${activeTocLayer}')"><div class="esri-icon-trash"></div></button></li>`);
        calcTimeSliderTimeExtent();
    }
}

function toggleTimeSliderCheckedLayer(layerName) {
    if (!timeSliderCheckedLayers.includes(layerName)) {
        timeSliderCheckedLayers.push(layerName);
    } else {
        timeSliderCheckedLayers.splice(timeSliderCheckedLayers.indexOf(layerName), 1);
        layers[layerName].definitionExpression = layersInfo[layerName].initialDefinitionExpression;
        updateLayerFeaturesCount(layerName)
    }
    calcTimeSliderTimeExtent();
}

function removeLayerFromTimeSlider(layerName) {
    timeSliderLayers.splice(timeSliderLayers.indexOf(layerName), 1);
    timeSliderCheckedLayers.splice(timeSliderCheckedLayers.indexOf(layerName), 1);
    document.getElementById(layerName + 'TimeSliderLayer').remove();
    layers[layerName].definitionExpression = layersInfo[layerName].initialDefinitionExpression;
    updateLayerFeaturesCount(layerName);
    calcTimeSliderTimeExtent();
}

function calcTimeSliderTimeExtent() {
    if (timeSliderCheckedLayers.length === 0) {
        timeSlider.timeExtent = null;
        timeSlider.fullTimeExtent = null;
        return;
    }
    let absoluteStart = Number.MAX_VALUE;
    let absoluteEnd = 0;
    for (const timeSliderLayer of timeSliderCheckedLayers) {
        if (absoluteStart > layers[timeSliderLayer].fullTimeExtent.start) {
            absoluteStart = layers[timeSliderLayer].fullTimeExtent.start;
        }
        if (absoluteEnd < layers[timeSliderLayer].fullTimeExtent.end) {
            absoluteEnd = layers[timeSliderLayer].fullTimeExtent.end;
        }
    }
    timeSlider.fullTimeExtent = {
        start: absoluteStart,
        end: absoluteEnd,
    }
    timeSlider.timeExtent = {
        start: absoluteStart,
        end: new Date(absoluteStart).setFullYear(new Date(absoluteStart).getFullYear() + 1),
    }
}

function applyTimeExtentToLayers() {
    if (timeSliderCheckedLayers.length === 0) {
        return;
    }
    let query = '';
    if (timeSlider.timeExtent?.end) {
        query += "time <= " + timeSlider.timeExtent?.end?.getTime();
    }
    if (timeSlider.timeExtent?.start) {
        query += " and time >= " + timeSlider.timeExtent?.start?.getTime();
    }
    for (const timeSliderLayer of timeSliderCheckedLayers) {
        layers[timeSliderLayer].definitionExpression = query;
        updateLayerFeaturesCount(timeSliderLayer)
    }
}

function updateLayerFeaturesCount(layerName) {
    layers[layerName]
        .queryFeatures(layers[layerName].createQuery())
        .then((result) => {
                document.getElementById(layerName + 'FeaturesCount').innerHTML = ' (' + result.features.length + ')';
            }
        );
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

function openSelectIconModal(inputId) {
    activeIconInput = inputId;
    document.querySelector('[data-code$=' + document.getElementById(activeIconInput).value.charCodeAt(0).toString(16) + ']')?.classList.add('active-icon')
    openModal('selectIconModal');
}

function selectIcon() {
    const activeIcon = document.getElementsByClassName('active-icon')[0];
    if (activeIcon) {
        document.getElementById(activeIconInput).value = String.fromCharCode(parseInt(activeIcon.dataset.code.replace('\\u', ''), 16));
        // document.getElementById(activeIconInput).nextElementSibling.innerHTML = document.getElementById(activeIconInput).value;
        document.getElementById(activeIconInput).nextElementSibling.classList = document.querySelector('[data-code$=' + document.getElementById(activeIconInput).value.charCodeAt(0).toString(16) + ']')?.classList;
        activeIcon.classList.remove('active-icon');
    }
    closeModal('selectIconModal');
}

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = ((elmnt.style.top ? Number(elmnt.style.top.replace('px', '')) : 0) - pos2) + "px";
        elmnt.style.left = ((elmnt.style.left ? Number(elmnt.style.left.replace('px', '')) : 0) - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}