let flakes = [];
let letters = ['❄', '*', '✻', '❅', '❆', '❇'];
let gravity = 0.01;
let groundHeight = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(24);

  for (let i = 0; i < 50; i++) {
    flakes.push(new Flake(random(width), random(-height, 0)));
  }
}

function draw() {
  background(0);  // sfondo nero

  fill(255);
  noStroke();
  rect(0, height - groundHeight, width, groundHeight);

  for (let flake of flakes) {
    flake.applyGravity();
    flake.update();
    flake.checkCollision(flakes);
    flake.display();
  }

  if (frameCount % 15 === 0 && flakes.length < 150) {
    flakes.push(new Flake(random(width), -20));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Flake {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.stuck = false;
    this.size = random(20, 30);
    this.letter = random(letters);
    this.oscillationAngle = random(TWO_PI); // per oscillazione iniziale casuale
  }

  applyGravity() {
    if (!this.stuck) {
      this.acc.y = gravity;
    } else {
      this.acc.set(0, 0);
      this.vel.set(0, 0);
    }
  }

  update() {
    if (!this.stuck) {
      // Aggiungo oscillazione orizzontale (piccola e lenta)
      this.oscillationAngle += 0.02;
      let oscillationX = sin(this.oscillationAngle) * 0.5; // ampiezza 0.5 px

      this.vel.x = oscillationX;
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.set(0, 0);
    }
  }

  checkCollision(allFlakes) {
    if (this.pos.y + this.size / 2 >= height - groundHeight) {
      this.pos.y = height - groundHeight - this.size / 2;
      this.stuck = true;
      this.vel.set(0, 0);
      return;
    }

    for (let other of allFlakes) {
      if (other === this || !other.stuck) continue;

      let dX = abs(this.pos.x - other.pos.x);
      let dY = other.pos.y - this.pos.y;

      if (dY > 0 && dY < (this.size + other.size) / 2 && dX < (this.size + other.size) / 2) {
        this.pos.y = other.pos.y - (this.size + other.size) / 2 + 1;
        this.stuck = true;
        this.vel.set(0, 0);
        return;
      }
    }
  }

  display() {
    fill(255);
    textSize(this.size);
    text(this.letter, this.pos.x, this.pos.y);
  }
}
