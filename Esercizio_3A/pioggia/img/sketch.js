// variabili globali immagini e riflessi
let img1, img2, img3, img4, img5;
let riflessoFrames = [];
let totalRiflessoFrames = 10;
let lineGif, lineGif2;  // aggiunto lineGif2

// Variabili per il cambio colore casuale con blendMode e tasto B
let biancoAttivo = false;

let immagini = [];
let immaginiBianche = [];
let riflessoFramesBianchi = [];
let clickFramesBianchi = [];
let lineGifBianco;

// Animazione click
let clickFrames = [];
let totalClickFrames = 13;
let clickAttivo = false;
let clickX = 0;
let clickY = 0;
let frameInizioClick = 0;

// Array e dimensioni
let goccePioggia = [];
let offsetBase = [0, -23, -46, -69, -92];
let dimensionePasso = 23;
let intervalloPassoBase = 6;
let numeroGocce = 28;
let dimensioneGriglia = 23;
let colonneOccupate = new Set();
let riflessi = [];
let mostraDebug = true;

// -------  1. Preload  -------------------------------------------------------------------------------
function preload() {
  img1 = loadImage('/pieno.jpg');
  img2 = loadImage('/alto.png');
  img3 = loadImage('/medio.png');
  img4 = loadImage('/poco.png');
  img5 = loadImage('/pochissimo.png');
  lineGif = loadImage('/line.gif');
  lineGif2 = loadImage('/line2.gif');

  for (let i = 0; i < totalRiflessoFrames; i++) {
    let frameNum = i.toString().padStart(2, '0');
    riflessoFrames[i] = loadImage(`/riflesso/riflesso_${frameNum}.png`);
  }

  for (let i = 0; i < totalClickFrames; i++) {
    let numero = 100 + i;
    clickFrames[i] = loadImage(`/click/click_${numero}.png`);
  }
}

// ------- 2. Setup -------------------------------------------------------------------------------
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  textFont('Roboto Mono');

  immagini = [img1, img2, img3, img4, img5];
  immaginiBianche = [];
  riflessoFramesBianchi = [];
  clickFramesBianchi = [];
  goccePioggia = [];
  colonneOccupate.clear();
  riflessi = [];

  let colonne = Math.floor(width / dimensioneGriglia);
  numeroGocce = Math.floor(colonne / 2);

  for (let i = 0; i < numeroGocce; i++) {
    let colonna;
    let tentativi = 0;

    do {
      colonna = Math.floor(random(0, colonne));
      tentativi++;
    } while (colonnaTroppoVicino(colonna) && tentativi < 100);

    marcaColonnaEVicini(colonna);

    goccePioggia.push({
      x: colonna * dimensioneGriglia,
      y: randomYMultiplo46(-500, -100),
      offset: [...offsetBase],
      velocita: random(0.7, 1.3),
      ultimoFrameMovimento: 0,
      ritardoIniziale: frameCount + floor(random(0, 600))
    });
  }

  if (lineGif) {
    lineGifBianco = creaImmagineBianca(lineGif);
  }
}

