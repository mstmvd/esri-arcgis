//configuration
const initialCoordinate = [-3.6784679, 40.4103599];//The center of map
const initialZoom = 17;//Initial zoom level of map

let view;

const layers = {};

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

const layersRenderer = {
    pointRenderers: {
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
    polylineRenderers: {
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
    polygonRenderers: {
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
    }
}

const layersTemplate = {
    pointTemplate: {
        title: "Point Layer",
        outFields: ["*"],
        content: [
            {
                type: "fields",
                fieldInfos: [
                    {
                        fieldName: "ObjectID",
                        label: "Object ID"
                    },
                    {
                        fieldName: "name",
                        label: "Name"
                    },
                ]
            },
            {
                type: "media",
                mediaInfos: [
                    {
                        title: "Drone",
                        type: "image",
                        caption: "Drone",
                        value: {
                            sourceURL: "{imageUrl}"
                        }
                    }
                ]
            }
        ],
    },
    polylineTemplate: {
        title: "Polyline Layer",
        outFields: ["*"],
        content: [
            {
                type: "fields",
                fieldInfos: [
                    {
                        fieldName: "ObjectID",
                        label: "Object ID"
                    },
                    {
                        fieldName: "name",
                        label: "Name"
                    },
                ]
            }
        ]
    },
    polygonTemplate: {
        title: "Polygon Layer",
        outFields: ["*"],
        content: [
            {
                type: "fields",
                fieldInfos: [
                    {
                        fieldName: "ObjectID",
                        label: "Object ID"
                    },
                    {
                        fieldName: "name",
                        label: "Name"
                    },
                ]
            }
        ]
    }
}

const layersInfo = {
    pointLayer: {
        title: 'Point layer',
        renderers: {...layersRenderer.pointRenderers},
        initialDefinitionExpression: '',
        selectedObjectIds: new Map(),
        template: {...layersTemplate.pointTemplate},
    },
    polylineLayer: {
        title: 'Polyline layer',
        renderers: {...layersRenderer.polylineRenderers},
        initialDefinitionExpression: '',
        selectedObjectIds: new Map(),
        template: {...layersTemplate.polylineTemplate},
    },
    polygonLayer: {
        title: 'Polygon layer',
        renderers: {...layersRenderer.polygonRenderers},
        initialDefinitionExpression: '',
        selectedObjectIds: new Map(),
        template: {...layersTemplate.polygonTemplate},
    },
}

//Sample data
const pointsData = [
    {
        id: 1,
        longitude: -3.6804679,
        latitude: 40.4103000,
        name: 'point1',
        time: new Date(2001, 1, 1).getTime(),
        imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 2,
        longitude: -3.6774979,
        latitude: 40.4099999,
        name: 'point2',
        time: new Date(2002, 1, 1).getTime(),
        imageUrl: 'https://images.unsplash.com/photo-1521405924368-64c5b84bec60?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 3,
        longitude: -3.6784979,
        latitude: 40.4108599,
        name: 'point3',
        time: new Date(2003, 1, 1).getTime(),
        imageUrl: 'https://images.unsplash.com/photo-1495810551032-2043a52a19c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80'
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

const labelPlacement = {
    point: ['above-center', 'above-left', 'above-right', 'below-center', 'below-left', 'below-right', 'center-center', 'center-left', 'center-right'],
    polyline: ['center-along'],
    polygon: ['always-horizontal'],
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
let selectedSketchGraphic;
const supportedFeatureFieldTypes = ['small-integer', 'integer', 'single', 'double', 'long', 'date', 'string'];

let isAttributeTablesShow = false;

require([
    "esri/Map",
    "esri/views/MapView",
    "esri/views/SceneView",
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
    "esri/widgets/TimeSlider",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Sketch/SketchViewModel",
    "esri/geometry/geometryEngineAsync",
], function (Map, MapView, SceneView, Graphic, GraphicsLayer, FeatureLayer, LabelClass, Field, Sketch, symbolUtils, SimpleRenderer, UniqueValueRenderer, ClassBreaksRenderer, HeatmapRenderer, UniqueValueInfo, ClassBreakInfo, HeatmapColorStop, TimeSlider, BasemapGallery, SketchViewModel, geometryEngineAsync) {
    window.UniqueValueInfo = UniqueValueInfo;
    window.ClassBreakInfo = ClassBreakInfo;
    window.HeatmapColorStop = HeatmapColorStop;
    window.FeatureLayer = FeatureLayer;
    globalSymbolUtils = symbolUtils;
    const sketchLayer = new GraphicsLayer();
    const tempSketchLayer = new GraphicsLayer();
    const switchButton = document.getElementById("switch-btn");
    const addLayerButton = document.getElementById("addLayerBtn");
    const toc = document.getElementById('toc');
    let is3D = false;
    let sketchViewModel;

    map = new Map({
        basemap: "hybrid",
        ground: "world-elevation",
    });

    const viewConfig = {
        container: "viewDiv",
        map: map,
        zoom: initialZoom,
        center: initialCoordinate,
    };

    initView();

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
        dragElement(document.getElementById('timeSliderDiv'), '.esri-time-slider__row:first-child');
    }, function () {
        alert("error");
    });

    timeSlider.watch("timeExtent", () => {
        applyTimeExtentToLayers();
    });

    let basemapGallery = new BasemapGallery({
        view: view
    });

    switchButton.addEventListener("click", () => {
        initView();
    });

    addLayerButton.addEventListener("click", () => {
        document.getElementById('addLayerUrl').value = '';
        document.getElementById('addLayerPortalItemId').value = '';
        openModal('addLayerModal');
    });

    function initView() {
        let viewPoint;
        if (view?.viewpoint) {
            viewPoint = view.viewpoint.clone();
        }
        if (is3D) {
            view = new SceneView(viewConfig);
            is3D = false;
            switchButton.value = '2D';
        } else {
            view = new MapView(viewConfig);
            is3D = true;
            switchButton.value = '3D';
        }
        if (viewPoint) {
            view.viewpoint = viewPoint;
        }
        view.when(() => {
            const sketch = new Sketch({
                layer: sketchLayer,
                view: view,
                creationMode: "update"
            });
            sketchViewModel = new SketchViewModel({
                view: view,
                layer: tempSketchLayer,
                defaultCreateOptions: {
                    mode: "freehand"
                }
            });
            sketchViewModel.on("create", async (event) => {
                if (event.state === "complete") {
                    // this polygon will be used to query features that intersect it
                    const geometries = tempSketchLayer.graphics.map(function (graphic) {
                        return graphic.geometry
                    });
                    const queryGeometry = await geometryEngineAsync.union(geometries.toArray());
                    selectFeatures(queryGeometry);
                }
            });
            view.ui.add([
                {component: sketch, index: 0, position: "top-left"},
                {component: basemapGallery, index: 0, position: "top-right"},
                {component: toc, index: 0, position: "bottom-left"},
                {component: addLayerButton, index: 1, position: "top-left"},
                {component: switchButton, index: 2, position: "top-left"},
                {component: timeSlider, index: 0, position: "bottom-trailing"},
            ]);
        }).then(function () {
            view.on("pointer-up", addToLayer);
            view.on("pointer-up", selectObject);
            view.on("pointer-up", showSelectedObjectsContextMenu);
            view.on("key-down", startSelectWithCtrl);
            view.on("pointer-move", startSelectWithPointer);
            view.on("key-up", cancelSelect);
        });
    }

    layersRenderer.pointRenderers.simple = new SimpleRenderer(layersRenderer.pointRenderers.simple);
    layersRenderer.pointRenderers.uniqueValue = new UniqueValueRenderer(layersRenderer.pointRenderers.uniqueValue);
    layersRenderer.pointRenderers.classBreaks = new ClassBreaksRenderer(layersRenderer.pointRenderers.classBreaks);
    layersRenderer.pointRenderers.heatmap = new HeatmapRenderer(layersRenderer.pointRenderers.heatmap);
    layersInfo.pointLayer.renderers = {...layersRenderer.pointRenderers}

    layersRenderer.polylineRenderers.simple = new SimpleRenderer(layersRenderer.polylineRenderers.simple);
    layersRenderer.polylineRenderers.uniqueValue = new UniqueValueRenderer(layersRenderer.polylineRenderers.uniqueValue);
    layersRenderer.polylineRenderers.classBreaks = new ClassBreaksRenderer(layersRenderer.polylineRenderers.classBreaks);
    layersInfo.polylineLayer.renderers = {...layersRenderer.polylineRenderers}

    layersRenderer.polygonRenderers.simple = new SimpleRenderer(layersRenderer.polygonRenderers.simple);
    layersRenderer.polygonRenderers.uniqueValue = new UniqueValueRenderer(layersRenderer.polygonRenderers.uniqueValue);
    layersRenderer.polygonRenderers.classBreaks = new ClassBreaksRenderer(layersRenderer.polygonRenderers.classBreaks);
    layersInfo.polygonLayer.renderers = {...layersRenderer.polygonRenderers}

    //Define layers
    layers.pointLayer = new FeatureLayer({
        id: 'pointLayer',
        title: 'Point layer',
        source: pointsData.map(function (place) {
            return new Graphic({
                attributes: {
                    ObjectID: place.id,
                    name: place.name,
                    time: place.time,
                    imageUrl: place.imageUrl,
                },
                geometry: {
                    type: "point",
                    longitude: place.longitude,
                    latitude: place.latitude
                },
            });
        }),
        renderer: layersInfo.pointLayer.renderers.simple,
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
            }, {
                name: "imageUrl",
                alias: "imageUrl",
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
        fullTimeExtent: { // entire extent of the timeSlider
            start: new Date(2000, 1, 1).getTime(),
            end: new Date(2004, 1, 1).getTime()
        },
        definitionExpression: '',
        popupTemplate: layersInfo.pointLayer.template,
        outFields: ["*"],
    });
    layers.polylineLayer = new FeatureLayer({
        id: 'polylineLayer',
        title: 'Polyline layer',
        source: polylineData.map(function (line) {
            return new Graphic({
                attributes: {
                    ObjectID: line.id,
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
        outFields: ["*"],
        popupTemplate: layersInfo.polylineLayer.template,
    });
    layers.polygonLayer = new FeatureLayer({
        id: 'polygonLayer',
        title: 'Polygon layer',
        source: polygonData.map(function (polygon) {
            return new Graphic({
                attributes: {
                    ObjectID: polygon.id,
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
        popupTemplate: layersInfo.polygonLayer.template,
        outFields: ["*"],
    });

    map.layers.addMany([layers.polygonLayer, layers.polylineLayer, layers.pointLayer, sketchLayer]);

    for (const layerId in layers) {
        layers[layerId].on("edits", function (event) {
            recreateFeatureTable(layers[layerId]);
        });
    }

    function showSelectedObjectsContextMenu(event) {
        if (event.button === 2) {
            view.hitTest(event).then(function (evt) {
                if (evt?.results?.length) {
                    let isSelected = false;
                    for (const result of evt?.results) {
                        if (result.type === 'graphic') {
                            let layerName;
                            let layer;
                            Object.keys(layers).forEach(name => {
                                if (layers[name].id === result.graphic?.layer?.id) {
                                    layer = layers[name];
                                    layerName = name;
                                }
                            });
                            if (!layerName) {
                                continue;
                            }
                            const objectId = result.graphic?.attributes[layer.objectIdField];
                            if (!objectId) {
                                continue;
                            }
                            isSelected = layersInfo[layerName]?.selectedObjectIds.has(objectId);
                            if (isSelected) {
                                break;
                            }
                        }
                    }
                    if (isSelected) {
                        let selectedObjectsCount = 0;
                        Object.keys(layersInfo).forEach(layerName => {
                            selectedObjectsCount += layersInfo[layerName]?.selectedObjectIds.size;
                        });
                        if (selectedObjectsCount >= 2) {
                            showContextMenu(event, 'selectedObjectsOptionMenu');
                        }
                    }
                }
            });
        }
    }

    function selectFeatures(geometry) {
        for (const layerName in layers) {
            const query = {
                geometry: geometry,
                outFields: ["*"]
            };
            layers[layerName].queryFeatures(query)
                .then((results) => {
                    if (results.features.length > 0) {
                        for (const feature of results.features) {
                            selectGraphic(feature, 'add');
                        }
                    }
                });
        }
    }

    function addToLayer(event) {
        if (event.button === 2) {
            view.hitTest(event).then(function (evt) {
                const results = evt.results.filter(function (result) {
                    return result.graphic.layer === sketchLayer;
                });
                if (results.length) {
                    selectedSketchGraphic = results[0].graphic;
                    showContextMenu(event, 'sketchOptionMenu');
                }
            });
        }
    }

    function selectObject(event) {
        if (event.button === 0 && event.native.ctrlKey) {
            event.stopPropagation();
            view.hitTest(event).then(function (evt) {
                if (evt?.results?.length) {
                    for (const result of evt?.results) {
                        if (result.type === 'graphic') {
                            selectGraphic(result.graphic, 'toggle');
                            break;
                        }
                    }
                } else {
                    clearSelection()
                }
            });
        }
    }

    function startSelectWithCtrl(event) {
        if (event.key === 'Control' && sketchViewModel.state !== 'active') {
            sketchViewModel.create("rectangle");
        }
    }

    function startSelectWithPointer(event) {
        event.stopPropagation();
        if (event.native.ctrlKey && sketchViewModel.state !== 'active') {
            sketchViewModel.create('rectangle');
        }
    }

    function cancelSelect(event) {
        if (event.key === 'Control') {
            sketchViewModel.cancel();
        }
    }

    function clearSelection() {
        for (const layerName in layers) {
            for (const id of layersInfo[layerName].selectedObjectIds.keys()) {
                layersInfo[layerName].selectedObjectIds.get(id)?.highlight?.remove();
                layersInfo[layerName].selectedObjectIds.delete(id);
                document.getElementById(`${layerName}_${id}_FeatureTableCheckbox`)?.removeAttribute('checked');
            }
        }
    }

    initTOC();
});

function selectGraphic(graphic, mode = 'add') {
    let layer;
    let layerName;
    Object.keys(layers).forEach(name => {
        if (layers[name].id === graphic.layer?.id) {
            layer = layers[name];
            layerName = name;
        }
    });
    if (!layer || !layer.visible) {
        return;
    }
    const objectId = graphic.attributes[layer.objectIdField];
    const highlight = layersInfo[layerName].selectedObjectIds.get(objectId)?.highlight;
    if (highlight) {
        if (mode === 'toggle') {
            highlight.remove();
            layersInfo[layerName].selectedObjectIds.delete(objectId);
            document.getElementById(`${layer.id}_${objectId}_FeatureTableCheckbox`)?.removeAttribute('checked');
        }
    } else {
        view.whenLayerView(graphic.layer).then(function (layerView) {
            layersInfo[layerName].selectedObjectIds.set(objectId, {
                highlight: layerView.highlight(graphic),
                graphic: graphic
            });
            document.getElementById(`${layer.id}_${objectId}_FeatureTableCheckbox`)?.setAttribute('checked', 'checked');
        });
    }
}

function initTOC() {
    const tocLayers = document.getElementById('layers');
    tocLayers.innerHTML = '';
    for (const layerName in layers) {
        tocLayers.insertAdjacentHTML('beforeend', `
            <li id="${layerName}" class="layer-name" oncontextmenu="showLayerOptionsMenu(event, '${layerName}')" draggable="true" ondragstart="dragStart(this, event)" ondragover="dragOver(this, event)" ondragenter="dragEnter(this, event)" ondragleave="dragLeave(this, event)" ondrop="dropped(this, event)">
                <input type="checkbox" class="checkbox" checked="checked" onchange="toggleLayer(event, '${layerName}')">
                <div class="symbology" id="${layerName}SymbologyIcon"></div>
                <div class="layer-title">${layers[layerName].title}<span id="${layerName}FeaturesCount"></span></div>
            </li>`);

        globalSymbolUtils.renderPreviewHTML(getLayerSymbol(layers[layerName]), {
            node: document.getElementById(layerName + 'SymbologyIcon'),
            size: {
                width: 24,
                height: 4
            }
        });
        layersInfo[layerName].initialDefinitionExpression = layers[layerName].definitionExpression ?? '';
        setTimeout(() => updateLayerFeaturesCount(layerName), 0);
    }
}

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
            for (const key of Object.keys(layersInfo[activeTocLayer].renderers)) {
                const rendererType = key.ucFirst();
                const symbolsElement = document.getElementById(`pointLayer${rendererType}SymbolSetting`);
                let index = 0
                switch (key) {
                    case 'simple':
                        if (!layersInfo[activeTocLayer].renderers.simple.symbol.font) {
                            layersInfo[activeTocLayer].renderers.simple.symbol.font = {
                                family: "CalciteWebCoreIcons",
                            }
                        }
                        layersInfo[activeTocLayer].renderers.simple.symbol.font.size = document.getElementById(layerName + rendererType + 'PointSize_0').value;
                        layersInfo[activeTocLayer].renderers.simple.symbol.text = document.getElementById(layerName + rendererType + 'Icon_0').value;
                        break;
                    case 'uniqueValue':
                        layersInfo[activeTocLayer].renderers.uniqueValue.field = document.getElementById(layerName + rendererType + 'LayerField').value;
                        layersInfo[activeTocLayer].renderers.uniqueValue.uniqueValueInfos = [];
                        for (const symbolSetting of symbolsElement.children) {
                            const i = symbolSetting.id.split('_')[1];
                            layersInfo[activeTocLayer].renderers.uniqueValue.uniqueValueInfos[index++] = new UniqueValueInfo({
                                value: document.getElementById(layerName + rendererType + 'FieldValue_' + i).value,
                                symbol: {
                                    type: 'text',
                                    text: document.getElementById(layerName + rendererType + 'Icon_' + i).value,
                                    font: {
                                        size: document.getElementById(layerName + rendererType + 'PointSize_' + i).value,
                                        family: "CalciteWebCoreIcons",
                                    },
                                }
                            });
                        }
                        break;
                    case 'classBreaks':
                        layersInfo[activeTocLayer].renderers.classBreaks.field = document.getElementById(layerName + rendererType + 'LayerField').value;
                        layersInfo[activeTocLayer].renderers.classBreaks.classBreakInfos = [];
                        for (const symbolSetting of symbolsElement.children) {
                            const i = symbolSetting.id.split('_')[1];
                            layersInfo[activeTocLayer].renderers.classBreaks.classBreakInfos[index++] = new ClassBreakInfo({
                                minValue: document.getElementById(layerName + rendererType + 'FieldMinValue_' + i).value,
                                maxValue: document.getElementById(layerName + rendererType + 'FieldMaxValue_' + i).value,
                                symbol: {
                                    type: 'text',
                                    text: document.getElementById(layerName + rendererType + 'Icon_' + i).value,
                                    font: {
                                        size: document.getElementById(layerName + rendererType + 'PointSize_' + i).value,
                                        family: "CalciteWebCoreIcons",
                                    },
                                }
                            });
                        }
                        break;
                    case 'heatmap':
                        layersInfo[activeTocLayer].renderers.heatmap.radius = document.getElementById(layerName + rendererType + 'Radius').value;
                        layersInfo[activeTocLayer].renderers.heatmap.minDensity = document.getElementById(layerName + rendererType + 'MinDensity').value;
                        layersInfo[activeTocLayer].renderers.heatmap.maxDensity = document.getElementById(layerName + rendererType + 'MaxDensity').value;
                        layersInfo[activeTocLayer].renderers.heatmap.colorStops = [];
                        for (const colorStop of document.getElementById('pointLayerHeatmapColorStops').children) {
                            const i = colorStop.id.split('_')[1];
                            var opacity = document.getElementById(layerName + rendererType + 'ColorStopColorOpacity_' + i).value;
                            var color = document.getElementById(layerName + rendererType + 'ColorStopColor_' + i).value;
                            layersInfo[activeTocLayer].renderers.heatmap.colorStops[index++] = new HeatmapColorStop({
                                ratio: document.getElementById(layerName + rendererType + 'ColorStopRatio_' + i).value,
                                color: 'rgba(' + parseInt(color.slice(-6, -4), 16) + ',' + parseInt(color.slice(-4, -2), 16) + ',' + parseInt(color.slice(-2), 16) + ',' + opacity + ')',
                            });
                        }
                        break;
                }
            }
            layers[activeTocLayer].renderer = layersInfo[activeTocLayer].renderers[activeModalTab];
            break;
        case 'polylineLayer':
            for (const key of Object.keys(layersInfo[activeTocLayer].renderers)) {
                const rendererType = key.ucFirst();
                const symbolsElement = document.getElementById(`polylineLayer${rendererType}SymbolSetting`);
                let index = 0
                switch (key) {
                    case 'simple':
                        layersInfo[activeTocLayer].renderers.simple.symbol.width = document.getElementById(activeTocLayer + rendererType + 'Thickness_0').value;
                        layersInfo[activeTocLayer].renderers.simple.symbol.color = document.getElementById(activeTocLayer + rendererType + 'Color_0').value;
                        break;
                    case 'uniqueValue':
                        layersInfo[activeTocLayer].renderers.uniqueValue.field = document.getElementById(activeTocLayer + rendererType + 'LayerField').value;
                        layersInfo[activeTocLayer].renderers.uniqueValue.uniqueValueInfos = [];
                        for (const symbolSetting of symbolsElement.children) {
                            const i = symbolSetting.id.split('_')[1];
                            layersInfo[activeTocLayer].renderers.uniqueValue.uniqueValueInfos[index++] = new UniqueValueInfo({
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
                        layersInfo[activeTocLayer].renderers.classBreaks.field = document.getElementById(activeTocLayer + rendererType + 'LayerField').value;
                        layersInfo[activeTocLayer].renderers.classBreaks.classBreakInfos = [];
                        for (const symbolSetting of symbolsElement.children) {
                            const i = symbolSetting.id.split('_')[1];
                            layersInfo[activeTocLayer].renderers.classBreaks.classBreakInfos[index++] = new ClassBreakInfo({
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
            layers[activeTocLayer].renderer = layersInfo[activeTocLayer].renderers[activeModalTab];
            break;
        case 'polygonLayer':
            for (const key of Object.keys(layersInfo[activeTocLayer].renderers)) {
                const rendererType = key.ucFirst();
                const symbolsElement = document.getElementById(`polygonLayer${rendererType}SymbolSetting`);
                let index = 0
                switch (key) {
                    case 'simple':
                        layersInfo[activeTocLayer].renderers.simple.symbol.color = document.getElementById(activeTocLayer + rendererType + 'Background_0').value;
                        layersInfo[activeTocLayer].renderers.simple.symbol.outline.color = document.getElementById(activeTocLayer + rendererType + 'Border_0').value;
                        break;
                    case 'uniqueValue':
                        layersInfo[activeTocLayer].renderers.uniqueValue.field = document.getElementById(activeTocLayer + rendererType + 'LayerField').value;
                        layersInfo[activeTocLayer].renderers.uniqueValue.uniqueValueInfos = [];
                        for (const symbolSetting of symbolsElement.children) {
                            const i = symbolSetting.id.split('_')[1];
                            layersInfo[activeTocLayer].renderers.uniqueValue.uniqueValueInfos[index++] = new UniqueValueInfo({
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
                        layersInfo[activeTocLayer].renderers.classBreaks.field = document.getElementById(activeTocLayer + rendererType + 'LayerField').value;
                        layersInfo[activeTocLayer].renderers.classBreaks.classBreakInfos = [];
                        for (const symbolSetting of symbolsElement.children) {
                            const i = symbolSetting.id.split('_')[1];
                            layersInfo[activeTocLayer].renderers.classBreaks.classBreakInfos[index++] = new ClassBreakInfo({
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
            layers[activeTocLayer].renderer = layersInfo[activeTocLayer].renderers[activeModalTab];
            break;
    }
    document.getElementById(activeTocLayer + 'SymbologyIcon').innerHTML = ''
    globalSymbolUtils.renderPreviewHTML(getLayerSymbol(layers[activeTocLayer]), {
        node: document.getElementById(activeTocLayer + 'SymbologyIcon'),
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
    const geometryType = layers[activeTocLayer].geometryType;
    for (const key of Object.keys(layersInfo[activeTocLayer].renderers)) {
        const renderer = layersInfo[activeTocLayer].renderers[key];
        const rendererType = key.ucFirst();
        const symbolSetting = document.getElementById('pointLayer' + rendererType + 'SymbolSetting');
        switch (renderer.type) {
            case "simple":
                symbolSetting.innerHTML = createPointLayerSymbolFields(0, rendererType);
                document.getElementById(geometryType + 'Layer' + rendererType + 'PointSize_0').value = renderer.symbol?.font?.size;
                document.getElementById(geometryType + 'Layer' + rendererType + 'Icon_0').value = renderer.symbol?.text;
                document.getElementById(geometryType + 'Layer' + rendererType + 'Icon_0').nextElementSibling.classList = document.querySelector('[data-code$=' + renderer.symbol.text?.charCodeAt(0).toString(16) + ']')?.classList;
                break;
            case "unique-value":
                symbolSetting.innerHTML = '';
                if (!document.getElementById(geometryType + 'Layer' + rendererType + 'LayerField')) {
                    symbolSetting.parentElement.prepend(document.createElement('hr'));
                    symbolSetting.parentElement.prepend(createLayerFieldsSelect(layers.pointLayer, geometryType + 'Layer' + rendererType + 'LayerField'));
                }
                document.getElementById(geometryType + 'Layer' + rendererType + 'LayerField').value = renderer.field;
                for (let i = 0; i < renderer.uniqueValueInfos.length; i++) {
                    symbolSetting.insertAdjacentHTML('beforeend', createRendererSymbolSetting(geometryType, rendererType, i));
                    document.getElementById(geometryType + 'Layer' + rendererType + 'FieldValue_' + i).value = renderer.uniqueValueInfos[i].value;
                    document.getElementById(geometryType + 'Layer' + rendererType + 'PointSize_' + i).value = renderer.uniqueValueInfos[i].symbol.font.size;
                    document.getElementById(geometryType + 'Layer' + rendererType + 'Icon_' + i).value = renderer.uniqueValueInfos[i].symbol.text;
                    document.getElementById(geometryType + 'Layer' + rendererType + 'Icon_' + i).nextElementSibling.classList = document.querySelector('[data-code$=' + renderer.uniqueValueInfos[i].symbol.text.charCodeAt(0).toString(16) + ']')?.classList;
                }
                break;
            case "class-breaks":
                symbolSetting.innerHTML = '';
                if (!document.getElementById(geometryType + 'Layer' + rendererType + 'LayerField')) {
                    symbolSetting.parentElement.prepend(document.createElement('hr'));
                    symbolSetting.parentElement.prepend(createLayerFieldsSelect(layers.pointLayer, geometryType + 'Layer' + rendererType + 'LayerField'));
                }
                document.getElementById(geometryType + 'Layer' + rendererType + 'LayerField').value = renderer.field;
                for (let i = 0; i < renderer.classBreakInfos.length; i++) {
                    symbolSetting.insertAdjacentHTML('beforeend', createRendererSymbolSetting(geometryType, rendererType, i));
                    document.getElementById(geometryType + 'Layer' + rendererType + 'FieldMinValue_' + i).value = renderer.classBreakInfos[i].minValue;
                    document.getElementById(geometryType + 'Layer' + rendererType + 'FieldMaxValue_' + i).value = renderer.classBreakInfos[i].maxValue;
                    document.getElementById(geometryType + 'Layer' + rendererType + 'PointSize_' + i).value = renderer.classBreakInfos[i].symbol.font.size;
                    document.getElementById(geometryType + 'Layer' + rendererType + 'Icon_' + i).value = renderer.classBreakInfos[i].symbol.text;
                    document.getElementById(geometryType + 'Layer' + rendererType + 'Icon_' + i).nextElementSibling.classList = document.querySelector('[data-code$=' + renderer.classBreakInfos[i].symbol.text.charCodeAt(0).toString(16) + ']')?.classList;
                }
                break;
            case "heatmap":
                const colorStops = document.getElementById('pointLayerHeatmapColorStops');
                colorStops.innerHTML = '';
                for (let i = 0; i < renderer.colorStops.length; i++) {
                    colorStops.insertAdjacentHTML('beforeend', createHeatmapColorStopSetting(i));
                    document.getElementById(geometryType + 'Layer' + rendererType + 'ColorStopRatio_' + i).value = renderer.colorStops[i].ratio;
                    document.getElementById(geometryType + 'Layer' + rendererType + 'ColorStopColor_' + i).value = renderer.colorStops[i].color.toHex();
                    document.getElementById(geometryType + 'Layer' + rendererType + 'ColorStopColorOpacity_' + i).value = renderer.colorStops[i].color.toRgba()[3];
                    document.getElementById(geometryType + 'Layer' + rendererType + 'Radius').value = renderer.radius;
                    document.getElementById(geometryType + 'Layer' + rendererType + 'MinDensity').value = renderer.minDensity;
                    document.getElementById(geometryType + 'Layer' + rendererType + 'MaxDensity').value = renderer.maxDensity;
                }
        }
    }
    openTab(layers.pointLayer.renderer.type.toPascalCase().lcFirst());
}

function initPolylineLayerModal() {
    const geometryType = layers[activeTocLayer].geometryType;
    for (const key of Object.keys(layersInfo[activeTocLayer].renderers)) {
        const renderer = layersInfo[activeTocLayer].renderers[key];
        const rendererType = key.ucFirst();
        const symbolSetting = document.getElementById('polylineLayer' + rendererType + 'SymbolSetting');
        switch (renderer.type) {
            case "simple":
                symbolSetting.innerHTML = createPolylineLayerSymbolFields(0, rendererType);
                document.getElementById(geometryType + 'Layer' + rendererType + 'Thickness_0').value = renderer.symbol.width;
                document.getElementById(geometryType + 'Layer' + rendererType + 'Color_0').value = renderer.symbol.color.toHex();
                break;
            case "unique-value":
                symbolSetting.innerHTML = '';
                if (!document.getElementById(geometryType + 'Layer' + rendererType + 'LayerField')) {
                    symbolSetting.parentElement.prepend(document.createElement('hr'));
                    symbolSetting.parentElement.prepend(createLayerFieldsSelect(layers.polylineLayer, geometryType + 'Layer' + rendererType + 'LayerField'));
                }
                document.getElementById(geometryType + 'Layer' + rendererType + 'LayerField').value = renderer.field;
                for (let i = 0; i < renderer.uniqueValueInfos.length; i++) {
                    symbolSetting.insertAdjacentHTML('beforeend', createRendererSymbolSetting(geometryType, rendererType, i));
                    document.getElementById(geometryType + 'Layer' + rendererType + 'FieldValue_' + i).value = renderer.uniqueValueInfos[i].value;
                    document.getElementById(geometryType + 'Layer' + rendererType + 'Thickness_' + i).value = renderer.uniqueValueInfos[i].symbol.width;
                    document.getElementById(geometryType + 'Layer' + rendererType + 'Color_' + i).value = renderer.uniqueValueInfos[i].symbol.color.toHex();
                }
                break;
            case "class-breaks":
                symbolSetting.innerHTML = '';
                if (!document.getElementById(geometryType + 'Layer' + rendererType + 'LayerField')) {
                    symbolSetting.parentElement.prepend(document.createElement('hr'));
                    symbolSetting.parentElement.prepend(createLayerFieldsSelect(layers.polylineLayer, geometryType + 'Layer' + rendererType + 'LayerField'));
                }
                document.getElementById(geometryType + 'Layer' + rendererType + 'LayerField').value = renderer.field;
                for (let i = 0; i < renderer.classBreakInfos.length; i++) {
                    symbolSetting.insertAdjacentHTML('beforeend', createRendererSymbolSetting(geometryType, rendererType, i));
                    document.getElementById(geometryType + 'Layer' + rendererType + 'FieldMinValue_' + i).value = renderer.classBreakInfos[i].minValue;
                    document.getElementById(geometryType + 'Layer' + rendererType + 'FieldMaxValue_' + i).value = renderer.classBreakInfos[i].maxValue;
                    document.getElementById(geometryType + 'Layer' + rendererType + 'Thickness_' + i).value = renderer.classBreakInfos[i].symbol.width;
                    document.getElementById(geometryType + 'Layer' + rendererType + 'Color_' + i).value = renderer.classBreakInfos[i].symbol.color.toHex();
                }
                break;
        }
    }
    openTab(layers.polylineLayer.renderer.type.toPascalCase().lcFirst());
}

function initPolygonLayerModal() {
    const geometryType = layers[activeTocLayer].geometryType;
    for (const key of Object.keys(layersInfo[activeTocLayer].renderers)) {
        const renderer = layersInfo[activeTocLayer].renderers[key];
        const rendererType = key.ucFirst();
        const symbolSetting = document.getElementById('polygonLayer' + rendererType + 'SymbolSetting');
        switch (renderer.type) {
            case "simple":
                symbolSetting.innerHTML = createPolygonLayerSymbolFields(0, rendererType);
                document.getElementById(geometryType + 'Layer' + rendererType + 'Background_0').value = renderer.symbol.color.toHex();
                document.getElementById(geometryType + 'Layer' + rendererType + 'Border_0').value = renderer.symbol.outline.color.toHex();
                break;
            case "unique-value":
                symbolSetting.innerHTML = '';
                if (!document.getElementById(geometryType + 'Layer' + rendererType + 'LayerField')) {
                    symbolSetting.parentElement.prepend(document.createElement('hr'));
                    symbolSetting.parentElement.prepend(createLayerFieldsSelect(layers.polygonLayer, geometryType + 'Layer' + rendererType + 'LayerField'));
                }
                document.getElementById(geometryType + 'Layer' + rendererType + 'LayerField').value = renderer.field;
                for (let i = 0; i < renderer.uniqueValueInfos.length; i++) {
                    symbolSetting.insertAdjacentHTML('beforeend', createRendererSymbolSetting(geometryType, rendererType, i));
                    document.getElementById(geometryType + 'Layer' + rendererType + 'FieldValue_' + i).value = renderer.uniqueValueInfos[i].value;
                    document.getElementById(geometryType + 'Layer' + rendererType + 'Background_' + i).value = renderer.uniqueValueInfos[i].symbol.color.toHex();
                    document.getElementById(geometryType + 'Layer' + rendererType + 'Border_' + i).value = renderer.uniqueValueInfos[i].symbol.outline.color.toHex();
                }
                break;
            case "class-breaks":
                symbolSetting.innerHTML = '';
                if (!document.getElementById(geometryType + 'Layer' + rendererType + 'LayerField')) {
                    symbolSetting.parentElement.prepend(document.createElement('hr'));
                    symbolSetting.parentElement.prepend(createLayerFieldsSelect(layers.polygonLayer, geometryType + 'Layer' + rendererType + 'LayerField'));
                }
                document.getElementById(geometryType + 'Layer' + rendererType + 'LayerField').value = renderer.field;
                for (let i = 0; i < renderer.classBreakInfos.length; i++) {
                    symbolSetting.insertAdjacentHTML('beforeend', createRendererSymbolSetting(geometryType, rendererType, i));
                    document.getElementById(geometryType + 'Layer' + rendererType + 'FieldMinValue_' + i).value = renderer.classBreakInfos[i].minValue;
                    document.getElementById(geometryType + 'Layer' + rendererType + 'FieldMaxValue_' + i).value = renderer.classBreakInfos[i].maxValue;
                    document.getElementById(geometryType + 'Layer' + rendererType + 'Background_' + i).value = renderer.classBreakInfos[i].symbol.color.toHex();
                    document.getElementById(geometryType + 'Layer' + rendererType + 'Border_' + i).value = renderer.classBreakInfos[i].symbol.outline.color.toHex();
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

function createRendererSymbolSetting(geometryType, rendererType, index) {
    const fieldValue = window[`create${rendererType.ucFirst()}RendererFieldValue`](geometryType + 'Layer', index);
    const symbolFields = window[`create${geometryType.ucFirst()}LayerSymbolFields`](index, rendererType.ucFirst());
    const deleteSymbolSettingButton = createDeleteSymbolSettingButton();
    return `<div class="symbol-setting" id="${geometryType}Layer${rendererType}SymbolSetting_${index}">${fieldValue}${symbolFields}${deleteSymbolSettingButton}</div>`
}

function addSymbol(layerName, rendererType) {
    const symbolSetting = document.getElementById(`${layerName}${rendererType.ucFirst()}SymbolSetting`);
    const lastSymbolSetting = symbolSetting.lastChild;
    const index = lastSymbolSetting ? Number(lastSymbolSetting.id.split('_')[1]) + 1 : 0;
    const geometryType = layerName.replace('Layer', '');
    symbolSetting.insertAdjacentHTML('beforeend', createRendererSymbolSetting(geometryType, rendererType, index));
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

function dismissMenu(id = 'layerOptionMenuContainer') {
    const menuContainer = document.getElementById(id);
    menuContainer.style.display = 'none';
}

function saveLayerLabel() {
    if (!layers[activeTocLayer].labelingInfo?.length) {
        layers[activeTocLayer].labelingInfo = [{}];
    }
    layers[activeTocLayer].labelingInfo[0].labelExpression = document.getElementById('layerLabelFreeText').value;
    layers[activeTocLayer].labelingInfo[0].symbol.color = document.getElementById('layerLabelTextColor').value;
    layers[activeTocLayer].labelingInfo[0].symbol.font.size = document.getElementById('layerLabelTextSize').value;
    layers[activeTocLayer].labelingInfo[0].symbol.font.weight = document.getElementById('layerLabelTextStyle').value;
    layers[activeTocLayer].labelingInfo[0].labelPlacement = document.getElementById('layerLabelRelativeLocation').value;
    const field = document.getElementById('layerLabelField').value;
    if (field) {
        layers[activeTocLayer].labelingInfo[0].labelExpressionInfo = {expression: field};
    } else {
        layers[activeTocLayer].labelingInfo[0].labelExpressionInfo = {expression: "return " + "\"" + document.getElementById('layerLabelFreeText').value + "\""};
    }
    closeModal('layerLabelModal');
}

function openLayerOptionModal() {
    const labelInfo = layers[activeTocLayer].labelingInfo?.length ? layers[activeTocLayer].labelingInfo[0] : {};
    const fields = layers[activeTocLayer].fields;

    document.getElementById('layerLabelFreeText').value = labelInfo.labelExpression;
    document.getElementById('layerLabelTextColor').value = labelInfo.symbol?.color?.toHex();
    document.getElementById('layerLabelTextSize').value = labelInfo.symbol?.font?.size;
    document.getElementById('layerLabelTextStyle').value = labelInfo.symbol?.font?.weight;
    const relativeLocationSelect = document.getElementById('layerLabelRelativeLocation');
    relativeLocationSelect.innerHTML = '';
    labelPlacement[layers[activeTocLayer].geometryType].forEach((placement) => {
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
    window['init' + layers[activeTocLayer].geometryType.ucFirst() + 'LayerModal']();
    openModal(layers[activeTocLayer].geometryType + 'LayerSymbologyModal');
}

function openSelectedObjectsModal() {
    const table = document.getElementById('selectedObjectTable');
    table.innerHTML = '';
    for (const layerName in layersInfo) {
        if (layersInfo[layerName].selectedObjectIds.size > 0) {
            for (const selectedObject of layersInfo[layerName].selectedObjectIds.values()) {
                const tr = document.createElement('tr');
                const objectIdTd = document.createElement('td');
                objectIdTd.innerHTML = selectedObject.graphic.attributes[layers[layerName].objectIdField];
                const layerNameTd = document.createElement('td');
                layerNameTd.innerHTML = selectedObject.graphic.layer.title;
                const attributeTd = document.createElement('td');
                attributeTd.innerHTML = `<pre>${JSON.stringify(selectedObject.graphic.attributes, null, 2)}</pre>`;
                tr.append(objectIdTd);
                tr.append(layerNameTd);
                tr.append(attributeTd);
                table.append(tr);
            }
        }
    }
    openModal('selectedObjectsModal');
}

function confirmDeleteLayer() {
    const result = confirm('Are you sure to delete layer?');
    if (!result) {
        return;
    }
    removeLayerFromTimeSlider(activeTocLayer);
    setTimeout(() => {
        layers[activeTocLayer].destroy();
        delete layers[activeTocLayer];
        delete layersInfo[activeTocLayer];
        initTOC();
    }, 1);
}

function addLayerToTimeSlider() {
    if (!timeSliderLayers.includes(activeTocLayer)) {
        timeSliderLayers.push(activeTocLayer);
        timeSliderCheckedLayers.push(activeTocLayer);
        document.getElementById("timeSliderLayers").insertAdjacentHTML("beforeend", `<li id="${activeTocLayer}TimeSliderLayer"><label><input type="checkbox" checked onchange="this" onclick="toggleTimeSliderCheckedLayer('${activeTocLayer}')"> ${layers[activeTocLayer].title}</label> <button class="esri-widget--button" title="Delete" onclick="removeLayerFromTimeSlider('${activeTocLayer}')"><div class="esri-icon-trash"></div></button></li>`);
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
    if (!timeSliderLayers.includes(layerName)) {
        return;
    }
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
        if (layers[timeSliderLayer].fullTimeExtent?.start && absoluteStart > layers[timeSliderLayer].fullTimeExtent.start) {
            absoluteStart = layers[timeSliderLayer].fullTimeExtent.start;
        }
        if (layers[timeSliderLayer].fullTimeExtent?.end && absoluteEnd < layers[timeSliderLayer].fullTimeExtent.end) {
            absoluteEnd = layers[timeSliderLayer].fullTimeExtent.end;
        }
    }
    if (absoluteStart === Number.MAX_VALUE || absoluteEnd === 0) {
        return;
    }
    timeSlider.fullTimeExtent = {
        start: absoluteStart,
        end: absoluteEnd,
    };
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
                const featuresCountPlaceholder = document.getElementById(layerName + 'FeaturesCount');
                if (featuresCountPlaceholder) {
                    featuresCountPlaceholder.innerHTML = ' (' + result.features.length + ')';
                }
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
    const modal = document.getElementById(layers[activeTocLayer].geometryType + 'LayerSymbologyModal');
    for (let el of modal.getElementsByClassName('renderer-setting')) {
        el.classList.add('hidden');
    }
    for (let el of modal.getElementsByClassName('tab-button')) {
        el.classList.remove('tab-button-active');
    }
    const button = document.getElementById(layers[activeTocLayer].geometryType + 'LayerButtonOpenTab' + tab.ucFirst())
    button.classList.add('tab-button-active');
    document.getElementById(layers[activeTocLayer].geometryType + 'Layer' + tab.ucFirst() + 'RendererSetting').classList.remove('hidden');
}

function openSelectIconModal(inputId) {
    activeIconInput = inputId;
    if (document.getElementById(activeIconInput).value !== 'undefined') {
        document.querySelector('[data-code$=' + document.getElementById(activeIconInput).value.charCodeAt(0).toString(16) + ']')?.classList.add('active-icon')
    }
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

function dragElement(elmnt, draggable) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (draggable) {
        elmnt.querySelector(draggable).onmousedown = dragMouseDown;
    } else {
        elmnt.onmousedown = dragMouseDown;
    }

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

function showContextMenu(event, menuId) {
    event.preventDefault();
    const menuContainer = document.getElementById(menuId + 'Container');
    menuContainer.style.display = 'block';
    const menu = document.getElementById(menuId);
    menu.style.top = event.y - menu.offsetHeight + 'px';
    menu.style.left = event.x + 'px';
}

function showAddFeatureToLayerModal() {
    const select = document.getElementById('addFeatureToLayerSelect');
    select.innerHTML = '';
    const validLayers = [];
    for (const layer of Object.keys(layers)) {
        if (layers[layer].geometryType !== selectedSketchGraphic.geometry.type) {
            continue;
        }
        validLayers.push(layer);
        const option = document.createElement('option');
        option.value = layer;
        option.innerHTML = layers[layer].title;
        select.append(option);
    }
    if (validLayers?.length > 0) {
        addFeatureCreateFields(validLayers[0]);
        openModal('addFeatureToLayerModal');
    } else {
        alert('No valid layer found to add this graphic to it.')
    }
}

function addFeatureCreateFields(layerName) {
    const fieldsContainer = document.getElementById('addFeatureFields');
    fieldsContainer.innerHTML = '';
    for (const layerField of layers[layerName].fields) {
        if (supportedFeatureFieldTypes.includes(layerField.type)) {
            let inputType = 'text';
            switch (layerField.type) {
                case 'small-integer':
                case 'integer':
                case 'single':
                case 'double':
                case 'long':
                    inputType = 'number';
                    break;
                case 'date':
                    inputType = 'date';
                    break;

            }
            fieldsContainer.insertAdjacentHTML('beforeend', ` <div class="form-field"> <label> ${layerField.name.ucFirst()}: <input id="addFeatureField_${layerField.name}" type="${inputType}" required /> </label> </div> `);
        }
    }
}

function addToGraphicToLayer() {
    const layerName = document.getElementById('addFeatureToLayerSelect').value;
    if (layers[layerName].geometryType !== selectedSketchGraphic.geometry.type) {
        alert('Selected layer is not compatible with selected sketch graphic!');
        return;
    }
    const featureAttributes = {};
    let time;
    for (const layerField of layers[layerName].fields) {
        if (supportedFeatureFieldTypes.includes(layerField.type)) {
            let value = document.getElementById(`addFeatureField_${layerField.name}`).value;
            if (!value) {
                alert('Please fill all the fields');
                return;
            }
            if (layerField.type === 'date') {
                value = new Date(value).getTime();
                if (layerField.name === 'time') {
                    time = value;
                }
            }
            featureAttributes[layerField.name] = value;
        }
    }
    layers[layerName].applyEdits({
            addFeatures: [
                {
                    geometry: selectedSketchGraphic.geometry,
                    attributes: featureAttributes,
                }
            ]
        }
    ).then(() => {
        if (time) {
            if (time > layers[layerName].fullTimeExtent.end) {
                layers[layerName].fullTimeExtent.end = time + 31556926000;//add one year to time extent for better result on timeSlider
            }
            if (time < layers[layerName].fullTimeExtent.start) {
                layers[layerName].fullTimeExtent.start = time - 31556926000;//subtract one year from time extent for better result on timeSlider
            }
        }
        updateLayerFeaturesCount(layerName);
        calcTimeSliderTimeExtent();
    });

    closeModal('addFeatureToLayerModal');
}

function addLayer() {
    let layer;
    switch (document.getElementById('addLayerBy').value) {
        case 'url':
            const url = document.getElementById('addLayerUrl').value;
            layer = new FeatureLayer({
                url: url
            });
            break;
        case 'portalItemId':
            const portalItemId = document.getElementById('addLayerPortalItemId').value;
            layer = new FeatureLayer({
                portalItem: {
                    id: portalItemId
                }
            });
            break;
    }
    if (layer) {
        layers[layer.id] = layer;
        layer.load().then(function () {
            map.layers.add(layer);
            initLayerInfo(layer);
            initTOC();
        });
        layer.on("edits", function (event) {
            recreateFeatureTable(layer);
        });
        closeModal('addLayerModal');
    }
}

function initLayerInfo(layer) {
    layersInfo[layer.id] = {
        title: layer.title,
        selectedObjectIds: new Map(),
        initialDefinitionExpression: layer.definitionExpression ?? '',
        renderers: {...layersRenderer[layer.geometryType + 'Renderers']},
        template: {...layersTemplate[layer.geometryType + 'Template']},
    };
    layersInfo[layer.id].renderers[layer.renderer.type] = layer.renderer;
}

function showAddLayerField(type) {
    switch (type) {
        case 'url':
            document.getElementById('addLayerUrlField').style.display = 'block';
            document.getElementById('addLayerPortalItemIdField').style.display = 'none';
            break;
        case 'portalItemId':
            document.getElementById('addLayerUrlField').style.display = 'none';
            document.getElementById('addLayerPortalItemIdField').style.display = 'block';
            break;
    }
}

function showAttributeTable() {
    if (!isAttributeTablesShow) {
        isAttributeTablesShow = true;
        document.getElementById('viewDiv').classList.add('h70');
        document.getElementById('featureTables').classList.add('h30');
    }
    const layer = layers[activeTocLayer];
    createFeatureTable(layer);
}

function hideAttributeTable() {
    isAttributeTablesShow = false;
    document.getElementById('viewDiv').classList.remove('h70');
    document.getElementById('featureTables').classList.remove('h30');
}

function createFeatureTable(layer) {
    const tableId = layer.id + 'FeatureTableContainer';
    const tablesContainer = document.getElementById('featureTablesContainer');
    const container = document.createElement('div');
    container.classList.add('feature-table-container');
    container.setAttribute('id', tableId);
    const table = generateFeatureTable(layer);
    container.append(table);
    tablesContainer.append(container);
    createFeatureTableTab(layer);
}

function recreateFeatureTable(layer) {
    const tableContainerId = layer.id + 'FeatureTableContainer';
    const table = generateFeatureTable(layer);
    const container = document.getElementById(tableContainerId);
    container.innerHTML = '';
    container.append(table);
}

function generateFeatureTable(layer) {
    const tableId = layer.id + 'FeatureTableContainerTable';
    const table = document.createElement('table');
    table.setAttribute('id', tableId)
    const tHead = document.createElement('thead');
    const headRow = document.createElement('tr');
    headRow.append(document.createElement('th'));
    for (const field of layer.fields) {
        const th = document.createElement('th');
        th.classList.add('cur-pointer');
        th.onclick = () => {
            sortTable(table, layer.fields.indexOf(field) + 1);
        }
        th.innerHTML = field.name;
        headRow.append(th);
    }
    tHead.append(headRow);
    table.append(tHead);
    const tBody = document.createElement('tbody');
    layer
        .queryFeatures(layer.createQuery())
        .then((result) => {
                for (const item of result.features) {
                    const row = document.createElement('tr');
                    row.classList.add('cur-pointer');
                    row.ondblclick = () => {
                        view.goTo(item);
                    };
                    const checkBoxTd = document.createElement('td');
                    const checkBox = document.createElement('input');
                    const objectId = item.attributes[layer.objectIdField];
                    checkBox.setAttribute('id', `${layer.id}_${objectId}_FeatureTableCheckbox`);
                    checkBox.setAttribute('type', 'checkbox');
                    const highlight = layersInfo[layer.id].selectedObjectIds.get(objectId)?.highlight;
                    if (highlight) {
                        checkBox.setAttribute('checked', 'checked');
                    }
                    checkBox.onclick = () => {
                        selectGraphic(item, 'toggle');
                    };
                    checkBoxTd.append(checkBox);
                    row.append(checkBoxTd);
                    for (const attributeKey in item.attributes) {
                        const td = document.createElement('td');
                        td.innerHTML = item.attributes[attributeKey];
                        row.append(td);
                    }
                    tBody.append(row);
                }
            }
        );
    table.append(tBody);
    return table;
}

const shownFeatureTableLayers = [];

function createFeatureTableTab(layer) {
    const tabId = layer.id + 'FeatureTableTab';
    if (document.getElementById(tabId)) {
        activateFeatureTableTab(layer);
        return;
    }
    const tabs = document.getElementById('featureTablesTabs');
    const tab = document.createElement('div');
    tab.classList.add('feature-table-tab');
    tab.dataset.layerId = layer.id;
    tab.onclick = (event) => {
        activateFeatureTableTab(layer);
    };

    tab.setAttribute('id', tabId);
    const closeButton = document.createElement('span');
    closeButton.innerHTML = '&times;'
    closeButton.classList.add('feature-table-tab-close');
    closeButton.onclick = (event) => {
        event.stopPropagation();
        document.getElementById(tabId)?.remove();
        document.getElementById(layer.id + 'FeatureTableContainer')?.remove();
        shownFeatureTableLayers.splice(shownFeatureTableLayers.indexOf(layer.id), 1);
        if (shownFeatureTableLayers.length === 0) {
            hideAttributeTable();
        }
    }
    tab.append(closeButton);
    const title = document.createElement('div');
    title.innerHTML = layer.title;
    tab.append(title);
    tabs.append(tab);
    activateFeatureTableTab(layer);
    shownFeatureTableLayers.push(layer.id)
}

function activateFeatureTableTab(layer) {
    document.getElementsByClassName('feature-table-tab-active')?.item(0)?.classList.remove('feature-table-tab-active');
    document.getElementsByClassName('feature-table-container-active')?.item(0)?.classList.remove('feature-table-container-active');
    const tabId = layer.id + 'FeatureTableTab';
    const tableId = layer.id + 'FeatureTableContainer';
    const tab = document.getElementById(tabId);
    const table = document.getElementById(tableId);
    tab.classList.add('feature-table-tab-active');
    table.classList.add('feature-table-container-active');
}

function sortTable(table, n) {
    var rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc";
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /*check if the two rows should switch place,
            based on the direction, asc or desc:*/
            if (dir === "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } else if (dir === "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            //Each time a switch is done, increase this count by 1:
            switchcount++;
        } else {
            /*If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again.*/
            if (switchcount === 0 && dir === "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}