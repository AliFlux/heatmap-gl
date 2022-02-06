/*
 * Copyright 2021, GFXFundamentals.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of GFXFundamentals. nor the names of his
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

const webglUtils = {

    /**
     * Loads a shader.
     * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
     * @param {string} shaderSource The shader source.
     * @param {number} shaderType The type of shader.
     * @return {WebGLShader} The created shader.
     */
    loadShader(gl, shaderSource, shaderType) {
        // Create the shader object
        const shader = gl.createShader(shaderType);

        // Load the shader source
        gl.shaderSource(shader, shaderSource);

        // Compile the shader
        gl.compileShader(shader);

        // Check the compile status
        const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
            // Something went wrong during compilation; get the error
            const lastError = gl.getShaderInfoLog(shader);
            throw new Error(`Error compiling shader: ${lastError}`);
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    },

    /**
     * Creates a program, attaches shaders, binds attrib locations, links the
     * program and calls useProgram.
     * @param {WebGLShader[]} shaders The shaders to attach
     * @param {string[]} [opt_attribs] An array of attribs names. Locations will be assigned by index if not passed in
     * @param {number[]} [opt_locations] The locations for the. A parallel array to opt_attribs letting you assign locations.
     * @memberOf module:webgl-utils
     */
    createProgram(
        gl, shaders, opt_attribs, opt_locations) {
        const program = gl.createProgram();
        shaders.forEach(function(shader) {
            gl.attachShader(program, shader);
        });
        if (opt_attribs) {
            opt_attribs.forEach(function(attrib, ndx) {
                gl.bindAttribLocation(
                    program,
                    opt_locations ? opt_locations[ndx] : ndx,
                    attrib);
            });
        }
        gl.linkProgram(program);

        // Check the link status
        const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!linked) {
            // something went wrong with the link
            const lastError = gl.getProgramInfoLog(program);
            throw new Error(`Error in program linking: ${lastError}`)
            gl.deleteProgram(program);
            return null;
        }
        return program;
    },

    /**
     * Loads a shader from a script tag.
     * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
     * @param {string} scriptId The id of the script tag.
     * @param {number} opt_shaderType The type of shader. If not passed in it will
     *     be derived from the type of the script tag.
     * @return {WebGLShader} The created shader.
     */
    createShaderFromScript(
        gl, scriptId, opt_shaderType) {
        let shaderSource = "";
        let shaderType;
        const shaderScript = document.getElementById(scriptId);
        if (!shaderScript) {
            throw ("*** Error: unknown script element" + scriptId);
        }
        shaderSource = shaderScript.text;

        if (!opt_shaderType) {
            if (shaderScript.type === "x-shader/x-vertex") {
                shaderType = gl.VERTEX_SHADER;
            } else if (shaderScript.type === "x-shader/x-fragment") {
                shaderType = gl.FRAGMENT_SHADER;
            } else if (shaderType !== gl.VERTEX_SHADER && shaderType !== gl.FRAGMENT_SHADER) {
                throw ("*** Error: unknown shader type");
            }
        }

        return webglUtils.loadShader(
            gl, shaderSource, opt_shaderType ? opt_shaderType : shaderType);
    },

    defaultShaderType: [
        "VERTEX_SHADER",
        "FRAGMENT_SHADER",
    ],

    /**
     * Creates a program from 2 script tags.
     *
     * @param {WebGLRenderingContext} gl The WebGLRenderingContext
     *        to use.
     * @param {string[]} shaderScriptIds Array of ids of the script
     *        tags for the shaders. The first is assumed to be the
     *        vertex shader, the second the fragment shader.
     * @param {string[]} [opt_attribs] An array of attribs names. Locations will be assigned by index if not passed in
     * @param {number[]} [opt_locations] The locations for the. A parallel array to opt_attribs letting you assign locations.
     * @return {WebGLProgram} The created program.
     * @memberOf module:webgl-utils
     */
    createProgramFromScripts(
        gl, shaderScriptIds, opt_attribs, opt_locations) {
        const shaders = [];
        for (let ii = 0; ii < shaderScriptIds.length; ++ii) {
            shaders.push(webglUtils.createShaderFromScript(
                gl, shaderScriptIds[ii], gl[webglUtils.defaultShaderType[ii]]));
        }
        return webglUtils.createProgram(gl, shaders, opt_attribs, opt_locations);
    },

    /**
     * Creates a program from 2 sources.
     *
     * @param {WebGLRenderingContext} gl The WebGLRenderingContext
     *        to use.
     * @param {string[]} shaderSourcess Array of sources for the
     *        shaders. The first is assumed to be the vertex shader,
     *        the second the fragment shader.
     * @param {string[]} [opt_attribs] An array of attribs names. Locations will be assigned by index if not passed in
     * @param {number[]} [opt_locations] The locations for the. A parallel array to opt_attribs letting you assign locations.
     * @return {WebGLProgram} The created program.
     * @memberOf module:webgl-utils
     */
    createProgramFromSources(
        gl, shaderSources, opt_attribs, opt_locations) {
        const shaders = [];
        for (let ii = 0; ii < shaderSources.length; ++ii) {
            shaders.push(webglUtils.loadShader(
                gl, shaderSources[ii], gl[webglUtils.defaultShaderType[ii]]));
        }
        return webglUtils.createProgram(gl, shaders, opt_attribs, opt_locations);
    },

    /**
     * Resize a canvas to match the size its displayed.
     * @param {HTMLCanvasElement} canvas The canvas to resize.
     * @param {number} [multiplier] amount to multiply by.
     *    Pass in window.devicePixelRatio for native pixels.
     * @return {boolean} true if the canvas was resized.
     * @memberOf module:webgl-utils
     */
    resizeCanvasToDisplaySize(canvas, multiplier) {
        multiplier = multiplier || 1;
        const width = canvas.clientWidth * multiplier | 0;
        const height = canvas.clientHeight * multiplier | 0;
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
            return true;
        }
        return false;
    },

};