// ------- 3. Draw -------------------------------------------------------------------------------
function draw() {
  if (biancoAttivo) {
    background(0);

    // disegno immagini bianche
    for (let goccia of goccePioggia) {
      if (frameCount >= goccia.ritardoIniziale) {
        push();
        for (let i = 0; i < immagini.length; i++) {
          image(immaginiBianche[i], goccia.x, goccia.y + goccia.offset[i]);
        }
        pop();
      }
    }

    // disegna riflessi bianchi
    for (let i = riflessi.length - 1; i >= 0; i--) {
      let r = riflessi[i];
      let frameIndex = frameCount - r.frameInizio;
      if (frameIndex < riflessoFramesBianchi.length) {
        image(riflessoFramesBianchi[frameIndex], r.x - riflessoFramesBianchi[frameIndex].width / 2 + dimensioneGriglia / 2, r.y - 46);
      } else {
        riflessi.splice(i, 1);
      }
    }

    // animazione click bianca
    if (clickAttivo) {
      let frameCorrente = frameCount - frameInizioClick;
      if (frameCorrente < clickFramesBianchi.length) {
        image(clickFramesBianchi[frameCorrente], clickX - clickFramesBianchi[frameCorrente].width / 2, clickY - clickFramesBianchi[frameCorrente].height / 2);
      } else {
        clickAttivo = false;
      }
    }

  } else {
    background(255);

    for (let goccia of goccePioggia) {
      if (frameCount >= goccia.ritardoIniziale) {
        push();
        for (let i = 0; i < immagini.length; i++) {
          noTint();
          image(immagini[i], goccia.x, goccia.y + goccia.offset[i]);
        }
        pop();
      }
    }

    for (let i = riflessi.length - 1; i >= 0; i--) {
      let r = riflessi[i];
      let frameIndex = frameCount - r.frameInizio;
      if (frameIndex < riflessoFrames.length) {
        image(riflessoFrames[frameIndex], r.x - riflessoFrames[frameIndex].width / 2 + dimensioneGriglia / 2, r.y - 46);
      } else {
        riflessi.splice(i, 1);
      }
    }

    if (clickAttivo) {
      let frameCorrente = frameCount - frameInizioClick;
      if (frameCorrente < clickFrames.length) {
        image(clickFrames[frameCorrente], clickX - clickFrames[frameCorrente].width / 2, clickY - clickFrames[frameCorrente].height / 2);
      } else {
        clickAttivo = false;
      }
    }
  }

  if (mostraDebug) {
    push();
    if (biancoAttivo) {
      fill(255);
      background(0, 180);
      if (lineGif2) {
        image(lineGif2, 5, 7, 5, 60);
      }
    } else {
      fill(0, 0, 230);
      if (lineGif) {
        image(lineGif, 5, 7, 5, 60);
      }
    }

    textSize(12);
    textFont('Roboto Mono');
    text(
      "Velocità base: ogni " + (intervalloPassoBase / 60).toFixed(2) + "s, step di " + dimensionePasso + "px",
      15,
      20
    );
    text("Gocce totali: " + goccePioggia.length, 15, 35);
    text("Colonne griglia: " + Math.floor(width / dimensioneGriglia), 15, 50);
    text("Controlli: R-reset | P-pausa | F-veloce | S-lento | N-normale | D-debug | B-Bianco/Nero", 15, 65);
    pop();
  }
}

// ------- 4. Mouse click ---------------------------------------------------------------------------
function mouseClicked() {
  let col = Math.floor(mouseX / dimensioneGriglia);
  let row = Math.floor(mouseY / dimensioneGriglia);

  clickX = col * dimensioneGriglia + dimensioneGriglia / 2;
  clickY = row * dimensioneGriglia + dimensioneGriglia / 2;

  clickAttivo = true;
  frameInizioClick = frameCount;
}

// ------- 5. Movimento gocce e riflessi ------------------------------------------------------------
function muoviTutteLeGocce() {
  let colonne = Math.floor(width / dimensioneGriglia);

  for (let goccia of goccePioggia) {
    if (frameCount < goccia.ritardoIniziale) continue;

    let intervalloGoccia = Math.round(intervalloPassoBase / goccia.velocita);

    if (frameCount - goccia.ultimoFrameMovimento >= intervalloGoccia) {
      goccia.y += dimensionePasso;
      goccia.ultimoFrameMovimento = frameCount;

      if (goccia.y >= height && goccia.y - dimensionePasso < height) {
        riflessi.push({
          x: goccia.x,
          y: height,
          frameInizio: frameCount
        });
      }

      if (goccia.y > height + 115) {
        let colonnaVecchia = goccia.x / dimensioneGriglia;
        smarcaColonnaEVicini(colonnaVecchia);

        goccia.y = randomYMultiplo46(-500, -100);

        let colonna;
        let tentativi = 0;
        do {
          colonna = Math.floor(random(0, colonne));
          tentativi++;
        } while (colonnaTroppoVicino(colonna) && tentativi < 100);

        goccia.x = colonna * dimensioneGriglia;
        marcaColonnaEVicini(colonna);

        goccia.velocita = random(0.7, 1.3);
        goccia.ritardoIniziale = frameCount + floor(random(0, 600));
      }
    }
  }
}

