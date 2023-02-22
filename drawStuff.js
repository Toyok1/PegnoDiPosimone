//il file contiene le funzioni che disegnano gli oggetti in scena

function drawBoat(ProgramInfo) {
  let u_model4 = m4.scale(m4.translation(posX, posY, posZ), 3, 3, 3);
  u_model4 = m4.yRotate(u_model4, degToRad(facing));
  u_model4 = m4.yRotate(u_model4, degToRad(180));
  webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInfoBoat);
  webglUtils.setUniforms(ProgramInfo, {
    u_world: u_model4,
    u_texture: texture_boat,
  });
  webglUtils.drawBufferInfo(gl, bufferInfoBoat);
}

function drawObstacles(ProgramInfo, time, obs, xy) {
  //ogni ostacolo viene disegnato in base a se è una bomba o uno scoglio perchè le bombe ruotano di frame in frame e gli scogli no
  let u_model = m4.identity();
  switch (obs) {
    case bufferInfoBomb:
      u_model = m4.scale(m4.translation(xy[0], 5.5, xy[1]), 5.5, 5.5, 5.5);

      u_model = m4.yRotate(u_model, time);
      webglUtils.setBuffersAndAttributes(gl, ProgramInfo, obs);
      webglUtils.setUniforms(ProgramInfo, {
        u_world: u_model,
        u_texture: textureBomb,
      });
      break;
    case bufferInfoRock:
      u_model = m4.scale(m4.translation(xy[0], 1, xy[1]), 5, 5, 5);

      u_model = m4.yRotate(u_model, degToRad(xy[0] * xy[1]));
      webglUtils.setBuffersAndAttributes(gl, ProgramInfo, obs);
      webglUtils.setUniforms(ProgramInfo, {
        u_colorMult: [0.5, 0.5, 1, 1],
        u_world: u_model,
        u_texture: textureRock,
      });
      break;
    default:
      //console.log("error with drawing obstacles");
      //console.log(obs);
      break;
  }
  webglUtils.drawBufferInfo(gl, obs);
}

function drawAnchor(ProgramInfo, time) {
  let anchor_model = m4.scale(
    m4.translation(list_anchor[0], 0, list_anchor[1]),
    0.5,
    0.5,
    0.5
  );
  anchor_model = m4.yRotate(anchor_model, time);
  webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInfoAnchor);
  webglUtils.setUniforms(ProgramInfo, {
    u_colorMult: [0.5, 0.5, 1, 1],
    u_world: anchor_model,
    u_texture: textureAnchor,
  });
  webglUtils.drawBufferInfo(gl, bufferInfoAnchor);
}

function drawFloor(ProgramInfo) {
  let u_modelfloor = m4.identity();
  webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInfoFloor);
  webglUtils.setUniforms(ProgramInfo, {
    u_world: u_modelfloor,
    u_texture: textureFloor,
  });
  webglUtils.drawBufferInfo(gl, bufferInfoFloor);
}

function drawSkybox(gl, skyboxProgramInfo, view, projection) {
  gl.depthFunc(gl.LEQUAL); //non so perchè è necessario per lo skybox

  const viewMatrix = m4.copy(view);

  // remove translations
  viewMatrix[12] = 0;
  viewMatrix[13] = 0;
  viewMatrix[14] = 0;

  let viewDirectionProjectionMatrix = m4.multiply(projection, viewMatrix);
  let viewDirectionProjectionInverse = m4.inverse(
    viewDirectionProjectionMatrix
  );
  gl.useProgram(skyboxProgramInfo.program);
  webglUtils.setBuffersAndAttributes(gl, skyboxProgramInfo, bufferInfoSkybox);
  webglUtils.setUniforms(skyboxProgramInfo, {
    u_viewDirectionProjectionInverse: viewDirectionProjectionInverse,
    u_skybox: textureSkybox,
  });
  webglUtils.drawBufferInfo(gl, bufferInfoSkybox);
}

function drawRightPanel() {
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    ctx.drawImage(frecce, 80, 330);
    ctx.drawImage(wasd_keys, 540, 330);
    ctx.drawImage(image_menu, 870, 17);
  } else {
    ctx.drawImage(image_menu, 870, 1);
  }
  //testo
  ctx.font = "20pt Arial";
  ctx.fillStyle = "yellow";
  ctx.fillText("IL PEGNO DI", 880, 45);
  ctx.fillText("POSIMONE", 880, 85);

  ctx.font = "12pt Calibri";
  ctx.fillStyle = "white";
  ctx.fillText("Una nave coraggiosa non teme", 880, 130);
  ctx.fillText("di certo il mare in tempesta", 880, 150);
  ctx.fillText("però quegli scogli e quelle bombe", 880, 170);
  ctx.fillText("non promettono bene.", 880, 190);
  ctx.font = "14pt Calibri";
  ctx.fillStyle = "orange";
  ctx.fillText("Il tuo punteggio: " + punti.toString(), 925, 240);
  ctx.font = "10pt Calibri";
  ctx.fillStyle = "white";
  ctx.fillText(
    "------------------------------------------------------------",
    871,
    270
  );
  ctx.font = "16pt Calibri";
  ctx.fillStyle = "red";
  ctx.fillText("	             CONTROLLI 		", 870, 290);
  ctx.font = "13pt Calibri";
  ctx.fillStyle = "black";
  ctx.fillText("          Controllo movimento", 880, 310);
  ctx.font = "12pt Calibri";
  ctx.fillText("          W avanti            A sinistra", 880, 330);
  ctx.fillText("          S indietro          D destra", 880, 350);
  ctx.font = "13pt Calibri";
  ctx.fillText("Puoi muovere la camera", 880, 380);
  ctx.fillText("con le frecce direzionali", 880, 400);
  ctx.fillText("(🢁🢃🢂🢀)", 950, 420);
  ctx.fillText("o con il movimento del mouse.", 880, 440);
  ctx.font = "13pt Calibri";
  ctx.fillText("Puoi avvicinarti e allontarti con", 880, 460);
  ctx.fillText("la rotella del mouse.", 880, 480);

  if (morte) {
    ctx.drawImage(matrix, 0, 0, text.clientWidth, text.clientHeight);
    ctx.drawImage(retry, 480, 175);
  }
}