const vertexShaderSource = `#version 300 es
    // an attribute is an input (in) to a vertex shader.
    // It will receive data from a buffer
    in vec2 a_position;
    in vec2 a_texCoord;

    // Used to pass in the resolution of the canvas
    uniform vec2 u_resolution;

    // Used to pass the texture coordinates to the fragment shader
    out vec2 v_texCoord;

    // all shaders have a main function
    void main() {

        // convert the position from pixels to 0.0 to 1.0
        vec2 zeroToOne = a_position / u_resolution;

        // convert from 0->1 to 0->2
        vec2 zeroToTwo = zeroToOne * 2.0;

        // convert from 0->2 to -1->+1 (clipspace)
        vec2 clipSpace = zeroToTwo - 1.0;

        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

        // pass the texCoord to the fragment shader
        // The GPU will interpolate this value between points.
        v_texCoord = a_texCoord;
    }
`;

// gradient mapping shader via https://nswamy14.gitbook.io/i2djs/tutorial-point/webgl-heatmap
// TODO rasterize gradient to 0-1024 values, then direct lookup O(1)
const fragmentShaderSource = `#version 300 es

    // fragment shaders don't have a default precision so we need
    // to pick one. highp is a good default. It means "high precision"
    precision highp float;

    // our texture
    uniform sampler2D u_image;

    // the texCoords passed in from the vertex shader.
    in vec2 v_texCoord;

    // we need to declare an output for the fragment shader
    out vec4 outColor;

	uniform vec4 u_colorArr[100]; uniform float u_colorCount; uniform float u_opacity; uniform float u_offset[100];

	float remap ( float minval, float maxval, float curval ) {
		return ( curval - minval ) / ( maxval - minval );
	}

    void main() {
        // outColor = texture(u_image, v_texCoord);
        
		float value = texture(u_image, v_texCoord).r;

        vec4 color_;
        if (value <= u_offset[0]) {
            color_ = u_colorArr[0];
        } else if (value <= u_offset[1]) {
            color_ = mix( u_colorArr[0], u_colorArr[1], remap( u_offset[0], u_offset[1], value ) );
        } else if (value <= u_offset[2]) {
            color_ = mix( u_colorArr[1], u_colorArr[2], remap( u_offset[1], u_offset[2], value ) );
        } else if (value <= u_offset[3]) {
            color_ = mix( u_colorArr[2], u_colorArr[3], remap( u_offset[2], u_offset[3], value ) );
        } else if (value <= u_offset[4]) {
            color_ = mix( u_colorArr[3], u_colorArr[4], remap( u_offset[3], u_offset[4], value ) );
        } else if (value <= u_offset[5]) {
            color_ = mix( u_colorArr[4], u_colorArr[5], remap( u_offset[4], u_offset[5], value ) );
        } else if (value <= u_offset[6]) {
            color_ = mix( u_colorArr[5], u_colorArr[6], remap( u_offset[5], u_offset[6], value ) );
        } else if (value <= u_offset[7]) {
            color_ = mix( u_colorArr[6], u_colorArr[7], remap( u_offset[6], u_offset[7], value ) );
        } else if (value <= u_offset[8]) {
            color_ = mix( u_colorArr[7], u_colorArr[8], remap( u_offset[7], u_offset[8], value ) );
        } else if (value <= u_offset[9]) {
            color_ = mix( u_colorArr[8], u_colorArr[9], remap( u_offset[8], u_offset[9], value ) );
        } else if (value <= u_offset[10]) {
            color_ = mix( u_colorArr[9], u_colorArr[10], remap( u_offset[9], u_offset[10], value ) );
        } else {
            color_ = vec4(0.0, 0.0, 0.0, 0.0);
        }
        
        outColor = color_;
    }
`;


