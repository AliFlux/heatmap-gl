var spectralHeatmap = new SpectralHeatmap(document.getElementsByClassName("container")[0])

spectralHeatmap.gradient = [{
    color: [0, 0, 0, 1],
    offset: 0
}, {
    color: [0, 0, 255, 1],
    offset: 2000
}, {
    color: [0, 255, 0, 1],
    offset: 2400
}, {
    color: [255, 255, 0, 1.0],
    offset: 6500
}, {
    color: [255, 0, 0, 1.0],
    offset: 10000
}];

var fpsCounter = document.getElementsByClassName("fps")[0];

var width = 400; // TODO account for non power of 2 data
var height = 400;
// var data = Array(width * height);

// var i = 0;
// for (var x = 0; x < width; x++) {
//     for (var y = 0; y < height; y++) {
//         data[i++] = Math.random() * 10000;
//     }
// }


// spectralHeatmap.width = width;
// spectralHeatmap.height = height;
// spectralHeatmap.data = data;

var lastLoop = new Date();
var step = () => {

    // console.log(spectralHeatmap);

    var rowData = Array(width);
    for (var x = 0; x < width; x++) {
        rowData[x] = 0000 + Math.random() * 10000;
    }

    spectralHeatmap.addRow(rowData, height, "start");

    spectralHeatmap.render();

    var thisLoop = new Date();
    var fps = 1000 / (thisLoop - lastLoop);
    fpsCounter.innerHTML = fps.toFixed(2);
    lastLoop = thisLoop;

    window.requestAnimationFrame(step);
};

this.requestAnimationFrame(step);