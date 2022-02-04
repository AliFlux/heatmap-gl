import { HeatmapGL } from "../../src";

var heatmapGL = new HeatmapGL(document.getElementsByClassName("container")[0])

heatmapGL.gradient = [{
    color: [84, 33, 119, 1],
    offset: 0
}, {
    color: [253, 29, 29, 1],
    offset: 100
}, {
    color: [255, 166, 0, 1],
    offset: 200
}, {
    color: [224, 249, 18, 1],
    offset: 300
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

var width = 128; // TODO account for non even dimensions
var height = 128;
var maxValue = 300;
var lastCount = 0;

var lastLoop = new Date();
var step = () => {

    var data = Array(width * height);

    var i = 0;
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            const offsetX = smoothNoise(lastCount, 0.2, 0.8);
            const offsetY = smoothNoise(lastCount + 392759237, 0.2, 0.8);
            const size = smoothNoise(lastCount + 2473214, 0.01, 0.2);
            data[i++] = normalCurve(x / width, 1, offsetX, size) * normalCurve(y / height, 1, offsetY, size) * maxValue;
        }
    }

    lastCount++;


    heatmapGL.width = width;
    heatmapGL.height = height;
    heatmapGL.data = data;
    heatmapGL.render();

    var thisLoop = new Date();
    var fps = 1000 / (thisLoop - lastLoop);
    fpsCounter.innerHTML = fps.toFixed(2);
    lastLoop = thisLoop;

    requestAnimationFrame(step);
};

requestAnimationFrame(step);