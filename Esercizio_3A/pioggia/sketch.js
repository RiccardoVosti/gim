let colonne = [];
let fontSize = 20;
let simboliGraduali = ["█", "▓", "▒", "░"];
let maxScia = simboliGraduali.length;
let lineSpacing;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  textFont('monospace');
  textSize(fontSize);
  textAlign(CENTER, CENTER);

  // Calcolo dello spacing verticale preciso
  lineSpacing = textAscent() + textDescent() + 2; // +2 per un piccolo margine

  let numeroColonne = floor(width / fontSize);
  for (let i = 0; i < numeroColonne; i++) {
    colonne.push(new Goccia(i * fontSize));
  }

  frameRate(30);
}

function draw() {
  background(0, 150);

  for (let col of colonne) {
    col.update();
    col.render();
  }
}

class Goccia {
  constructor(x) {
    this.x = x;
    this.reset();
  }

  reset() {
    this.y = int(random(-200, 0));
    this.traccia = [];
    this.vel = random(0.5, 1.2);
    this.timer = 0;
    this.ritmo = int(random(2, 6));
  }

  update() {
    this.timer++;
    if (this.timer % this.ritmo !== 0) return;

    this.traccia.unshift({ y: this.y });
    this.y += this.vel * lineSpacing;

    if (this.traccia.length > maxScia) {
      this.traccia.pop();
    }

    if (this.y > height + lineSpacing) {
      this.reset();
    }
  }

  render() {
    for (let i = 0; i < this.traccia.length; i++) {
      let s = this.traccia[i];
      let glifo = simboliGraduali[i];
      let alpha = map(i, 0, maxScia, 255, 60);
      fill(0, 255, 0, alpha);
      text(glifo, this.x + fontSize / 2, s.y - i * lineSpacing);
    }
  }
}