export class HeatmapGL {

    context = null;
    canvas = null;
    container = null;

    width = 0;
    height = 0;

    _gradient = null;
    _gradientTransformed = null;

    get gradient() {
        return this._gradient;
    }

    set gradient(val) {
        this._gradient = val;
        this.transformGradient();
    }

    _data = null;
    _dataTransformed = null;

    get data() {
        return this._data;
    }

    set data(val) {
        this._data = val;
        this._dataTransformed = this.transformData(this._data, this.width, this.height);
        this.transformGradient();
        this.rebakeTexture();
    }

    _transposed = false;

    get transposed() {
        return this._transposed;
    }

    set transposed(val) {
        this._transposed = val;
        this.render();
    }

    addRow(row, maxRows = null, direction = "start") {
        if (this._dataTransformed == null) {
            this.height = 1;
            this.width = row.length;
            this.data = row;
            return;
        }

        // TODO check row size mismatch
        var redundantRows = this._data.length / this.width - maxRows;

        if (direction == "end") {
            if (maxRows !== null && redundantRows > 0) {
                this.data = this._data.splice(this.width * redundantRows, this._data.length - this.width * redundantRows).concat(row);
            } else {
                this.height = this.height + 1;
                this.data = this._data.concat(row);
            }

        } else if (direction == "start") {
            if (maxRows !== null && redundantRows > 0) {
                var joinedData = row.concat(this._data);
                this.data = joinedData.splice(0, joinedData.length - this.width * redundantRows);
            } else {
                this.height = this.height + 1;
                this.data = row.concat(this._data);
            }
        }

    }

    rebakeTexture() {
        if (this._dataTransformed && this.width && this.height) {
            var texture = this.textureFromPixelArray(this.context,
                this._dataTransformed.typedArray,
                this.context.LUMINANCE,
                this.context.LUMINANCE,
                this.context.UNSIGNED_BYTE,
                this.width, this.height)
        }
    }

    clamp(num, min, max) {
        return num <= min ?
            min :
            num >= max ?
            max :
            num
    }

    transformGradient() {
        if (this._dataTransformed == null) {
            return;
        }

        const arr = [];
        const gradLength = this._gradient.length;
        const offsets = [];
        var min = Number.MAX_VALUE;
        var max = Number.MIN_VALUE;

        this._gradient.forEach((d) => {
            arr.push(d.color[0] / 255);
            arr.push(d.color[1] / 255);
            arr.push(d.color[2] / 255);
            arr.push(d.color[3] === undefined ? 1.0 : d.color[3]);

            var offset = d.offset;
            offset = (offset - this._dataTransformed.dataMin) / this._dataTransformed.dataRange; // scale to 0-1
            offset = this.clamp(offset, 0, 255);
            offsets.push(offset);

            min = Math.min(min, d.offset);
            max = Math.max(max, d.offset);
        });

        this._gradientTransformed = {
            values: new Float32Array(arr),
            length: gradLength,
            offsets: new Float32Array(offsets),
            min: min,
            max: max,
        };

    }

