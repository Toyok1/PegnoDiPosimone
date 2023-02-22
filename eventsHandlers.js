window.addEventListener("keydown", doKeyDown, true);
window.addEventListener("keyup", doKeyUp, true);
window.addEventListener("touchstart", doTouchDown, true);
window.addEventListener("touchend", doTouchUp, true);

if (
  !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  text.addEventListener("mousedown", mouseDown);
  text.addEventListener("mouseup", mouseUp);
  text.addEventListener("mousemove", mouseMove);
  text.addEventListener("mouseout", mouseUp);
  window.addEventListener("wheel", zoom, { passive: false });
}

var pointerX = -1;
var pointerY = -1;
document.onmousemove = function (event) {
  pointerX = event.pageX;
  pointerY = event.pageY;
};
setInterval(pointerCheck, 1000);
function pointerCheck() {}

function zoom(event) {
  event.preventDefault();
  D += event.deltaY * +0.01;
}

function mouseDown(e) {
  drag = true;
  cameraCinema = true;
  (old_x = e.pageX), (old_y = e.pageY);
  e.preventDefault();
  return false;
}

function mouseUp(e) {
  drag = false;
}

function mouseMove(e) {
  if (!drag) return false;
  dX = (-(e.pageX - old_x) * 2 * Math.PI) / canvas.width;
  dY = (-(e.pageY - old_y) * 2 * Math.PI) / canvas.height;
  THETA += dX;
  PHI += dY;
  if (PHI < 0.22) {
    PHI = 0.22;
  }
  if (THETA > 3.05) {
    THETA = 3.05;
  }
  if (PHI > 3.05) {
    PHI = 3.05;
  }
  (old_x = e.pageX), (old_y = e.pageY);
  e.preventDefault();
}

function doKeyDown(e) {
  switch (e.key) {
    case "w":
      key[0] = true;
      break;
    case "a":
      key[1] = true;
      break;
    case "s":
      key[2] = true;
      break;
    case "d":
      key[3] = true;
      break;
    case "ArrowUp":
      cameraPosition[1] += 0.14;
      camera_posteriore = false;
      cambiaCamera = false;
      cameraCinema = false;
      break;
    case "ArrowDown":
      camera_posteriore = false;
      cameraPosition[1] -= 0.14;
      cambiaCamera = false;
      cameraCinema = false;
      break;
    case "ArrowLeft":
      camera_posteriore = false;
      cameraPosition[0] -= 0.14;
      cambiaCamera = false;
      cameraCinema = false;
      break;
    case "ArrowRight":
      camera_posteriore = false;
      cameraPosition[0] += 0.14;
      cambiaCamera = false;
      cameraCinema = false;
      break;
    default:
      return;
  }
}

function doKeyUp(e) {
  switch (e.key) {
    case "w":
      key[0] = false;
      break;
    case "a":
      key[1] = false;
      break;
    case "s":
      key[2] = false;
      break;
    case "d":
      key[3] = false;
      break;
    case "ArrowUp":
      key[0] = false;
      break;
    case "ArrowDown":
      key[2] = false;
      break;
    case "ArrowLeft":
      key[1] = false;
      break;
    case "ArrowRight":
      key[3] = false;
      break;
    default:
      return;
  }
}

function doTouchDown(e) {
  touch = e.touches[0];
  x = touch.pageX - canvas.offsetLeft;
  y = touch.pageY - canvas.offsetTop;

  // w
  if (x >= 640 && y >= 351 && x <= 700 && y <= 417) {
    key[0] = !key[0];
  }
  // s
  if (x >= 640 && y >= 439 && x <= 700 && y <= 500) {
    key[2] = !key[2];
  }
  // a
  if (x >= 556 && y >= 438 && x <= 617 && y <= 503) {
    key[1] = !key[1];
  }
  // d
  if (x >= 724 && y >= 440 && x <= 785 && y <= 504) {
    key[3] = !key[3];
  }

  // up
  if (x >= 190 && y >= 351 && x <= 250 && y <= 417) {
    cameraPosition[1] += 1;
    camera_posteriore = false;
    cambiaCamera = false;
    cameraCinema = false;
  }
  // down
  if (x >= 190 && y >= 439 && x <= 251 && y <= 500) {
    cameraPosition[1] -= 1;
    camera_posteriore = false;
    cambiaCamera = false;
    cameraCinema = false;
  }
  // left
  if (x >= 106 && y >= 438 && x <= 167 && y <= 503) {
    cameraPosition[0] -= 1;
    camera_posteriore = false;
    cambiaCamera = false;
    cameraCinema = false;
  }
  // right
  if (x >= 274 && y >= 440 && x <= 335 && y <= 504) {
    cameraPosition[0] += 1;
    camera_posteriore = false;
    cambiaCamera = false;
    cameraCinema = false;
  }
}

function doTouchUp(e) {
  x = touch.pageX - canvas.offsetLeft;
  y = touch.pageY - canvas.offsetTop;
  // w
  if (x >= 190 && y >= 351 && x <= 250 && y <= 417) key[0] = false;
  // s
  if (x >= 190 && y >= 439 && x <= 251 && y <= 500) key[2] = false;
  // a
  if (x >= 106 && y >= 438 && x <= 167 && y <= 503) key[1] = false;
  // d
  if (x >= 274 && y >= 440 && x <= 335 && y <= 504) key[3] = false;
}

window.addEventListener("click", checkButtonClick);

function checkButtonClick(e) {
  x = e.pageX - canvas.offsetLeft;
  y = e.pageY - canvas.offsetTop;
  //rigioca
  if (x >= 490 && x <= 650 && y >= 178 && y <= 236 && morte == true) {
    initMouse();
    morte = false;
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
    x_light = 300;
    y_light = 295;
    z_light = 250;
    cambiaCamera = false;
    cameraCinema = false;
    cameraAlto = false;
    cameraLibera = false;
    camera_posteriore = true;
    punti = 0;
    if (list_anchor.length != 0) {
      list_anchor.pop();
      list_anchor.pop();
    }
    resetObstacles();
    loadSkyBox();
  }
}
