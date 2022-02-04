import { HeatmapGL } from "../../src";

var heatmapGL = new HeatmapGL(document.getElementsByClassName("container")[0])

heatmapGL.gradient = [{
    color: [0, 0, 0, 1],
    offset: 0
}, {
    color: [255, 255, 255, 1.0],
    offset: 10000
}];

var fpsCounter = document.getElementsByClassName("fps")[0];

var width = 512; // TODO account for non even dimensions
var height = 512;
var lastCount = 0;

var lastLoop = new Date();
var step = () => {

    var data = Array(width * height);

    var i = 0;
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            data[i++] = Math.random() * 10000;
        }
    }


    heatmapGL.width = width;
    heatmapGL.height = height;
    heatmapGL.data = data;
    heatmapGL.render();

    var thisLoop = new Date();
    var fps = 1000 / (thisLoop - lastLoop);
    fpsCounter.innerHTML = fps.toFixed(2);
    lastLoop = thisLoop;
    lastCount++;

    requestAnimationFrame(step);
};

requestAnimationFrame(step);