    minMaxArray(arr) {

        // https://stackoverflow.com/questions/22747068/is-there-a-max-number-of-arguments-javascript-functions-can-accept
        // 
        if (arr.length < 32767) {
            var dataMax = Math.max.apply(null, arr);
            var dataMin = Math.min.apply(null, arr);
            return [dataMin, dataMax]
        }


        return arr.reduce((acc, val) => {
            acc[0] = (acc[0] === undefined || val < acc[0]) ? val : acc[0]
            acc[1] = (acc[1] === undefined || val > acc[1]) ? val : acc[1]
            return acc;
        }, []);

    }

    transformData(thisData, width, height) {

        // console.log(this.context.getParameter(this.context.MAX_TEXTURE_SIZE))

        // power of 2 only
        const size = width * height;
        var typedArray = new Uint8Array(size * 1);

        var [dataMin, dataMax] = this.minMaxArray(thisData);

        var dataRange = dataMax - dataMin;

        for (var i = 0; i < size; i++) {
            const offset = i * 1;
            const value = (thisData[i] - dataMin) / dataRange * 255.0; // scale to 0-255
            typedArray[offset + 0] = value;
            // typedArray[offset + 1] = value;
            // typedArray[offset + 2] = value;
            // typedArray[offset + 3] = value;
        }

        this._dataTransformed = typedArray;
        return { typedArray, dataMin, dataMax, dataRange };
    }

    constructor(container) {


        const canvas = document.createElement('canvas');

        const context = canvas.getContext('webgl2', {
            // premultipliedAlpha: false,
            // depth: false,
            antialias: true,
            alpha: true,
            // preserveDrawingBuffer: true // maybe false?
        });

        context.clearColor(0, 0, 0, 0);
        // context.enable(context.BLEND);
        // context.blendEquation(context.FUNC_ADD);
        // context.blendFunc(context.ONE, context.ONE_MINUS_SRC_ALPHA);
        // context.depthMask(true);

        container.style.position = "relative";
        canvas.style.position = 'absolute';
        canvas.style.top = 0;
        canvas.style.left = 0;
        canvas.style.right = 0;
        canvas.style.bottom = 0;
        container.appendChild(canvas);

        this.context = context;
        this.canvas = canvas;
        this.container = container;


        if (ResizeObserver) {
            new ResizeObserver(this.resize.bind(this)).observe(container)
        }
        this.resize();

        // TODO auto render on resize

        this.prepare();
    }

    resize() {

        const height = this.container.clientHeight;
        const width = this.container.clientWidth;

        this.canvas.setAttribute('height', height);
        this.canvas.setAttribute('width', width);
        this.canvas.style.height = `${height}px`;
        this.canvas.style.width = `${width}px`;
        this.context.viewport(0, 0, width, height);

        this.render();
    }

    textureFromPixelArray(gl, dataTypedArray, internalFormat, format, type, width, height) {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, type, dataTypedArray);

