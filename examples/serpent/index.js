import { HeatmapGL } from "../../src";

var heatmapGL = new HeatmapGL(document.getElementsByClassName("container")[0])

heatmapGL.gradient = [{
    color: [0, 0, 0, 1],
    offset: 0
}, {
    color: [0, 0, 255, 1],
    offset: 100
}, {
    color: [0, 255, 0, 1],
    offset: 200
}, {
    color: [255, 255, 0, 1.0],
    offset: 300
}, {
    color: [255, 0, 0, 1.0],
    offset: 400
}];


function normalCurve(i, maxValue, mean, stdDev) {
    return maxValue / Math.pow(Math.E, (Math.pow(i - mean, 2)) / (2 * stdDev * stdDev));
}

function smoothNoise(seed, min, max, step = null) {
    const range = max - min;
    var value =
        Math.sin((seed + 53551) * 0.0174533) * (range) +
        Math.sin((seed + 12689) * 0.0174533 * 0.5) * (range) +
        Math.sin((seed + 46457) * 0.0174533 * 0.25) * (range) +
        Math.sin((seed + 70919) * 0.0174533 * 0.125) * (range) +
        Math.sin((seed + 98641) * 0.0174533 * 0.0625) * (range);

    if (step !== null) {
        value = Math.floor(value / step) * step;
    }

    return (min + max) / 2 + value / 5;
}

var fpsCounter = document.getElementsByClassName("fps")[0];

var width = 400; // TODO account for non even dimensions
var height = 400;
var lastCount = 0;

var lastLoop = new Date();
var step = () => {

    var rowData = Array(width);
    for (var x = 0; x < width; x++) {
        rowData[x] = normalCurve(x, 400, smoothNoise(lastCount * 0.5, 100, 300), smoothNoise(lastCount * 2 + 9832569, 10, 20)) * (Math.random())
    }

    heatmapGL.addRow(rowData, height, "start");
    // heatmapGL.transposed = true; // makes the serpent horizontal
    heatmapGL.render();

    var thisLoop = new Date();
    var fps = 1000 / (thisLoop - lastLoop);
    fpsCounter.innerHTML = fps.toFixed(2);
    lastLoop = thisLoop;
    lastCount++;

    requestAnimationFrame(step);
};

requestAnimationFrame(step);