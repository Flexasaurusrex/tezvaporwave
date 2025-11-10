// Vaporwave Nature - DETERMINISTIC Art Engine
// Each token ID generates the exact same artwork every time
// For use in: frontend preview, render endpoints, and metadata generation

const vaporwaveSketch = function(p) {
    let vaporwavePalettes = [
        // 22 psychedelic palettes
        ['#FF6EFF', '#00FFFF', '#FF10F0', '#01CDFE', '#B967FF'],
        ['#FE53BB', '#08F7FE', '#09FBD3', '#F5D300', '#FF006E'],
        ['#FF71CE', '#01CDFE', '#05FFA1', '#B967FF', '#FFFB96'],
        ['#FFB3FD', '#2DE2E6', '#F260AA', '#261447', '#FF9CEE'],
        ['#FF00FF', '#00FF00', '#FFFF00', '#00FFFF', '#FF0080'],
        ['#FF1493', '#00FF7F', '#FFD700', '#FF4500', '#7FFF00'],
        ['#FF69B4', '#00CED1', '#FF8C00', '#ADFF2F', '#FF1493'],
        ['#39FF14', '#FF10F0', '#FFFF00', '#FF006E', '#00F5FF'],
        ['#CCFF00', '#FF0090', '#00FFFF', '#FFAA00', '#FF006E'],
        ['#BFFF00', '#FF1493', '#00F5FF', '#FF4500', '#7FFF00'],
        ['#8A2BE2', '#FF1493', '#00CED1', '#FF6347', '#9400D3'],
        ['#4B0082', '#FF00FF', '#00FA9A', '#FF6347', '#8B008B'],
        ['#6A0DAD', '#FF69B4', '#00FFFF', '#FF4500', '#9932CC'],
        ['#FF6B6B', '#FFA500', '#FFD700', '#FF1493', '#FF69B4'],
        ['#FF4500', '#FF8C00', '#FFD700', '#FF1493', '#FFA07A'],
        ['#0000FF', '#00CED1', '#4169E1', '#1E90FF', '#87CEEB'],
        ['#006994', '#00D4FF', '#0096FF', '#00F5FF', '#40E0D0'],
        ['#FF0000', '#FF4500', '#00FFFF', '#0000FF', '#FF1493'],
        ['#DC143C', '#FF6347', '#00CED1', '#4169E1', '#FF69B4'],
        ['#00FF00', '#39FF14', '#CCFF00', '#7FFF00', '#ADFF2F'],
        ['#9400D3', '#8A2BE2', '#BA55D3', '#DA70D6', '#EE82EE'],
        ['#FFD700', '#FFA500', '#FF8C00', '#FF6347', '#FF4500']
    ];

    let mountains = [];
    let crystals = [];
    let waves = [];
    let palette;
    let bgGradient;
    let gridAlpha;
    let hasSun;
    let hasMoon;
    let hasStars;
    let gridStyle;
    let sunColor;
    let moonColor;

    // CRITICAL: This makes each token ID generate the SAME artwork every time
    window.generateFromTokenId = function(tokenId, canvasWidth = 800, canvasHeight = 800) {
        if (p.canvas) {
            p.resizeCanvas(canvasWidth, canvasHeight);
        } else {
            p.createCanvas(canvasWidth, canvasHeight);
        }
        
        // Use token ID as seed - THIS IS THE KEY!
        p.randomSeed(tokenId * 12345);
        p.noiseSeed(tokenId * 67890);
        
        // Reset state
        mountains = [];
        crystals = [];
        waves = [];
        hasSun = false;
        hasMoon = false;
        hasStars = false;
        
        // Generate based on token ID
        initializeFromTokenId(tokenId);
        p.clear();
        drawGenerativeArt();
        
        return {
            palette: palette,
            mountains: mountains.length,
            crystals: crystals.length,
            waves: waves.length,
            hasSun: hasSun,
            hasMoon: hasMoon,
            hasStars: hasStars
        };
    };

    p.setup = function() {
        let canvas = p.createCanvas(800, 800);
        if (document.getElementById('canvas-container')) {
            canvas.parent('canvas-container');
        }
        p.noLoop();
        
        // Default: generate token 0
        window.generateFromTokenId(0);
    };

    function initializeFromTokenId(tokenId) {
        // All generation based on token ID seed (already set in generateFromTokenId)
        
        // Palette selection (0-21)
        let paletteIndex = tokenId % vaporwavePalettes.length;
        palette = vaporwavePalettes[paletteIndex];
        
        // Background style (4 types)
        let bgStyle = (tokenId * 2) % 4;
        if (bgStyle === 0) {
            bgGradient = {
                top: p.color(20 + (tokenId * 7) % 50, 10, 50 + (tokenId * 11) % 80),
                bottom: p.color(80 + (tokenId * 13) % 50, 30, 100 + (tokenId * 17) % 80)
            };
        } else if (bgStyle === 1) {
            bgGradient = {
                top: p.color(palette[0]),
                bottom: p.color(palette[2])
            };
        } else if (bgStyle === 2) {
            bgGradient = {
                top: p.color(10, 5, 30),
                bottom: p.color(50, 20, 80)
            };
        } else {
            bgGradient = {
                top: p.color(255, 100, 150),
                bottom: p.color(100, 50, 150)
            };
        }
        
        gridAlpha = 15 + (tokenId * 3) % 35;
        gridStyle = (tokenId * 5) % 3;
        
        // Celestial objects
        hasSun = (tokenId * 7) % 10 > 6;
        hasMoon = (tokenId * 11) % 10 > 8;
        hasStars = (tokenId * 13) % 10 > 4;
        sunColor = palette[(tokenId * 3) % palette.length];
        moonColor = palette[(tokenId * 5) % palette.length];
        
        // Mountains (2-7 layers)
        let numMountainLayers = 2 + (tokenId * 5) % 6;
        for (let i = 0; i < numMountainLayers; i++) {
            mountains.push({
                y: p.map(i, 0, numMountainLayers, p.height * 0.3, p.height * 0.85),
                peaks: 3 + ((tokenId * 7 + i * 11) % 9),
                color: palette[i % palette.length],
                alpha: p.map(i, 0, numMountainLayers - 1, 200, 60),
                roughness: 0.3 + ((tokenId * 13 + i * 17) % 100) / 100.0,
                style: (tokenId * 9 + i) % 3,
                hasOutline: ((tokenId * 19 + i * 7) % 10) > 7
            });
        }
        
        // Crystals (3-15)
        let numCrystals = 3 + (tokenId * 7) % 13;
        for (let i = 0; i < numCrystals; i++) {
            crystals.push({
                x: p.map((tokenId * 17 + i * 23) % 100, 0, 100, p.width * 0.05, p.width * 0.95),
                y: p.map((tokenId * 19 + i * 29) % 100, 0, 100, p.height * 0.2, p.height * 0.75),
                size: 20 + ((tokenId * 11 + i * 13) % 130),
                rotation: p.map((tokenId * 13 + i * 7) % 100, 0, 100, -p.PI/4, p.PI/4),
                faces: 3 + ((tokenId * 23 + i * 19) % 6),
                color: palette[i % palette.length],
                wireframe: ((tokenId * 29 + i * 11) % 10) > 7,
                type: (tokenId * 3 + i) % 4,
                glow: ((tokenId * 31 + i * 13) % 10) > 6,
                innerColor: palette[(i + 2) % palette.length]
            });
        }
        
        // Water waves (5-12)
        let numWaves = 5 + (tokenId * 11) % 8;
        for (let i = 0; i < numWaves; i++) {
            waves.push({
                y: p.height * 0.7 + i * p.map(numWaves, 5, 12, 20, 10),
                amplitude: p.map(i, 0, numWaves, 20, 3),
                frequency: p.map(i, 0, numWaves, 0.008, 0.025),
                phase: ((tokenId * 37 + i * 41) % 628) / 100.0,
                color: palette[i % palette.length],
                alpha: p.map(i, 0, numWaves, 120, 20),
                style: (tokenId * 7 + i) % 2
            });
        }
    }

    function drawGenerativeArt() {
        drawGradient();
        
        if (hasSun) drawSun();
        if (hasMoon) drawMoon();
        if (hasStars) drawStars();
        
        drawGrid();
        drawWater();
        drawMountains();
        drawCrystals();
        drawScanlines();
        drawVignette();
        
        p.noFill();
        p.strokeWeight(3);
        p.stroke(palette[0]);
        p.rect(10, 10, p.width - 20, p.height - 20);
    }

    function drawGradient() {
        for (let y = 0; y < p.height; y++) {
            let inter = p.map(y, 0, p.height, 0, 1);
            let c = p.lerpColor(bgGradient.top, bgGradient.bottom, inter);
            p.stroke(c);
            p.line(0, y, p.width, y);
        }
    }
    
    function drawSun() {
        let sunX = p.width * 0.8;
        let sunY = p.height * 0.2;
        let sunSize = 80 + (p.random() * 70);
        
        p.drawingContext.shadowBlur = 50;
        p.drawingContext.shadowColor = sunColor;
        
        p.fill(sunColor);
        p.noStroke();
        p.ellipse(sunX, sunY, sunSize, sunSize);
        
        p.stroke(sunColor);
        p.strokeWeight(3);
        for (let i = 0; i < 12; i++) {
            let angle = (p.TWO_PI / 12) * i;
            let x1 = sunX + p.cos(angle) * (sunSize / 2 + 10);
            let y1 = sunY + p.sin(angle) * (sunSize / 2 + 10);
            let x2 = sunX + p.cos(angle) * (sunSize / 2 + 30);
            let y2 = sunY + p.sin(angle) * (sunSize / 2 + 30);
            p.line(x1, y1, x2, y2);
        }
        
        p.drawingContext.shadowBlur = 0;
    }
    
    function drawMoon() {
        let moonX = p.width * 0.2;
        let moonY = p.height * 0.15;
        let moonSize = 60 + (p.random() * 60);
        
        p.drawingContext.shadowBlur = 40;
        p.drawingContext.shadowColor = moonColor;
        
        p.fill(moonColor);
        p.noStroke();
        p.ellipse(moonX, moonY, moonSize, moonSize);
        
        p.fill(0, 0, 0, 30);
        for (let i = 0; i < 5; i++) {
            let cx = moonX + p.random(-moonSize/3, moonSize/3);
            let cy = moonY + p.random(-moonSize/3, moonSize/3);
            let cSize = moonSize/8 + p.random(moonSize/8);
            p.ellipse(cx, cy, cSize, cSize);
        }
        
        p.drawingContext.shadowBlur = 0;
    }
    
    function drawStars() {
        p.noStroke();
        for (let i = 0; i < 50; i++) {
            let x = p.random(p.width);
            let y = p.random(p.height * 0.6);
            let size = p.random(1, 4);
            let starColor = palette[p.floor(p.random(palette.length))];
            
            p.fill(starColor);
            
            if (p.random() > 0.7) {
                p.push();
                p.translate(x, y);
                p.beginShape();
                for (let j = 0; j < 5; j++) {
                    let angle = (p.TWO_PI / 5) * j - p.PI / 2;
                    let r = j % 2 === 0 ? size * 2 : size;
                    p.vertex(p.cos(angle) * r, p.sin(angle) * r);
                }
                p.endShape(p.CLOSE);
                p.pop();
            } else {
                p.ellipse(x, y, size, size);
            }
        }
    }

    function drawGrid() {
        p.stroke(255, 255, 255, gridAlpha);
        p.strokeWeight(1);
        
        let gridSize = gridStyle === 1 ? 25 : (gridStyle === 2 ? 60 : 40);
        
        for (let y = p.height * 0.6; y < p.height; y += gridSize) {
            let fade = p.map(y, p.height * 0.6, p.height, 1, 0.3);
            p.stroke(255, 255, 255, gridAlpha * fade);
            p.line(0, y, p.width, y);
        }
        
        for (let x = 0; x < p.width; x += gridSize) {
            p.stroke(255, 255, 255, gridAlpha * 0.5);
            p.line(x, p.height * 0.6, x, p.height);
        }
    }

    function drawMountains() {
        for (let mountain of mountains) {
            p.fill(mountain.color);
            p.stroke(mountain.color);
            p.strokeWeight(2);
            
            p.beginShape();
            p.vertex(0, p.height);
            
            let step = p.width / mountain.peaks / 2;
            
            for (let x = 0; x <= p.width; x += step) {
                let y;
                
                if (mountain.style === 0) {
                    let noiseVal = p.noise(x * 0.01 * mountain.roughness, mountain.y * 0.01);
                    y = p.map(noiseVal, 0, 1, mountain.y, mountain.y - p.height * 0.35);
                } else if (mountain.style === 1) {
                    let noiseVal = p.noise(x * 0.02 * mountain.roughness, mountain.y * 0.01);
                    y = p.map(noiseVal, 0, 1, mountain.y, mountain.y - p.height * 0.4);
                    y += p.random(-20, 20);
                } else {
                    let waveVal = p.sin(x * 0.02) * 30;
                    let noiseVal = p.noise(x * 0.008 * mountain.roughness, mountain.y * 0.01);
                    y = p.map(noiseVal, 0, 1, mountain.y, mountain.y - p.height * 0.3) + waveVal;
                }
                
                p.vertex(x, y);
            }
            
            p.vertex(p.width, p.height);
            p.endShape(p.CLOSE);
            
            if (mountain.hasOutline) {
                p.stroke(255, 255, 255, 80);
                p.strokeWeight(2);
                p.noFill();
                p.beginShape();
                for (let x = 0; x <= p.width; x += step) {
                    let y;
                    if (mountain.style === 0) {
                        let noiseVal = p.noise(x * 0.01 * mountain.roughness, mountain.y * 0.01);
                        y = p.map(noiseVal, 0, 1, mountain.y, mountain.y - p.height * 0.35);
                    } else if (mountain.style === 1) {
                        let noiseVal = p.noise(x * 0.02 * mountain.roughness, mountain.y * 0.01);
                        y = p.map(noiseVal, 0, 1, mountain.y, mountain.y - p.height * 0.4);
                    } else {
                        let waveVal = p.sin(x * 0.02) * 30;
                        let noiseVal = p.noise(x * 0.008 * mountain.roughness, mountain.y * 0.01);
                        y = p.map(noiseVal, 0, 1, mountain.y, mountain.y - p.height * 0.3) + waveVal;
                    }
                    p.vertex(x, y - 3);
                }
                p.endShape();
            }
        }
    }

    function drawCrystals() {
        for (let crystal of crystals) {
            p.push();
            p.translate(crystal.x, crystal.y);
            p.rotate(crystal.rotation);
            
            if (crystal.wireframe) {
                p.noFill();
                p.stroke(crystal.color);
                p.strokeWeight(3);
            } else {
                p.fill(crystal.color);
                p.stroke(255, 255, 255, 150);
                p.strokeWeight(2);
            }
            
            if (crystal.type === 0) {
                p.beginShape();
                for (let i = 0; i < crystal.faces; i++) {
                    let angle = p.TWO_PI * i / crystal.faces;
                    let r = crystal.size;
                    let x = p.cos(angle) * r;
                    let y = p.sin(angle) * r;
                    p.vertex(x, y);
                }
                p.endShape(p.CLOSE);
            } else if (crystal.type === 1) {
                p.beginShape();
                for (let i = 0; i < crystal.faces * 2; i++) {
                    let angle = p.TWO_PI * i / (crystal.faces * 2);
                    let r = i % 2 === 0 ? crystal.size : crystal.size * 0.5;
                    let x = p.cos(angle) * r;
                    let y = p.sin(angle) * r;
                    p.vertex(x, y);
                }
                p.endShape(p.CLOSE);
            } else if (crystal.type === 2) {
                p.beginShape();
                p.vertex(0, -crystal.size);
                p.vertex(crystal.size * 0.6, 0);
                p.vertex(0, crystal.size);
                p.vertex(-crystal.size * 0.6, 0);
                p.endShape(p.CLOSE);
            } else {
                p.beginShape();
                p.vertex(crystal.size * 0.5, -crystal.size * 0.8);
                p.vertex(crystal.size * 0.8, -crystal.size * 0.3);
                p.vertex(crystal.size * 0.8, crystal.size * 0.3);
                p.vertex(crystal.size * 0.5, crystal.size * 0.8);
                p.vertex(-crystal.size * 0.5, crystal.size * 0.8);
                p.vertex(-crystal.size * 0.8, crystal.size * 0.3);
                p.vertex(-crystal.size * 0.8, -crystal.size * 0.3);
                p.vertex(-crystal.size * 0.5, -crystal.size * 0.8);
                p.endShape(p.CLOSE);
            }
            
            if (!crystal.wireframe) {
                p.fill(crystal.innerColor);
                p.noStroke();
                
                if (crystal.type === 0) {
                    p.beginShape();
                    for (let i = 0; i < crystal.faces; i++) {
                        let angle = p.TWO_PI * i / crystal.faces;
                        let r = crystal.size * 0.4;
                        let x = p.cos(angle) * r;
                        let y = p.sin(angle) * r;
                        p.vertex(x, y);
                    }
                    p.endShape(p.CLOSE);
                } else if (crystal.type === 2) {
                    p.beginShape();
                    p.vertex(0, -crystal.size * 0.5);
                    p.vertex(crystal.size * 0.3, 0);
                    p.vertex(0, crystal.size * 0.5);
                    p.vertex(-crystal.size * 0.3, 0);
                    p.endShape(p.CLOSE);
                }
            }
            
            if (crystal.glow) {
                p.drawingContext.shadowBlur = 30;
                p.drawingContext.shadowColor = crystal.color;
            }
            
            p.pop();
            p.drawingContext.shadowBlur = 0;
        }
    }

    function drawWater() {
        p.noStroke();
        
        for (let wave of waves) {
            let waveColor = p.color(wave.color);
            waveColor.setAlpha(wave.alpha);
            p.fill(waveColor);
            
            p.beginShape();
            p.vertex(0, p.height);
            
            if (wave.style === 0) {
                for (let x = 0; x <= p.width; x += 5) {
                    let y = wave.y + p.sin(x * wave.frequency + wave.phase) * wave.amplitude;
                    p.vertex(x, y);
                }
            } else {
                for (let x = 0; x <= p.width; x += 10) {
                    let y = wave.y + p.sin(x * wave.frequency + wave.phase) * wave.amplitude;
                    y += p.random(-5, 5);
                    p.vertex(x, y);
                }
            }
            
            p.vertex(p.width, p.height);
            p.endShape(p.CLOSE);
        }
        
        for (let i = 0; i < 30; i++) {
            let x = p.random(p.width);
            let y = p.random(p.height * 0.7, p.height);
            let shimmerColor = palette[p.floor(p.random(palette.length))];
            p.fill(shimmerColor);
            p.noStroke();
            
            if (p.random() > 0.7) {
                p.ellipse(x, y, p.random(8, 15), p.random(2, 4));
            } else {
                p.ellipse(x, y, p.random(2, 8), p.random(2, 8));
            }
        }
    }

    function drawScanlines() {
        p.stroke(0, 0, 0, 30);
        p.strokeWeight(1);
        for (let y = 0; y < p.height; y += 4) {
            p.line(0, y, p.width, y);
        }
    }

    function drawVignette() {
        p.drawingContext.globalCompositeOperation = 'multiply';
        let gradient = p.drawingContext.createRadialGradient(p.width/2, p.height/2, 0, p.width/2, p.height/2, p.width * 0.7);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
        p.drawingContext.fillStyle = gradient;
        p.drawingContext.fillRect(0, 0, p.width, p.height);
        p.drawingContext.globalCompositeOperation = 'source-over';
    }
};

// For Node.js/browser compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = vaporwaveSketch;
}
