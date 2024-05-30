let video = null;
let detector = null;
let detections = [];
let videoVisibility = true;
let detecting = false;
let lastUpdate = 0;

const videoAction = document.getElementById('videoAction');
const detectionAction = document.getElementById('detectionAction');

document.body.style.cursor = 'wait';

function preload() {
  detector = ml5.objectDetector('cocossd');
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
}

function draw() {
  if (!video || !detecting) return;

  // Reiniciar el contador de personas en cada fotograma
  let peopleCount = 0;

  image(video, 0, 0);
  for (let i = 0; i < detections.length; i++) {
    const object = detections[i];
    drawResult(object);

    // Contar solo las personas
    if (object.label === 'person') {
      peopleCount++;
    }
  }

  const now = millis();
  if (now - lastUpdate >= 1000) {
    console.log("Personas detectadas " + peopleCount);
    lastUpdate = now;
  }
}

function drawResult(object) {
  boundingBox(object);
  drawLabel(object);

}

function boundingBox(object) {
  stroke('pink');
  strokeWeight(6);
  noFill();
  rect(object.x, object.y, object.width, object.height);
}
function drawLabel(object) {
  noStroke();
  fill('white');
  textSize(34);
  text(object.label, object.x + 15, object.y + 34);
}

function onDetected(error, results) {
  if (error) {
    console.error(error);
  }

  
  detections = results.filter(result => result.label === 'person');

  if (detecting) {
    detect();
  }
}

function detect() {
  detector.detect(video, onDetected);
}

function toggleVideo() {
  if (!video) return;
  if (videoVisibility) {
    video.hide();
    videoAction.innerText = 'Activar Video';
  } else {
    video.show();
    videoAction.innerText = 'Desactivar Video';
  }
  videoVisibility = !videoVisibility;
}

function toggleDetecting() {
  if (!video || !detector) return;
  if (!detecting) {
    detect();
    detectionAction.innerText = 'Parar...';
  } else {
    detectionAction.innerText = 'Detectar Objetos';
  }
  detecting = !detecting;
}