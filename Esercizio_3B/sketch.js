// Clock variables
let font; 
let points = [];
let msg; 
let xPos; 
let yPos; 
let fontSize = 140;  

// Game of Life variables
let cols; 
let rows; 
let size = 10;
let grid = []; 
let clock = [];
let regen = [];  // tiene traccia delle celle appena rigenerate
let distanceFromPoints = 10;

// Color variables
let hueValue = 0;
let colorSpeed = 5;   // velocità cambio colore

function preload() {
  font = loadFont("Roboto.ttf");
}

function setup() {
  createCanvas(800, 300);
  cols = width / size;
  rows = height / size;

  // Centrare orologio
  msg = "00:00:00";
  let bounds = font.textBounds(msg, 0, 0, fontSize);
  textAlign(CENTER, CENTER);
  xPos = 80; 
  yPos = 190;

  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    clock[i] = [];
    regen[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = 0;
      clock[i][j] = 0;
      regen[i][j] = 0;
    }
  }
}

function draw() {
  background(0);

  // Getting real-time clock data
  let h_msg = doubleDigits(hour());
  let m_msg = doubleDigits(minute());
  let s_msg = doubleDigits(second());

  msg = h_msg + ":" + m_msg + ":" + s_msg;
  points = font.textToPoints(msg, xPos, yPos, fontSize);

  // Disegna celle
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * size;
      let y = j * size;

      for (let k = 0; k < points.length; k++) {
        let distance = dist(points[k].x, points[k].y, x, y);
        if (distance < distanceFromPoints) {
          grid[i][j] = 1;
          clock[i][j] = 1;
        }
      }

      // Mostra celle rigenerate in rosso
      if (regen[i][j] > 0) {
        fill(173, 255, 47);
        noStroke();
        rect(x, y, size, size);
        regen[i][j]--; // scala il timer
        continue;
      }

      noFill();
      if (grid[i][j] == 1) {
        stroke(255);
      } else {
        noStroke();
      }
      rect(x, y, size, size);

      if (clock[i][j] == 1) {
        fill(255);
      } else {
        noStroke();
      }
      rect(x, y, size, size);

      clock[i][j] = 0;
    }
  }

  // Calcolo prossima generazione
  let nextGen = [];
  for (let i = 0; i < cols; i++) {
    nextGen[i] = [];
    for (let j = 0; j < rows; j++) {
      let n = neighboringStates(grid, i, j);
      if (grid[i][j] == 1 && n < 2) {
        nextGen[i][j] = 0;
      } else if (grid[i][j] == 1 && (n == 2 || n == 3)) {
        nextGen[i][j] = 1;
      } else if (grid[i][j] == 1 && n > 3) {
        nextGen[i][j] = 0;
      } else if (grid[i][j] == 0 && n == 3) {
        nextGen[i][j] = 1;
        regen[i][j] = 2; // durata in frame del colore rosso
      } else {
        nextGen[i][j] = grid[i][j];
      }
    }
  }

  grid = nextGen;

  // Colore in ciclo
  hueValue += colorSpeed;
  if (hueValue > 255) {
    hueValue = 0;
  }
}

function neighboringStates(grid, x, y) {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let xIndex = (x + i + cols) % cols;
      let yIndex = (y + j + rows) % rows;
      sum += grid[xIndex][yIndex];
    }
  }
  sum -= grid[x][y];
  return sum;
}

function doubleDigits(integer) {
  let intToString = integer.toString();
  let msg;
  if (intToString.length == 1) {
    msg = "0" + intToString;
  } else {
    msg = intToString;
  }
  return msg;
}