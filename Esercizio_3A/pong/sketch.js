// === Variabili globali ===

// suoni
let colpoSound;
let muroSound;
let goalSound;
let winSound;

//importazione suoni
function preload() {
  soundFormats('wav'); // supporta wav
  colpoSound = loadSound('colpo.wav');
  muroSound = loadSound('muro.wav');
  goalSound = loadSound('goal.wav');
  winSound = loadSound('win.wav');
}

// palla
let pallaX, pallaY;
let pallaWidth = 15;
let pallaHeight = 15;
let pallaVel = 3;
let pallaDirezioneX = 1;
let pallaDirezioneY = 1;

// pausa palla prima di ripartire
let inPausa = false;
let pausaInizio = 0;
let pausaDurata = 2000;

// giocatori
let g1X = 10;
let g1Y;
let g2X = 890;
let g2Y;

// grandezza giocatori
let giocatoreWidth = 20;
let giocatoreHeight = 100;
let gVel = 5;

// punteggio
let g1Punto = 0;
let g2Punto = 0;



// stage: 0 = benvenuto, 1 = gioco, 2 = fine partita
let stage = 0;

let vincitore = 0;          // per memorizzare il vincitore
let finePartitaInizio = 0;  // tempo inizio schermata fine partit

function setup() {
  createCanvas(900, 500);
  rectMode(CENTER);
  textAlign(CENTER);
  textFont('Courier New');
  g1Y = height / 2;
  g2Y = height / 2;
  pallaX = width / 2;
  pallaY = height / 2;
}


function draw() {
  if (stage === 0) {
    benvenuto();
    select('#istruzioni').style('display', 'none');  // nascondi istruzioni
  } else if (stage === 1) {
    pong();
    select('#istruzioni').style('display', 'block'); // mostra istruzioni

    // Controlla fine partita
    if (g1Punto >= 5) {
      vincitore = 1;
      stage = 2;
      finePartitaInizio = millis();
    } else if (g2Punto >= 5) {
      vincitore = 2;
      stage = 2;
      finePartitaInizio = millis();
    }
  } else if (stage === 2) {
    finePartita();
    select('#istruzioni').style('display', 'none'); // nascondi istruzioni
  }
}



// === Schermata di benvenuto ===
function benvenuto() {
  background(0);
  fill(255);
  textSize(50);
  text("BENVENUTO AL GIOCO PONG", width / 2, 80);

  textSize(20);
  text("Clicca il bottone per iniziare", width / 2, 130);

  // bottone
  fill(0);
  stroke(255);
  rect(width / 2, 200, 120, 50);

  noStroke();
  fill(255);
  text("START", width / 2, 207);
}

// Funzione principale gioco
function pong() {
  background(0);

  // se siamo in pausa dopo un goal
  if (inPausa) {
    // lampeggia la palla
    if (floor(millis() / 250) % 2 === 0) {
      fill(255);
      rect(pallaX, pallaY, pallaWidth, pallaHeight);
    }

    // aggiorna il movimento dei giocatori anche in pausa
    aggiornaGiocatori();

    // disegna campo, giocatori e punteggio
    drawFieldAndPlayers();

    // controlla se la pausa è finita
    if (millis() - pausaInizio >= pausaDurata) {
      inPausa = false;
    }

    // esci dalla funzione senza muovere la palla
    return;
  }

  // movimento palla
  pallaX += pallaDirezioneX * pallaVel;
  pallaY += pallaDirezioneY * pallaVel;

  // collisione con muri superiore/inferiore
  if (pallaY >= height || pallaY <= 0) {
    pallaDirezioneY *= -1;
    if (muroSound && !muroSound.isPlaying()) muroSound.play();
  }

  // collisione con giocatore 1
  if (
    pallaX - pallaWidth / 2 <= g1X + giocatoreWidth / 2 &&
    pallaX + pallaWidth / 2 >= g1X - giocatoreWidth / 2 &&
    pallaY + pallaHeight / 2 >= g1Y - giocatoreHeight / 2 &&
    pallaY - pallaHeight / 2 <= g1Y + giocatoreHeight / 2
  ) {
    pallaDirezioneX *= -1;
    pallaVel *= 1.1;
    if (colpoSound && !colpoSound.isPlaying()) colpoSound.play();
  }

  // collisione con giocatore 2
  if (
    pallaX + pallaWidth / 2 >= g2X - giocatoreWidth / 2 &&
    pallaX - pallaWidth / 2 <= g2X + giocatoreWidth / 2 &&
    pallaY + pallaHeight / 2 >= g2Y - giocatoreHeight / 2 &&
    pallaY - pallaHeight / 2 <= g2Y + giocatoreHeight / 2
  ) {
    pallaDirezioneX *= -1;
    pallaVel *= 1.1;
    if (colpoSound && !colpoSound.isPlaying()) colpoSound.play();
  }

  // limite massimo velocità
  if (pallaVel > 15) {
    pallaVel = 15;
  }

  // punto per giocatore 1
  if (pallaX >= width) {
    g1Punto += 1;
    if (goalSound) goalSound.play();
    resetPalla();
  }

  // punto per giocatore 2
  if (pallaX <= 0) {
    g2Punto += 1;
    if (goalSound) goalSound.play();
    resetPalla();
  }

  // disegna tutto
  drawFieldAndPlayers();

  // aggiorna il movimento dei giocatori
  aggiornaGiocatori();
}

