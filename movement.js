var posX, posY, posZ, facing; // posizione e orientamento
var sterzo;
var vx, vy, vz; // velocità attuale

var punti = 0;
var flip_flop = false;

var velSterzo,
  velRitornoSterzo,
  accMax,
  attrito,
  grip,
  attritoX,
  attritoY,
  attritoZ; // attriti
var key;
var tolerance = 7;

/* funzioni prese dagli esercizi visti in classe e riadattate per gli scopi di questo progetto */
function initMouse() {
  // inizializzo lo stato della macchina
  posX = posY = posZ = facing = 0; // posizione e orientamento
  sterzo = 0; // stato
  vx = vy = vz = 0; // velocita' attuale
  // inizializzo i controlli
  key = [false, false, false, false];

  velSterzo = 3.2; // A
  velRitornoSterzo = 0.84; // B, sterzo massimo = A*B / (1-B)

  accMax = 0.005;

  // attriti: percentuale di velocita' che viene mantenuta
  // 1 = no attrito
  // <<1 = attrito grande
  attritoZ = 0.99; // piccolo attrito sulla Z
  attritoX = 0.8; // grande attrito sulla X
  attritoY = 1.0; // attrito sulla y nullo

  grip = 0.35; // quanto il facing macchina si adegua velocemente allo sterzo
}
function followMovement() {
  var vxm, vym, vzm; // velocita' in spazio

  // da vel frame mondo a vel frame
  var cosf = Math.cos((facing * Math.PI) / 180.0);
  var sinf = Math.sin((facing * Math.PI) / 180.0);
  vxm = +cosf * vx - sinf * vz;
  vym = vy;
  vzm = +sinf * vx + cosf * vz;

  // gestione dello sterzo
  if (key[1]) sterzo += velSterzo;
  if (key[3]) sterzo -= velSterzo;
  sterzo *= velRitornoSterzo; // ritorno a "volante" fermo

  if (key[0]) vzm -= accMax; // accelerazione in avanti
  if (key[2]) vzm += accMax; // accelerazione indietro

  // attriti (semplificando)
  vxm *= attritoX;
  vym *= attritoY;
  vzm *= attritoZ;

  // l'orientamento del mouse segue quello dello sterzo
  // (a seconda della velocita' sulla z)
  facing = facing - vzm * grip * sterzo;

  // ritorno a vel coord mondo
  vx = +cosf * vxm + sinf * vzm;
  vy = vym;
  vz = -sinf * vxm + cosf * vzm;

  posX += vx;
  posY += vy;
  posZ += vz;

  //CONTROLLO COLLISIONI CON GLI OGGETTI

  xy.forEach((coord) => {
    //ostacoli
    if (
      posX >= coord[0] - tolerance &&
      posX <= coord[0] + tolerance &&
      posZ >= coord[1] - tolerance &&
      posZ <= coord[1] + tolerance
    ) {
      morte = 1;
    }
  });
  if (list_anchor.length != 0) {
    //controllo della posizione dell'ancora per sapere se è stata presa
    if (
      posX >= list_anchor[0] - tolerance &&
      posX <= list_anchor[0] + tolerance &&
      posZ >= list_anchor[1] - tolerance &&
      posZ <= list_anchor[1] + tolerance
    ) {
      punti = punti + 1;
      if (punti % 3 == 0) {
        obstacles.push(flip_flop ? bufferInfoBomb : bufferInfoRock);
        xy.push([getRndInteger(-50, 50), getRndInteger(-50, 50)]);
        flip_flop = !flip_flop;
      }
      list_anchor.pop();
      list_anchor.pop();
      if (punti == 6 || punti == 9) {
        loadSkyBox(); // a 6 e 9 ricarico lo skybox per aggiornare Posimone
      }
    }
  }

  if (posX >= 68 || posX <= -68 || posZ >= 68 || posZ <= -68) {
    //bordo della mappa
    morte = true;
  }
}

/* --------------------------------------- */