        // Other texture setup here, like filter modes and mipmap generation

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST_MIPMAP_NEAREST);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
        // gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);

        // gl.generateMipmap(gl.TEXTURE_2D)


        return texture;
    }

    prepare() {

        const ext = this.context.getExtension("EXT_color_buffer_float");
        if (!ext) {
            alert("need EXT_color_buffer_float");
            return;
        }

        // setup GLSL program
        var program = webglUtils.createProgramFromSources(this.context, [vertexShaderSource, fragmentShaderSource]);

        // attribute locations
        this._locations = {
            position: this.context.getAttribLocation(program, "a_position"),
            textureCoordinates: this.context.getAttribLocation(program, "a_texCoord"),

            resolution: this.context.getUniformLocation(program, "u_resolution"),
            image: this.context.getUniformLocation(program, "u_image"),

            colorArray: this.context.getUniformLocation(program, "u_colorArr"),
            colorCount: this.context.getUniformLocation(program, "u_colorCount"),
            opacity: this.context.getUniformLocation(program, "u_opacity"),
            offsets: this.context.getUniformLocation(program, "u_offset"),
        }

        // Create a vertex array object (attribute state)
        var vao = this.context.createVertexArray();

        // and make it the one we're currently working with
        this.context.bindVertexArray(vao);

        // Create a buffer and put a single pixel space rectangle in
        // it (2 triangles)
        this.positionBuffer = this.context.createBuffer();

        // Turn on the attribute
        this.context.enableVertexAttribArray(this._locations.position);

        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        this.context.bindBuffer(this.context.ARRAY_BUFFER, this.positionBuffer);

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 2; // 2 components per iteration
        var type = this.context.FLOAT; // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0; // start at the beginning of the buffer
        this.context.vertexAttribPointer(
            this._locations.position, size, type, normalize, stride, offset);

        // provide texture coordinates for the rectangle.
        var texCoordBuffer = this.context.createBuffer();
        this.context.bindBuffer(this.context.ARRAY_BUFFER, texCoordBuffer);
        this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            1.0, 1.0,
        ]), this.context.STATIC_DRAW);

        // Turn on the attribute
        this.context.enableVertexAttribArray(this._locations.textureCoordinates);

        // Tell the attribute how to get data out of texCoordBuffer (ARRAY_BUFFER)
        var size = 2; // 2 components per iteration
        var type = this.context.FLOAT; // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0; // start at the beginning of the buffer
        this.context.vertexAttribPointer(this._locations.textureCoordinates, size, type, normalize, stride, offset);

        // Tell WebGL how to convert from clip space to pixels
        this.context.viewport(0, 0, this.context.canvas.width, this.context.canvas.height);

        // Clear the canvas
        this.context.clearColor(0, 0, 0, 0);
        this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);

        // Tell it to use our program (pair of shaders)
        this.context.useProgram(program);

        // Bind the attribute/buffer set we want.
        this.context.bindVertexArray(vao);
    }

    render() {

        if (!this._gradientTransformed || !this._dataTransformed) {
            return;
        }

        // Pass in the canvas resolution so we can convert from
        // pixels to clipspace in the shader
        this.context.uniform2f(this._locations.resolution, this.context.canvas.width, this.context.canvas.height);

        // Tell the shader to get the texture from texture unit 0
        this.context.uniform1i(this._locations.image, 0);

        // Adding gradient map info
        this.context.uniform4fv(this._locations.colorArray, this._gradientTransformed.values);
        this.context.uniform1f(this._locations.colorCount, this._gradientTransformed.length);
        this.context.uniform1fv(this._locations.offsets, this._gradientTransformed.offsets);
        this.context.uniform1f(this._locations.opacity, 1);


        // Bind the position buffer so this.context.bufferData that will be called
        // in setRectangle puts data in the position buffer
        this.context.bindBuffer(this.context.ARRAY_BUFFER, this.positionBuffer);

        // Set a rectangle the same size as the image.
        if (this._transposed) {
            this.setTransposedRectangle(this.context, 0, 0, this.context.canvas.width, this.context.canvas.height);
        } else {
            this.setRectangle(this.context, 0, 0, this.context.canvas.width, this.context.canvas.height);
        }

        // Draw the rectangle.
        var primitiveType = this.context.TRIANGLES;
        var offset = 0;
        var count = 6;
        this.context.drawArrays(primitiveType, offset, count);

    }

    setRectangle(gl, x, y, width, height) {
        var x1 = x;
        var x2 = x + width;
        var y1 = y;
        var y2 = y + height;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2,
        ]), gl.STATIC_DRAW);
    }

    setTransposedRectangle(gl, x, y, width, height) {
        var x1 = x;
        var x2 = x + width;
        var y1 = y;
        var y2 = y + height;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            x1, y1,
            x1, y2,
            x2, y1,
            x2, y1,
            x1, y2,
            x2, y2,
        ]), gl.STATIC_DRAW);
    }

    pick(x, y) {
        const height = this.container.clientHeight;
        const width = this.container.clientWidth;

        const xScaled = x / width * this.width;
        const yScaled = y / height * this.height;

        var value = null;
        if (this._data) {
            value = this._data[Math.floor(xScaled + yScaled * this.width)];
        }

        return {
            x: xScaled,
            y: yScaled,
            value: value,
        }
    }

}