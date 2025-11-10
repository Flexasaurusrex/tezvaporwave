// Metadata API Server for Vaporwave Nature
// Generates metadata on-demand for any token ID
// Run with: node metadata-api.js

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Configuration
const BASE_URL = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';

const MAX_SUPPLY = 100;
const CREATOR_NAME = "Your Name";  // ← CHANGE THIS
const CREATOR_ADDRESS = "tz1...";  // ← CHANGE THIS to your Tezos address

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Palette names (matching the deterministic art engine)
const paletteNames = [
    "Classic Vaporwave", "Neon Dreams", "Electric Paradise", "Digital Candy",
    "Psychedelic Neon", "Acid Rainbow", "Cyber Burst", "Dark Psychedelic",
    "Purple Haze", "Violet Dreams", "Sunset Vibes", "Golden Hour",
    "Ocean Deep", "Deep Sea", "Fire & Ice", "Volcanic Freeze",
    "Alien World", "Toxic Garden", "Purple Haze", "Amethyst Dream",
    "Gold Rush", "Solar Flare"
];

// Generate deterministic attributes from token ID
function generateAttributes(tokenId) {
    // Palette
    const paletteIndex = tokenId % paletteNames.length;
    const palette = paletteNames[paletteIndex];
    
    // Background style
    const bgStyles = ["Dark Gradient", "Psychedelic", "Deep Space", "Sunset"];
    const bgStyle = bgStyles[(tokenId * 2) % bgStyles.length];
    
    // Celestial objects
    const hasSun = (tokenId * 7) % 10 > 6;
    const hasMoon = (tokenId * 11) % 10 > 8;
    const hasStars = (tokenId * 13) % 10 > 4;
    
    // Crystal count (3-15)
    const crystalCount = 3 + (tokenId * 7) % 13;
    
    // Crystal types
    const crystalTypes = ["Polygon", "Star", "Diamond", "Prism"];
    const dominantCrystalType = crystalTypes[(tokenId * 3) % crystalTypes.length];
    
    // Crystal style
    const wireframeCrystals = (tokenId * 29) % 10 > 7;
    const crystalStyle = wireframeCrystals ? "Wireframe" : "Solid";
    
    // Mountain layers (2-7)
    const mountainLayers = 2 + (tokenId * 5) % 6;
    
    // Mountain style
    const mountainStyles = ["Smooth", "Jagged", "Wavy"];
    const dominantMountainStyle = mountainStyles[(tokenId * 9) % mountainStyles.length];
    
    // Water waves (5-12)
    const waterWaves = 5 + (tokenId * 11) % 8;
    
    // Water style
    const waterStyle = (tokenId * 7) % 2 === 0 ? "Smooth" : "Choppy";
    
    // Grid intensity
    const gridStyles = ["Dense", "Normal", "Sparse"];
    const gridStyle = gridStyles[(tokenId * 5) % gridStyles.length];
    
    // Glow effects
    const hasGlow = (tokenId * 31) % 10 > 6;
    
    return {
        palette,
        bgStyle,
        hasSun,
        hasMoon,
        hasStars,
        crystalCount,
        dominantCrystalType,
        crystalStyle,
        mountainLayers,
        dominantMountainStyle,
        waterWaves,
        waterStyle,
        gridStyle,
        hasGlow
    };
}

// Calculate rarity score
function calculateRarity(attrs) {
    let score = 0;
    if (attrs.crystalCount >= 13) score += 20;
    if (attrs.mountainLayers >= 6) score += 15;
    if (attrs.hasSun && attrs.hasMoon && attrs.hasStars) score += 25; // ULTRA RARE
    if (attrs.crystalStyle === "Wireframe") score += 10;
    if (attrs.waterWaves >= 10) score += 5;
    if (attrs.hasGlow) score += 8;
    if (attrs.dominantCrystalType === "Prism") score += 7;
    if (attrs.bgStyle === "Psychedelic") score += 5;
    return score;
}

