// Vercel Serverless Function for Vaporwave Nature Metadata

const MAX_SUPPLY = 100;
const CREATOR_NAME = "Your Name";
const CREATOR_ADDRESS = "tz1Mn66CLYJUmsrYSy23EFtdWBkHgqCooCzi";

const paletteNames = [
    "Classic Vaporwave", "Neon Dreams", "Electric Paradise", "Digital Candy",
    "Psychedelic Neon", "Acid Rainbow", "Cyber Burst", "Dark Psychedelic",
    "Purple Haze", "Violet Dreams", "Sunset Vibes", "Golden Hour",
    "Ocean Deep", "Deep Sea", "Fire & Ice", "Volcanic Freeze",
    "Alien World", "Toxic Garden", "Purple Haze", "Amethyst Dream",
    "Gold Rush", "Solar Flare"
];

function generateAttributes(tokenId) {
    const paletteIndex = tokenId % paletteNames.length;
    const palette = paletteNames[paletteIndex];
    
    const bgStyles = ["Dark Gradient", "Psychedelic", "Deep Space", "Sunset"];
    const bgStyle = bgStyles[(tokenId * 2) % bgStyles.length];
    
    const hasSun = (tokenId * 7) % 10 > 6;
    const hasMoon = (tokenId * 11) % 10 > 8;
    const hasStars = (tokenId * 13) % 10 > 4;
    
    const crystalCount = 3 + (tokenId * 7) % 13;
    const crystalTypes = ["Polygon", "Star", "Diamond", "Prism"];
    const dominantCrystalType = crystalTypes[(tokenId * 3) % crystalTypes.length];
    const wireframeCrystals = (tokenId * 29) % 10 > 7;
    const crystalStyle = wireframeCrystals ? "Wireframe" : "Solid";
    
    const mountainLayers = 2 + (tokenId * 5) % 6;
    const mountainStyles = ["Smooth", "Jagged", "Wavy"];
    const dominantMountainStyle = mountainStyles[(tokenId * 9) % mountainStyles.length];
    
    const waterWaves = 5 + (tokenId * 11) % 8;
    const waterStyle = (tokenId * 7) % 2 === 0 ? "Smooth" : "Choppy";
    
    const gridStyles = ["Dense", "Normal", "Sparse"];
    const gridStyle = gridStyles[(tokenId * 5) % gridStyles.length];
    const hasGlow = (tokenId * 31) % 10 > 6;
    
    return {
        palette, bgStyle, hasSun, hasMoon, hasStars, crystalCount,
        dominantCrystalType, crystalStyle, mountainLayers,
        dominantMountainStyle, waterWaves, waterStyle, gridStyle, hasGlow
    };
}

function calculateRarity(attrs) {
    let score = 0;
    if (attrs.crystalCount >= 13) score += 20;
    if (attrs.mountainLayers >= 6) score += 15;
    if (attrs.hasSun && attrs.hasMoon && attrs.hasStars) score += 25;
    if (attrs.crystalStyle === "Wireframe") score += 10;
    if (attrs.waterWaves >= 10) score += 5;
    if (attrs.hasGlow) score += 8;
    if (attrs.dominantCrystalType === "Prism") score += 7;
    if (attrs.bgStyle === "Psychedelic") score += 5;
    return score;
}

module.exports = (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    const url = new URL(req.url, `https://${req.headers.host}`);
    const path = url.pathname;
    
    // Root
    if (path === '/' || path === '/api/index.js') {
        return res.json({ 
            name: "Vaporwave Nature API", 
            version: "1.0.0",
            endpoints: ["/metadata/:id", "/view/:id", "/attributes/:id"]
        });
    }
    
    // Parse routes
    const metadataMatch = path.match(/^\/metadata\/(\d+)$/);
    const viewMatch = path.match(/^\/view\/(\d+)$/);
    const attributesMatch = path.match(/^\/attributes\/(\d+)$/);
    
    // /metadata/:tokenId
    if (metadataMatch) {
        const tokenId = parseInt(metadataMatch[1]);
        
        if (isNaN(tokenId) || tokenId < 0 || tokenId >= MAX_SUPPLY) {
            return res.status(404).json({ error: 'Token not found' });
        }
        
        const attrs = generateAttributes(tokenId);
        const rarity = calculateRarity(attrs);
        const baseUrl = `https://${req.headers.host}`;
        
        const metadata = {
            name: `Vaporwave Nature #${tokenId}`,
            description: "A generative artwork featuring crystalline formations, layered mountain ranges, and flowing water rendered in nostalgic vaporwave aesthetics.",
            artifactUri: `${baseUrl}/view/${tokenId}`,
            displayUri: `${baseUrl}/view/${tokenId}`,
            thumbnailUri: `${baseUrl}/view/${tokenId}`,
            creators: [CREATOR_NAME],
            decimals: 0,
            symbol: "VAPOR",
            isBooleanAmount: true,
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
            tags: ["generative", "vaporwave", "crystals", "mountains", "water"]
        };
        
        return res.json(metadata);
    }
    
    // /view/:tokenId
    if (viewMatch) {
        const tokenId = parseInt(viewMatch[1]);
        
        if (isNaN(tokenId) || tokenId < 0 || tokenId >= MAX_SUPPLY) {
            return res.status(404).send('Token not found');
        }
        
        const html = `<!DOCTYPE html>
<html><head><title>Vaporwave Nature #${tokenId}</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"></script></head>
<body style="margin:0;background:#000;">
<script src="/js/vaporwave-deterministic.js"></script>
<script>
const sketch = new p5(vaporwaveSketch); 
setTimeout(() => { window.generateFromTokenId(${tokenId}); }, 100);
</script>
</body></html>`;
        
        res.setHeader('Content-Type', 'text/html');
        return res.send(html);
    }
    
    // /attributes/:tokenId
    if (attributesMatch) {
        const tokenId = parseInt(attributesMatch[1]);
        
        if (isNaN(tokenId) || tokenId < 0 || tokenId >= MAX_SUPPLY) {
            return res.status(404).json({ error: 'Token not found' });
        }
        
        const attrs = generateAttributes(tokenId);
        const rarity = calculateRarity(attrs);
        
        return res.json({ tokenId, ...attrs, rarityScore: rarity });
    }
    
    // 404
    return res.status(404).json({ error: 'Not found' });
};
