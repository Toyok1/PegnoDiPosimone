//Buffer degli Obj
let bufferInfoBomb;
let bufferInfoRock;
let bufferInfoSkybox;
let bufferInfoFloor;
let bufferInfoBoat;
let bufferInfoAnchor;
//Buffer delle texture
let textureBomb;
let textureRock;
let textureSkybox;
let textureFloor;
let textureAnchor;

function setGeo(gl) {
  loadRock();
  loadBomb();
  loadAnchor();
  loadBoat();
  loadFloor();
  loadSkyBox();
}

function createTextureLight() {
  depthTexture = gl.createTexture();
  depthTextureSize = 1024;
  gl.bindTexture(gl.TEXTURE_2D, depthTexture);
  gl.texImage2D(
    gl.TEXTURE_2D, // target
    0, // mip level
    gl.DEPTH_COMPONENT, // internal format
    depthTextureSize, // width
    depthTextureSize, // height
    0, // border
    gl.DEPTH_COMPONENT, // format
    gl.UNSIGNED_INT, // type
    null
  ); // data
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  depthFramebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER, // target
    gl.DEPTH_ATTACHMENT, // attachment point
    gl.TEXTURE_2D, // texture target
    depthTexture, // texture
    0
  ); // mip level

  // --------------------------------------------------
  // UNUSED TEXTURE

  // create a color texture of the same size as the depth texture
  // see article why this is needed_
  unusedTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, unusedTexture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    depthTextureSize,
    depthTextureSize,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  // attach it to the framebuffer
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER, // target
    gl.COLOR_ATTACHMENT0, // attachment point
    gl.TEXTURE_2D, // texture target
    unusedTexture, // texture
    0
  ); // mip level
}

function loadFloor() {
  const S = 70;
  const H = 0;
  const textureCoords = [0, 0, 1, 0, 0, 1, 1, 1];
  const arrays_floor = {
    position: {
      numComponents: 3,
      data: [-S, H, -S, S, H, -S, -S, H, S, S, H, S],
    },
    texcoord: { numComponents: 2, data: textureCoords },
    indices: { numComponents: 3, data: [0, 2, 1, 2, 3, 1] },
    normal: { numComponents: 3, data: [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0] },
  };

  bufferInfoFloor = webglUtils.createBufferInfoFromArrays(gl, arrays_floor);
  textureFloor = loadTextureFromImg("resources/images/acqua.jpg");
}

function loadAnchor() {
  loadObj("resources/obj/anchor.obj");
  const anchor_array = {
    position: { numComponents: 3, data: webglVertexData[0] },
    texcoord: { numComponents: 2, data: webglVertexData[1] },
    normal: { numComponents: 3, data: webglVertexData[2] },
  };
  bufferInfoAnchor = webglUtils.createBufferInfoFromArrays(gl, anchor_array);
  textureAnchor = loadTextureFromImg("resources/images/metallo.jpg");
}

function loadRock() {
  loadObj("resources/obj/rock.obj");
  const Rock_array = {
    position: { numComponents: 3, data: webglVertexData[0] },
    texcoord: { numComponents: 2, data: webglVertexData[1] },
    normal: { numComponents: 3, data: webglVertexData[2] },
  };

  bufferInfoRock = webglUtils.createBufferInfoFromArrays(gl, Rock_array);
  textureRock = loadTextureFromImg("resources/images/rock_texture.jpg");
}

function loadBomb() {
  loadObj("resources/obj/bomb.obj");
  const bomb_array = {
    position: { numComponents: 3, data: webglVertexData[0] },
    texcoord: { numComponents: 2, data: webglVertexData[1] },
    normal: { numComponents: 3, data: webglVertexData[2] },
  };

  bufferInfoBomb = webglUtils.createBufferInfoFromArrays(gl, bomb_array);
  textureBomb = loadTextureFromImg("resources/images/boom2.jpg");
}

function loadBoat() {
  loadObj("resources/obj/boat.obj");
  const boat_array = {
    position: { numComponents: 3, data: webglVertexData[0] },
    texcoord: { numComponents: 2, data: webglVertexData[1] },
    normal: { numComponents: 3, data: webglVertexData[2] },
  };
  bufferInfoBoat = webglUtils.createBufferInfoFromArrays(gl, boat_array);
  texture_boat = loadTextureFromImg("resources/images/boat_texture.jpg");
}

function loadSkyBox() {
  textureSkybox = loadSkyboxTexture();
  bufferInfoSkybox = webglUtils.createBufferInfoFromArrays(gl, {
    position: {
      data: new Float32Array([
        -1,
        -1, // bottom-left triangle
        1,
        -1,
        -1,
        1,
        -1,
        1, // top-right triangle
        1,
        -1,
        1,
        1,
      ]),
      numComponents: 2,
    },
  });
}
