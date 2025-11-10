// Vaporwave Nature - Generative Art
// Features: Crystals, Mountains, Water
// Hash-seeded for deterministic generation

let tokenHash;
let vaporwavePalettes = [
  ['#FF6EFF', '#00FFFF', '#FF10F0', '#01CDFE', '#B967FF'],
  ['#FE53BB', '#08F7FE', '#09FBD3', '#F5D300', '#FF006E'],
  ['#FF71CE', '#01CDFE', '#05FFA1', '#B967FF', '#FFFB96'],
  ['#FFB3FD', '#2DE2E6', '#F260AA', '#261447', '#FF9CEE']
];

let mountains = [];
let crystals = [];
let waves = [];
let palette;
let bgGradient;
let gridAlpha;
let scanlineSpeed;

function setup() {
  createCanvas(800, 800);
  noLoop();
  
  // Generate from hash (in production, this comes from blockchain)
  if (!tokenHash) {
    tokenHash = generateRandomHash();
  }
  
  initializeFromHash(tokenHash);
  drawGenerativeArt();
}

function generateRandomHash() {
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += floor(random(16)).toString(16);
  }
  return hash;
}

function initializeFromHash(hash) {
  // Seed random from hash
  let seed = 0;
  for (let i = 2; i < hash.length; i++) {
    seed += parseInt(hash[i], 16);
  }
  randomSeed(seed);
  noiseSeed(seed);
  
  // Select palette
  let paletteIndex = floor(map(parseInt(hash.substr(2, 4), 16), 0, 65536, 0, vaporwavePalettes.length));
  palette = vaporwavePalettes[paletteIndex];
  
  // Background gradient colors
  bgGradient = {
    top: color(parseInt(hash.substr(6, 2), 16), parseInt(hash.substr(8, 2), 16), parseInt(hash.substr(10, 2), 16) + 100),
    bottom: color(parseInt(hash.substr(12, 2), 16) + 50, parseInt(hash.substr(14, 2), 16), parseInt(hash.substr(16, 2), 16) + 50)
  };
  
  // Grid and scanline parameters
  gridAlpha = map(parseInt(hash.substr(18, 2), 16), 0, 255, 10, 40);
  scanlineSpeed = map(parseInt(hash.substr(20, 2), 16), 0, 255, 0.5, 2);
  
  // Generate mountains (3-5 layers)
  let numMountainLayers = floor(map(parseInt(hash.substr(22, 2), 16), 0, 255, 3, 6));
  for (let i = 0; i < numMountainLayers; i++) {
    mountains.push({
      y: map(i, 0, numMountainLayers, height * 0.4, height * 0.8),
      peaks: floor(map(parseInt(hash.substr(24 + i * 2, 2), 16), 0, 255, 4, 8)),
      color: palette[i % palette.length],
      alpha: map(i, 0, numMountainLayers - 1, 180, 80),
      roughness: map(parseInt(hash.substr(30 + i, 2), 16), 0, 255, 0.3, 0.8)
    });
  }
  
  // Generate crystals (5-12)
  let numCrystals = floor(map(parseInt(hash.substr(40, 2), 16), 0, 255, 5, 13));
  for (let i = 0; i < numCrystals; i++) {
    let hashOffset = 42 + i * 4;
    crystals.push({
      x: map(parseInt(hash.substr(hashOffset, 2), 16), 0, 255, width * 0.1, width * 0.9),
      y: map(parseInt(hash.substr(hashOffset + 2, 2), 16), 0, 255, height * 0.3, height * 0.7),
      size: map(parseInt(hash.substr(hashOffset + 4, 2), 16), 0, 255, 30, 120),
      rotation: map(parseInt(hash.substr(hashOffset + 6, 2), 16), 0, 255, -PI/6, PI/6),
      faces: floor(map(parseInt(hash.substr(hashOffset + 8, 1), 16), 0, 15, 3, 7)),
      color: palette[i % palette.length],
      wireframe: parseInt(hash.substr(hashOffset + 10, 1), 16) > 8
    });
  }
  
  // Generate water waves
  for (let i = 0; i < 8; i++) {
    waves.push({
      y: height * 0.75 + i * 15,
      amplitude: map(i, 0, 8, 15, 5),
      frequency: map(i, 0, 8, 0.01, 0.02),
      phase: random(TWO_PI),
      color: palette[i % palette.length],
      alpha: map(i, 0, 8, 100, 30)
    });
  }
}

function drawGenerativeArt() {
  // Background gradient
  drawGradient();
  
  // Retro grid
  drawGrid();
  
  // Draw elements back to front
  drawWater();
  drawMountains();
  drawCrystals();
  
  // Vaporwave effects
  drawScanlines();
  drawVignette();
  
  // Optional: Frame
  noFill();
  strokeWeight(3);
  stroke(palette[0]);
  rect(10, 10, width - 20, height - 20);
}

