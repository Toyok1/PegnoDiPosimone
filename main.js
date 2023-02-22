"use strict";
//var ancora_presa = 0;
var cartella2 = 0;
var cartella3 = 0;
var pacco = false;
var morte = false;
var camera_posteriore = true;
var cambiaCamera = false;
var cameraAlto = false;
var click_end = false;
var texture_enable = false;
var cameraTarget = [0, 0, 0]; //eye location of the camera dove guardiamo
var cameraPosition = [0, 0, 0]; // center where the camera is pointed ovvero D
var up = [0, 1, 0]; //se cambia up, ruota l'intero SDR, quindi cambiano gli assi
const zNear = 0.1; // faccia più piccola del frustum znear
const zFar = 200; // faccia più grande del frustum znear
const fieldOfViewRadians = degToRad(60); //fov, aumentando questo, aumento l'ampiezza della visuale (tipo grandangolo)
const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
var D = 17;
var cameraCinema = false;
var cameraLibera = false; // drag del mouse
var drag;
var numcartella = 3;
var bias = -0.000025; //-0.00005;
var cartella = false;
var THETA = degToRad(86);
var PHI = degToRad(23);
var x_light = 300;
var y_light = 295;
var z_light = 250;
var x_targetlight = 0;
var y_targetlight = 0;
var z_targetlight = 0;
var width_projLight = 3000;
var height_projLight = 1500;
var fovLight = 24;
var lightIntensity = 2.5;
var shadowIntensity = 0.9;
var viewParamsChanged = false;
var lightWorldMatrix;
var lightProjectionMatrix;
var projectionMatrix;
var cameraMatrix;
var list_anchor = [];

function updateluceX(event, ui) {
  x_light = ui.value;
}

function updateluceY(event, ui) {
  y_light = ui.value;
}

function updateluceZ(event, ui) {
  z_light = ui.value;
}

var doneSomething = false;
var nstep = 0;
var timeNow = 0;

const PHYS_SAMPLING_STEP = 20;

var meshProgramInfo = webglUtils.createProgramInfo(gl, [
  vertShader,
  fragShader,
]);

//skybox program
var skyboxProgramInfo = webglUtils.createProgramInfo(gl, [
  skyVertShader,
  skyFragShader,
]);

//sun program
var sunProgramInfo = webglUtils.createProgramInfo(gl, [
  sunVertShader,
  sunFragShader,
]);

var colorProgramInfo = webglUtils.createProgramInfo(gl, [
  colorVertShader,
  colorFragShader,
]);

var matrix = new Image();
matrix.src = "resources/images/unalive_screen.jpg";
matrix.addEventListener("load", function () {});

var image_menu = new Image();
image_menu.src = "resources/images/back.jpg";
image_menu.addEventListener("load", function () {});

var wasd_keys = new Image();
wasd_keys.src = "resources/images/wasd.png";
wasd_keys.addEventListener("load", function () {});

var frecce = new Image();
frecce.src = "resources/images/frecce.png";
frecce.addEventListener("load", function () {});

//restart button
var retry = new Image();
retry.src = "resources/images/reset.png";
retry.addEventListener("load", function () {});

setGeo(gl);

var obstacles = [
  bufferInfoBomb,
  bufferInfoBomb,
  bufferInfoRock,
  bufferInfoRock,
];
initMouse();
createTextureLight();

webglLessonsUI.setupSlider("#luceX", {
  value: 300,
  slide: updateluceX,
  min: 0,
  max: 450,
  step: 1,
});
webglLessonsUI.setupSlider("#luceY", {
  value: 295,
  slide: updateluceY,
  min: 100,
  max: 450,
  step: 1,
});
webglLessonsUI.setupSlider("#luceZ", {
  value: 250,
  slide: updateluceZ,
  min: 100,
  max: 350,
  step: 1,
});

function update(time) {
  if (nstep * PHYS_SAMPLING_STEP <= timeNow) {
    //skip the frame if the call is too early
    followMovement();
    nstep++;
    doneSomething = true;
    window.requestAnimationFrame(update);
    return; // return as there is nothing to do
  }
  timeNow = time;
  if (doneSomething) {
    render(time);
    doneSomething = false;
  }
  window.requestAnimationFrame(update); // get next frame
}