// GET /metadata/:tokenId - Returns metadata for a specific token
app.get('/metadata/:tokenId', (req, res) => {
    const tokenId = parseInt(req.params.tokenId);
    
    // Validate token ID
    if (isNaN(tokenId) || tokenId < 0 || tokenId >= MAX_SUPPLY) {
        return res.status(404).json({ error: 'Token not found' });
    }
    
    const attrs = generateAttributes(tokenId);
    const rarity = calculateRarity(attrs);
    
    const metadata = {
        name: `Vaporwave Nature #${tokenId}`,
        description: "A generative artwork featuring crystalline formations, layered mountain ranges, and flowing water rendered in nostalgic vaporwave aesthetics. Each piece is algorithmically unique and generated deterministically from its token ID.",
        
        // Image URIs - point to your render endpoints
        artifactUri: `${BASE_URL}/render/${tokenId}.png`,
        displayUri: `${BASE_URL}/render/${tokenId}.png`,
        thumbnailUri: `${BASE_URL}/render/${tokenId}_thumb.png`,
        
        // Alternative: point to live generative version
        animation_url: `${BASE_URL}/view/${tokenId}`,
        
        creators: [CREATOR_NAME],
        date: new Date().toISOString(),
        decimals: 0,
        symbol: "VAPOR",
        isBooleanAmount: true,
        shouldPreferSymbol: false,
        
        // Attributes for filtering/sorting on marketplaces
        attributes: [
            { name: "Palette", value: attrs.palette },
            { name: "Background Style", value: attrs.bgStyle },
            { name: "Crystal Count", value: attrs.crystalCount.toString() },
            { name: "Crystal Type", value: attrs.dominantCrystalType },
            { name: "Crystal Style", value: attrs.crystalStyle },
            { name: "Mountain Layers", value: attrs.mountainLayers.toString() },
            { name: "Mountain Style", value: attrs.dominantMountainStyle },
            { name: "Water Waves", value: attrs.waterWaves.toString() },
            { name: "Water Style", value: attrs.waterStyle },
            { name: "Grid Style", value: attrs.gridStyle },
            { name: "Has Sun", value: attrs.hasSun ? "Yes" : "No" },
            { name: "Has Moon", value: attrs.hasMoon ? "Yes" : "No" },
            { name: "Has Stars", value: attrs.hasStars ? "Yes" : "No" },
            { name: "Glow Effect", value: attrs.hasGlow ? "Yes" : "No" },
            { name: "Rarity Score", value: rarity.toString() }
        ],
        
        tags: [
            "generative",
            "vaporwave",
            "crystals",
            "mountains",
            "water",
            "aesthetic",
            "procedural",
            "on-chain"
        ],
        
        formats: [
            {
                uri: `${BASE_URL}/render/${tokenId}.png`,
                mimeType: "image/png",
                dimensions: {
                    value: "800x800",
                    unit: "px"
                }
            }
        ],
        
        // Optional: Royalties (10% to creator)
        royalties: {
            decimals: 2,
            shares: {
                [CREATOR_ADDRESS]: 10
            }
        }
    };
    
    res.json(metadata);
});

// GET /view/:tokenId - Returns HTML page that renders the token
app.get('/view/:tokenId', (req, res) => {
    const tokenId = parseInt(req.params.tokenId);
    
    if (isNaN(tokenId) || tokenId < 0 || tokenId >= MAX_SUPPLY) {
        return res.status(404).send('Token not found');
    }
    
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vaporwave Nature #${tokenId}</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #000;
            font-family: 'Courier New', monospace;
            color: #0FF;
        }
        #canvas-container {
            position: relative;
        }
        .info {
            position: absolute;
            top: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.8);
            padding: 10px;
            border: 1px solid #0FF;
        }
    </style>
</head>
<body>
    <div id="canvas-container">
        <div class="info">Token #${tokenId}</div>
    </div>
    
    <script src="${BASE_URL}/js/vaporwave-deterministic.js"></script>
    <script>
        const sketch = new p5(vaporwaveSketch);
        // Generate this specific token
        setTimeout(() => {
            window.generateFromTokenId(${tokenId});
        }, 100);
    </script>
</body>
</html>
    `;
    
    res.send(html);
});

// GET /attributes/:tokenId - Returns just the attributes (for debugging)
app.get('/attributes/:tokenId', (req, res) => {
    const tokenId = parseInt(req.params.tokenId);
    
    if (isNaN(tokenId) || tokenId < 0 || tokenId >= MAX_SUPPLY) {
        return res.status(404).json({ error: 'Token not found' });
    }
    
    const attrs = generateAttributes(tokenId);
    const rarity = calculateRarity(attrs);
    
    res.json({
        tokenId,
        ...attrs,
        rarityScore: rarity
    });
});

// GET /collection/stats - Returns collection statistics
app.get('/collection/stats', (req, res) => {
    const stats = {
        totalSupply: MAX_SUPPLY,
        palettes: {},
        celestial: { sun: 0, moon: 0, stars: 0, all: 0 },
        rarityDistribution: []
    };
    
    for (let i = 0; i < MAX_SUPPLY; i++) {
        const attrs = generateAttributes(i);
        const rarity = calculateRarity(attrs);
        
        stats.palettes[attrs.palette] = (stats.palettes[attrs.palette] || 0) + 1;
        if (attrs.hasSun) stats.celestial.sun++;
        if (attrs.hasMoon) stats.celestial.moon++;
        if (attrs.hasStars) stats.celestial.stars++;
        if (attrs.hasSun && attrs.hasMoon && attrs.hasStars) stats.celestial.all++;
        
        stats.rarityDistribution.push(rarity);
    }
    
    const avg = stats.rarityDistribution.reduce((a, b) => a + b, 0) / MAX_SUPPLY;
    stats.avgRarity = Math.round(avg * 10) / 10;
    stats.maxRarity = Math.max(...stats.rarityDistribution);
    stats.minRarity = Math.min(...stats.rarityDistribution);
    
    res.json(stats);
});

// Health check
app.get('/', (req, res) => {
    res.json({
        name: "Vaporwave Nature Metadata API",
        version: "1.0.0",
        endpoints: {
            metadata: "/metadata/:tokenId",
            view: "/view/:tokenId",
            attributes: "/attributes/:tokenId",
            stats: "/collection/stats"
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🌊 Vaporwave Nature Metadata API running on port ${PORT}`);
    console.log(`📊 Collection size: ${MAX_SUPPLY} tokens`);
    console.log(`\nEndpoints:`);
    console.log(`  GET /metadata/:tokenId    - Token metadata`);
    console.log(`  GET /view/:tokenId        - Render token`);
    console.log(`  GET /attributes/:tokenId  - Token attributes`);
    console.log(`  GET /collection/stats     - Collection stats`);
});

module.exports = app;
