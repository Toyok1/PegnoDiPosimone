var canvas = document.getElementById("myCanvas");
var text = document.getElementById("text");
var gl = canvas.getContext("webgl");

const textCanvas = document.getElementById("text");
const ctx = textCanvas.getContext("2d");
var ext = gl.getExtension("WEBGL_depth_texture");
if (!ext) {
  console.log("Depth Texture non supportata");
}

function degToRad(d) {
  return (d * Math.PI) / 180;
}

function radToDeg(r) {
  return (r * 180) / Math.PI;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}
var xy = [
  [getRndInteger(-50, 50), getRndInteger(-50, 50)],
  [getRndInteger(-50, 50), getRndInteger(-50, 50)],
  [getRndInteger(-50, 50), getRndInteger(-50, 50)],
  [getRndInteger(-50, 50), getRndInteger(-50, 50)],
];

function resetObstacles() {
  obstacles = [bufferInfoBomb, bufferInfoBomb, bufferInfoRock, bufferInfoRock];
  xy = [
    [getRndInteger(-50, 50), getRndInteger(-50, 50)],
    [getRndInteger(-50, 50), getRndInteger(-50, 50)],
    [getRndInteger(-50, 50), getRndInteger(-50, 50)],
    [getRndInteger(-50, 50), getRndInteger(-50, 50)],
  ];
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateNewAnchor() {
  list_anchor.push(getRndInteger(-50, 50), getRndInteger(-50, 50));
}

function loadSkyboxTexture() {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
  var variable =
    punti >= 9
      ? "resources/images/skybox/right_angry.png"
      : punti >= 6
      ? "resources/images/skybox/right_concerned.png"
      : "resources/images/skybox/right_happy.png";
  const faceInfos = [
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
      url: "resources/images/skybox/far_right.png", //back
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
      url: "resources/images/skybox/middle.png", //left
    },
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
      url: "resources/images/skybox/top.png", //top
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
      url: "resources/images/skybox/bottom.png", //bottom
    },
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
      url: variable, //right
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
      url: "resources/images/skybox/left.png", //front
    },
  ];

  faceInfos.forEach((faceInfo) => {
    const { target, url } = faceInfo;

    // Upload the canvas to the cubemap face.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 256; //questi due pezzi di merda
    const height = 256; // questi due pezzi di merda
    const format = gl.RGBA;
    const type = gl.UNSIGNED_BYTE;

    // setup each face so it's immediately renderable
    gl.texImage2D(
      target,
      level,
      internalFormat,
      width,
      height,
      0,
      format,
      type,
      null
    );

    // Asynchronously load an image
    const image = new Image();
    image.src = url;
    image.addEventListener("load", function () {
      // Now that the image has loaded copy it to the texture.
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
      gl.texImage2D(target, level, internalFormat, format, type, image);
      gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    });
  });

  gl.texParameteri(
    gl.TEXTURE_CUBE_MAP,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_LINEAR
  );

  return texture;
}

//Funzone per caricare una texture
function loadTextureFromImg(imageSrc) {
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Fill the texture with a 1x1 blue pixel.
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 255, 255])
  );

  // Asynchronously load an image
  var textureImage = new Image();
  textureImage.src = imageSrc;
  textureImage.addEventListener("load", function () {
    // Now that the image has loaded make copy it to the texture.
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      textureImage
    );
    if (isPowerOf2(textureImage.width) && isPowerOf2(textureImage.height)) {
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR_MIPMAP_NEAREST
      );
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //tell WebGL to not repeat the texture in S direction
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //tell WebGL to not repeat the texture in T direction
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    }
  });
  return texture;
}