function render(time) {
  time *= 0.001;
  gl.enable(gl.DEPTH_TEST);
  // first draw from the POV of the light
  lightWorldMatrix = m4.lookAt(
    [x_light, y_light, z_light], // position
    [x_targetlight, y_targetlight, z_targetlight], // target
    up // up
  );

  lightProjectionMatrix = m4.perspective(
    degToRad(fovLight),
    width_projLight / height_projLight,
    8, // near: top of the frustum
    700
  ); // far: bottom of the frustum

  gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
  gl.viewport(0, 0, depthTextureSize, depthTextureSize);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  drawScene(
    lightProjectionMatrix,
    lightWorldMatrix,
    m4.identity(),
    lightWorldMatrix,
    colorProgramInfo,
    time
  );
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  gl.clearColor(0, 0, 0, 1); //setta tutto a nero se 0,0,0,1
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  let textureMatrix = m4.identity();
  textureMatrix = m4.translate(textureMatrix, 0.5, 0.5, 0.5);
  textureMatrix = m4.scale(textureMatrix, 0.5, 0.5, 0.5);
  textureMatrix = m4.multiply(textureMatrix, lightProjectionMatrix);
  textureMatrix = m4.multiply(textureMatrix, m4.inverse(lightWorldMatrix));

  var projection = m4.perspective(fieldOfViewRadians, aspect, 0.1, 1200);

  // Compute the camera's matrix using look at.
  var camera = m4.lookAt(cameraPosition, cameraTarget, up);

  // Make a view matrix from the camera matrix.
  var view = m4.inverse(camera);

  if (camera_posteriore) {
    cameraPosition = [
      posX + D * Math.sin(degToRad(facing)),
      posY + 7,
      posZ + D * Math.cos(degToRad(facing)),
    ];
  }

  if (cameraCinema) {
    cameraPosition = [
      D * 1.5 * Math.sin(PHI) * Math.cos(THETA),
      D * 1.5 * Math.sin(PHI) * Math.sin(THETA),
      D * 1.5 * Math.cos(PHI),
    ];
  }

  if (cambiaCamera && !cameraCinema) {
    cameraPosition = [
      posX + -D * Math.sin(degToRad(facing)),
      posY + 20,
      posZ + -D * Math.cos(degToRad(facing)),
    ];
  }

  if (cameraAlto) {
    cameraPosition = [0, 130, 2];
  }

  if (!cameraAlto) {
    cameraTarget = [posX, posY, posZ];
  } else {
    cameraTarget = [0, 0, 0];
  }

  drawScene(
    projection,
    camera,
    textureMatrix,
    lightWorldMatrix,
    sunProgramInfo,
    time
  );
  drawSkybox(gl, skyboxProgramInfo, view, projection);
  drawRightPanel();
}
//update();

function drawScene(
  projectionMatrix,
  camera,
  textureMatrix,
  lightWorldMatrix,
  programInfo,
  time
) {
  const viewMatrix = m4.inverse(camera);
  gl.useProgram(programInfo.program);
  if (texture_enable == true) {
    webglUtils.setUniforms(programInfo, {
      u_view: viewMatrix,
      u_projection: projectionMatrix,
      u_bias: bias,
      u_textureMatrix: textureMatrix,
      u_projectedTexture: depthTexture,
      u_reverseLightDirection: lightWorldMatrix.slice(8, 11),
      u_lightDirection: m4.normalize([-1, 3, 5]),
      u_lightIntensity: lightIntensity,
      u_shadowIntensity: shadowIntensity,
    });
  }
  if (texture_enable == false) {
    textureMatrix = m4.identity();
    textureMatrix = m4.scale(textureMatrix, 0, 0, 0);
    webglUtils.setUniforms(programInfo, {
      u_view: viewMatrix,
      u_projection: projectionMatrix,
      u_bias: bias,
      u_textureMatrix: textureMatrix,
      u_reverseLightDirection: lightWorldMatrix.slice(8, 11),
      u_lightDirection: m4.normalize([-1, 3, 5]),
      u_lightIntensity: lightIntensity,
      u_shadowIntensity: shadowIntensity,
    });
  }

  drawBoat(programInfo);
  //drawSchermo(programInfo);
  let j = 0;
  obstacles.forEach((obs) => {
    drawObstacles(programInfo, time, obs, xy[j]);
    j = j + 1;
  });

  if (list_anchor.length == 0) {
    generateNewAnchor();
  }
  drawAnchor(programInfo, time);
  drawFloor(programInfo);
}

window.requestAnimationFrame(update);
