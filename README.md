# Heatmap-GL

**WebGL2 powered fast heatmaps for spectrograms, analytics, scientific computing and more**

<p align="center">
  <img src="images/pulse.gif" width="200" height="200">
  <img src="images/serpent.gif" width="200" height="200">
</p>

<p align="center">
  <img src="images/random.gif" width="200" height="200">
  <img src="images/interactive.gif" width="200" height="200">
</p>

## Install

**Just fetch this from npm via command line**

```sh
npm install heatmap-gl
```

## How to use

```js

import { HeatmapGL } from "heatmap-gl";

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

There are lots of heatmaps for javascript. Almost all of them are just for user tracking (they only support drawing circles). I created a general purpose heatmap library that can accept raw data and be used for all sort of scientific and medical applications.

## Stay In Touch

For latest releases and announcements, check out my site: [aliashraf.net](http://aliashraf.net)

## License

This software is released under the [MIT License](LICENSE). Please read LICENSE for information on the
software availability and distribution.

Copyright (c) 2022 [Ali Ashraf](http://aliashraf.net)