import { HeatmapGL } from "../../src";

const container = document.getElementsByClassName("container")[0];
var heatmapGL = new HeatmapGL(container)

heatmapGL.gradient = [{
    color: [255, 255, 255, 0],
    offset: 0
}, {
    color: [224, 249, 18, 0.33],
    offset: 0.33
}, {
    color: [255, 166, 0, 0.66],
    offset: 0.66
}, {
    color: [253, 107, 29, 1],
    offset: 1
}];

var width = 128; // TODO account for non even dimensions
var height = 128;
var size = 10;

heatmapGL.width = width;
heatmapGL.height = height;

var data = Array(width * height);
for (var i = 0; i < data.length; i++) {
    data[i] = 0;
}

heatmapGL.data = data;
heatmapGL.render();

container.addEventListener('mousemove', (e) => {

    var picked = heatmapGL.pick(e.clientX, e.clientY);

    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {

            const c = x + y * width;

            var distance = 1 - Math.sqrt(Math.pow(x - picked.x, 2) + Math.pow(y - picked.y, 2)) / size;
            if (distance > 0 && distance < 1) {
                data[c] = Math.min(data[c] + distance / 15, 1);
            }
        }
    }

    heatmapGL.data = data;
    heatmapGL.render();

});