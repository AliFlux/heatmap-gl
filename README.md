# Heatmap-GL

**WebGL 2.0 powered fast heatmaps for spectrograms, analytics, scientific computing and more**

<p align="center">
  <img src="images/pulse.gif" width="200" height="200">
  <img src="images/serpent.gif" width="200" height="200">
</p>

<p align="center">
  <img src="images/random.gif" width="200" height="200">
  <img src="images/interactive.gif" width="200" height="200">
</p>


## Install via npm

```sh
npm install heatmap-gl
```

And then in your code:

```js
import { HeatmapGL } from "heatmap-gl";
```

## Install via `<script>` tag from CDN

```html
<script src="view-source:https://unpkg.com/heatmap-gl@1.0.2/dist/heatmap-gl.js"></script>
```

And then in your code:

```js
var HeatmapGL = new window["heatmap-gl"].HeatmapGL;
```

## How to use

```js
var heatmapGL = new HeatmapGL(someDomElement)

// specify gradient
heatmapGL.gradient = [
    {
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
    }
];

// make random data
var width = 512;
var height = 512;

var data = Array(width * height);

var i = 0;
for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
        data[i++] = Math.random() * 300; // set your values here
    }
}

// set data and render
heatmapGL.width = width;
heatmapGL.height = height;
heatmapGL.data = data;
heatmapGL.render();
```

Explore the [examples directory](/examples) for demos that you can run on your browser.

## Purpose

There are lots of heatmaps for javascript. Almost all of them are just for user tracking (they only support drawing points/circles). I created a general purpose heatmap library that can accept raw 2D data and can be used for all sorts of scientific and medical applications.

## Stay in touch

For latest releases and announcements, check out my site: [aliashraf.net](http://aliashraf.net)

## License

This software is released under the [MIT License](LICENSE). Please read LICENSE for information on the
software availability and distribution.

Copyright (c) 2022 [Ali Ashraf](http://aliashraf.net)