// aggiorna il movimento dei giocatori
function aggiornaGiocatori() {
  if (keyIsDown(87)) g1Y -= gVel; // W
  if (keyIsDown(83)) g1Y += gVel; // S
  if (keyIsDown(UP_ARROW)) g2Y -= gVel;
  if (keyIsDown(DOWN_ARROW)) g2Y += gVel;

  // Limita il movimento dentro il canvas (verticale)
  g1Y = constrain(g1Y, giocatoreHeight / 2, height - giocatoreHeight / 2);
  g2Y = constrain(g2Y, giocatoreHeight / 2, height - giocatoreHeight / 2);
}

// disegna campo, giocatori e punteggio
function drawFieldAndPlayers() {
  // campo
  noFill();
  stroke(255);
  rect(width / 2, height / 2, width, height);
  line(width / 2, 0, width / 2, height);

  // palla
  fill(255);
  noStroke();
  rect(pallaX, pallaY, pallaWidth, pallaHeight);

  // giocatori
  rect(g1X, g1Y, giocatoreWidth, giocatoreHeight);
  rect(g2X, g2Y, giocatoreWidth, giocatoreHeight);

  // etichette giocatori
  textSize(10);
  fill(255);
  text("[giocatore 1]", g1X + 60, g1Y - 60);
  text("[giocatore 2]", g2X - 60, g2Y + 60);

  // punteggio
  textSize(15);
  text(g1Punto, 430, 25);
  text(g2Punto, 470, 25);
}

// funzione di reset palla
function resetPalla() {
  pallaX = width / 2;
  pallaY = height / 2;
  pallaVel = 3;
  pallaDirezioneX *= -1;
  inPausa = true;
  pausaInizio = millis(); // registra il tempo di inizio pausa
}

// === Clic per START ===
function mousePressed() {
  userStartAudio(); // fondamentale per abilitare audio su browser

  if (stage === 0) {
    let rectX = width / 2;
    let rectY = 200;
    let rectW = 150;
    let rectH = 50;

    if (
      mouseX >= rectX - rectW / 2 &&
      mouseX <= rectX + rectW / 2 &&
      mouseY >= rectY - rectH / 2 &&
      mouseY <= rectY + rectH / 2
    ) {
      stage = 1;
    }
  }
}


function finePartita() {
  background(0);
  fill(255);
  textSize(50);
  textAlign(CENTER, CENTER);
  text(`Giocatore ${vincitore} vince!`, width / 2, height / 2);

  // suono di vittoria una sola volta
  if (millis() - finePartitaInizio < 100 && winSound && !winSound.isPlaying()) {
    winSound.play();
  }

  if (millis() - finePartitaInizio > 3000) {
    // reset punteggio e ritorno al menu iniziale
    g1Punto = 0;
    g2Punto = 0;
    stage = 0;

    // reset posizione giocatori e palla
    g1Y = height / 2;
    g2Y = height / 2;
    resetPalla();
  }
}