function drawGradient() {
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(bgGradient.top, bgGradient.bottom, inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function drawGrid() {
  stroke(255, 255, 255, gridAlpha);
  strokeWeight(1);
  
  // Perspective grid on bottom half
  let gridSize = 40;
  let vanishingY = height * 0.3;
  
  // Horizontal lines
  for (let y = height * 0.6; y < height; y += gridSize) {
    let fade = map(y, height * 0.6, height, 1, 0.3);
    stroke(255, 255, 255, gridAlpha * fade);
    line(0, y, width, y);
  }
  
  // Perspective vertical lines
  for (let x = 0; x < width; x += gridSize) {
    stroke(255, 255, 255, gridAlpha * 0.5);
    line(x, height * 0.6, x, height);
  }
}

function drawMountains() {
  for (let mountain of mountains) {
    fill(mountain.color);
    stroke(mountain.color);
    strokeWeight(2);
    
    beginShape();
    vertex(0, height);
    
    for (let x = 0; x <= width; x += width / mountain.peaks / 2) {
      let noiseVal = noise(x * 0.01 * mountain.roughness, mountain.y * 0.01);
      let peakHeight = map(noiseVal, 0, 1, mountain.y, mountain.y - height * 0.3);
      vertex(x, peakHeight);
    }
    
    vertex(width, height);
    endShape(CLOSE);
    
    // Add some highlights
    stroke(255, 255, 255, 50);
    strokeWeight(1);
    noFill();
    beginShape();
    for (let x = 0; x <= width; x += width / mountain.peaks / 2) {
      let noiseVal = noise(x * 0.01 * mountain.roughness, mountain.y * 0.01);
      let peakHeight = map(noiseVal, 0, 1, mountain.y, mountain.y - height * 0.3);
      vertex(x, peakHeight - 2);
    }
    endShape();
  }
}

function drawCrystals() {
  for (let crystal of crystals) {
    push();
    translate(crystal.x, crystal.y);
    rotate(crystal.rotation);
    
    if (crystal.wireframe) {
      noFill();
      stroke(crystal.color);
      strokeWeight(2);
    } else {
      fill(crystal.color);
      stroke(255, 255, 255, 150);
      strokeWeight(2);
    }
    
    // Draw geometric crystal
    beginShape();
    for (let i = 0; i < crystal.faces; i++) {
      let angle = TWO_PI * i / crystal.faces;
      let r = crystal.size;
      let x = cos(angle) * r;
      let y = sin(angle) * r;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Inner facets
    if (!crystal.wireframe) {
      fill(255, 255, 255, 100);
      noStroke();
      beginShape();
      for (let i = 0; i < crystal.faces; i++) {
        let angle = TWO_PI * i / crystal.faces;
        let r = crystal.size * 0.5;
        let x = cos(angle) * r;
        let y = sin(angle) * r;
        vertex(x, y);
      }
      endShape(CLOSE);
    }
    
    // Glow effect
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = crystal.color;
    
    pop();
    drawingContext.shadowBlur = 0;
  }
}

function drawWater() {
  noStroke();
  
  for (let wave of waves) {
    fill(wave.color + hex(Math.floor(wave.alpha)));
    
    beginShape();
    vertex(0, height);
    
    for (let x = 0; x <= width; x += 5) {
      let y = wave.y + sin(x * wave.frequency + wave.phase) * wave.amplitude;
      vertex(x, y);
    }
    
    vertex(width, height);
    endShape(CLOSE);
  }
  
  // Water reflections (simple shimmer)
  for (let i = 0; i < 20; i++) {
    let x = random(width);
    let y = random(height * 0.75, height);
    fill(255, 255, 255, random(30, 80));
    noStroke();
    ellipse(x, y, random(2, 8), random(1, 3));
  }
}

function drawScanlines() {
  stroke(0, 0, 0, 30);
  strokeWeight(1);
  for (let y = 0; y < height; y += 4) {
    line(0, y, width, y);
  }
}

function drawVignette() {
  drawingContext.globalCompositeOperation = 'multiply';
  let gradient = drawingContext.createRadialGradient(width/2, height/2, 0, width/2, height/2, width * 0.7);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
  drawingContext.fillStyle = gradient;
  drawingContext.fillRect(0, 0, width, height);
  drawingContext.globalCompositeOperation = 'source-over';
}

// For testing - regenerate on click
function mousePressed() {
  tokenHash = generateRandomHash();
  mountains = [];
  crystals = [];
  waves = [];
  initializeFromHash(tokenHash);
  redraw();
}

// Export for integration
function setTokenHash(hash) {
  tokenHash = hash;
  mountains = [];
  crystals = [];
  waves = [];
  initializeFromHash(tokenHash);
  redraw();
}
