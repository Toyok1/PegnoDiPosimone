//Raccoglie diverse funzioni come il caricamento di una texture da un'immqgine,
// la crezione di una texture da applicarea allo skybox,
// e tutto ciò che riguarda il caricamento di una mesh da un Obj

//Funzione per creare la texture dello skybox

var depthFramebuffer, depthTextureSize, depthTexture, unusedTexture;
//funzione per creare depth framebuffer

//*********************************************************************************************************************
// MESH.OBJ

var webglVertexData = [
  [], // positions
  [], // texcoords
  [], // normals
];

function getObjToDraw(objsToDraw, name) {
  return objsToDraw.find((x) => x.name === name);
}

function loadObj(url) {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (xhttp.readyState == 4) {
      parseOBJ(xhttp.responseText);
    }
  };
  xhttp.open("GET", url, false);
  xhttp.send(null);
}

function parseOBJ(text) {
  webglVertexData = [
    [], // positions
    [], // texcoords
    [], // normals
  ];

  const objPositions = [[0, 0, 0]];
  const objTexcoords = [[0, 0]];
  const objNormals = [[0, 0, 0]];

  const objVertexData = [objPositions, objTexcoords, objNormals];

  // same order as `f` indices

  //f 1/2/3 -> 1 2 3
  function addVertex(vert) {
    const ptn = vert.split("/");
    ptn.forEach((objIndexStr, i) => {
      if (!objIndexStr) {
        return;
      }
      const objIndex = parseInt(objIndexStr);
      const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
      //webglVertexData pubblica
      //console.log(i);
      webglVertexData[i].push(...objVertexData[i][index]);
    });
  }

  const keywords = {
    v(parts) {
      objPositions.push(parts.map(parseFloat));
    },
    vn(parts) {
      objNormals.push(parts.map(parseFloat));
    },
    vt(parts) {
      // should check for missing v and extra w?
      objTexcoords.push(parts.map(parseFloat));
    },
    f(parts) {
      const numTriangles = parts.length - 2;
      for (let tri = 0; tri < numTriangles; ++tri) {
        addVertex(parts[0]);
        addVertex(parts[tri + 1]);
        addVertex(parts[tri + 2]);
      }
    },
  };

  //	\w* = almeno una lettere o un numero
  // ?:x = meccia gli spazi singoli bianchi (anche più di uno)
  // . = classi di caratteri, meccia ogni singolo carattere tranne i terminatori di linea
  const keywordRE = /(\w*)(?: )*(.*)/;
  const lines = text.split("\n");
  //let identifica una variabile in un determinato blocco di codice
  for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
    const line = lines[lineNo].trim();
    if (line === "" || line.startsWith("#")) {
      //la riga è vuota o è un commento
      continue;
    }
    //ritorna la stringa
    const m = keywordRE.exec(line);
    //console.log(m);
    if (!m) {
      continue;
    }
    const [, keyword, unparsedArgs] = m;
    const parts = line.split(/\s+/).slice(1);
    const handler = keywords[keyword];
    //console.log(parts);
    if (!handler) {
      //console.warn('unhandled keyword:', keyword, 'at line', lineNo + 1);
      continue;
    }

    handler(parts, unparsedArgs); //gestisce gli argomenti che non hai gestito
  }
}
