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

// Slightly modified to to unwrap it to ES6 class

export class webglUtils {

    /**
     * Loads a shader.
     * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
     * @param {string} shaderSource The shader source.
     * @param {number} shaderType The type of shader.
     * @return {WebGLShader} The created shader.
     */
    static loadShader(gl, shaderSource, shaderType) {
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
    }

    /**
     * Creates a program, attaches shaders, binds attrib locations, links the
     * program and calls useProgram.
     * @param {WebGLShader[]} shaders The shaders to attach
     * @param {string[]} [opt_attribs] An array of attribs names. Locations will be assigned by index if not passed in
     * @param {number[]} [opt_locations] The locations for the. A parallel array to opt_attribs letting you assign locations.
     * @memberOf module:webgl-utils
     */
    static createProgram(
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
    }

    /**
     * Loads a shader from a script tag.
     * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
     * @param {string} scriptId The id of the script tag.
     * @param {number} opt_shaderType The type of shader. If not passed in it will
     *     be derived from the type of the script tag.
     * @return {WebGLShader} The created shader.
     */
    static createShaderFromScript(
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
    }

    static defaultShaderType = [
        "VERTEX_SHADER",
        "FRAGMENT_SHADER",
    ];

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
    static createProgramFromScripts(
        gl, shaderScriptIds, opt_attribs, opt_locations) {
        const shaders = [];
        for (let ii = 0; ii < shaderScriptIds.length; ++ii) {
            shaders.push(webglUtils.createShaderFromScript(
                gl, shaderScriptIds[ii], gl[webglUtils.defaultShaderType[ii]]));
        }
        return webglUtils.createProgram(gl, shaders, opt_attribs, opt_locations);
    }

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
    static createProgramFromSources(
        gl, shaderSources, opt_attribs, opt_locations) {
        const shaders = [];
        for (let ii = 0; ii < shaderSources.length; ++ii) {
            shaders.push(webglUtils.loadShader(
                gl, shaderSources[ii], gl[webglUtils.defaultShaderType[ii]]));
        }
        return webglUtils.createProgram(gl, shaders, opt_attribs, opt_locations);
    }

    /**
     * Resize a canvas to match the size its displayed.
     * @param {HTMLCanvasElement} canvas The canvas to resize.
     * @param {number} [multiplier] amount to multiply by.
     *    Pass in window.devicePixelRatio for native pixels.
     * @return {boolean} true if the canvas was resized.
     * @memberOf module:webgl-utils
     */
    static resizeCanvasToDisplaySize(canvas, multiplier) {
        multiplier = multiplier || 1;
        const width = canvas.clientWidth * multiplier | 0;
        const height = canvas.clientHeight * multiplier | 0;
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
            return true;
        }
        return false;
    }

}