// ------- 6. Funzioni utili -------------------------------------------------------------------------
function randomYMultiplo46(minY, maxY) {
  let passi = Math.floor((maxY - minY) / 46);
  let step = Math.floor(random(0, passi + 1));
  return minY + step * 46;
}

function colonnaTroppoVicino(colonna) {
  return (
    colonneOccupate.has(colonna - 1) ||
    colonneOccupate.has(colonna) ||
    colonneOccupate.has(colonna + 1)
  );
}

function marcaColonnaEVicini(colonna) {
  colonneOccupate.add(colonna);
  colonneOccupate.add(colonna - 1);
  colonneOccupate.add(colonna + 1);
}

function smarcaColonnaEVicini(colonna) {
  colonneOccupate.delete(colonna);
  colonneOccupate.delete(colonna - 1);
  colonneOccupate.delete(colonna + 1);
}

// ------- 7. Gestione tasti ---------------------------------------------------------
function keyPressed() {
  if (key === 'r' || key === 'R') setup();
  if (key === 'p' || key === 'P') intervalloPassoBase = intervalloPassoBase === 6 ? 999999 : 6;
  if (key === 'f' || key === 'F') intervalloPassoBase = 3;
  if (key === 's' || key === 'S') intervalloPassoBase = 12;
  if (key === 'n' || key === 'N') intervalloPassoBase = 6;
  if (key === 'd' || key === 'D') mostraDebug = !mostraDebug;

  if (key === 'b' || key === 'B') {
    if (!biancoAttivo) {
      biancoAttivo = true;
      creaImmaginiBianche();
    } else {
      biancoAttivo = false;
      immaginiBianche = [];
      riflessoFramesBianchi = [];
      clickFramesBianchi = [];
    }
  }
}

// ------- 8. Creazione immagini bianche ---------------------------------------------------
function creaImmaginiBianche() {
  immaginiBianche = immagini.map(img => creaImmagineBianca(img));
  riflessoFramesBianchi = riflessoFrames.map(img => creaImmagineBianca(img));
  clickFramesBianchi = clickFrames.map(img => creaImmagineBianca(img));
}

// ------- 9. Funzione per creare immagine bianca ------------------------------------------
function creaImmagineBianca(imgOrig) {
  let imgBianca = createImage(imgOrig.width, imgOrig.height);
  imgOrig.loadPixels();
  imgBianca.loadPixels();
  
  for (let i = 0; i < imgOrig.pixels.length; i += 4) {
    let alpha = imgOrig.pixels[i + 3];
    
    if (alpha < 128) {
      // Trasparente: lascia tutto a 0
      imgBianca.pixels[i] = 0;
      imgBianca.pixels[i + 1] = 0;
      imgBianca.pixels[i + 2] = 0;
      imgBianca.pixels[i + 3] = 0;
    } else {
      // Opaco: imposta bianco puro e mantieni alpha originale
      imgBianca.pixels[i] = 255;
      imgBianca.pixels[i + 1] = 255;
      imgBianca.pixels[i + 2] = 255;
      imgBianca.pixels[i + 3] = alpha; // conserva alpha originale
    }
  }
  
  imgBianca.updatePixels();
  return imgBianca;
}

// ------- 10. Loop principale ---------------------------------------------------------------
function mainLoop() {
  muoviTutteLeGocce();
}

setInterval(mainLoop, 1000 / 60);

// ------- 11. Resize finestra ---------------------------------------------------------------
function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  setup();

  if (biancoAttivo) {
    creaImmaginiBianche();
  } else if (colorModeAttivo) {
    creaImmaginiColorate();
  }
}