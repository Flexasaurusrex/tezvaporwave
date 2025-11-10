// Metadata Generator for Vaporwave Nature
// Run with: node generate_metadata.js

const fs = require('fs');
const path = require('path');

// Configuration
const TOTAL_SUPPLY = 100;
const IPFS_BASE_CID = "QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"; // Replace with your IPFS CID after upload
const CREATOR_NAME = "Your Name";
const CREATOR_ADDRESS = "tz1..."; // Your Tezos address

// Vaporwave color palettes (matching p5.js)
const palettes = [
  { name: "Pink/Cyan", colors: ['#FF6EFF', '#00FFFF', '#FF10F0', '#01CDFE', '#B967FF'] },
  { name: "Neon Sunset", colors: ['#FE53BB', '#08F7FE', '#09FBD3', '#F5D300', '#FF006E'] },
  { name: "Electric Dreams", colors: ['#FF71CE', '#01CDFE', '#05FFA1', '#B967FF', '#FFFB96'] },
  { name: "Digital Paradise", colors: ['#FFB3FD', '#2DE2E6', '#F260AA', '#261447', '#FF9CEE'] }
];

// Generate deterministic attributes from token ID
function generateAttributes(tokenId) {
  // Use token ID as seed for deterministic attributes
  const seed = tokenId;
  
  // Palette (now 22 options!)
  const paletteNames = [
    "Classic Vaporwave", "Neon Dreams", "Electric Paradise", "Digital Candy",
    "Psychedelic Neon", "Acid Rainbow", "Cyber Burst", 
    "Dark Psychedelic", "Purple Haze", "Violet Dreams",
    "Sunset Vibes", "Golden Hour",
    "Ocean Deep", "Deep Sea",
    "Fire & Ice", "Volcanic Freeze",
    "Alien World", "Toxic Garden",
    "Purple Haze", "Amethyst Dream",
    "Gold Rush", "Solar Flare"
  ];
  const paletteIndex = seed % paletteNames.length;
  const palette = paletteNames[paletteIndex];
  
  // Background style
  const bgStyles = ["Dark Gradient", "Psychedelic", "Deep Space", "Sunset"];
  const bgStyle = bgStyles[(seed * 2) % bgStyles.length];
  
  // Celestial objects
  const hasSun = (seed * 7) % 10 > 6;
  const hasMoon = (seed * 11) % 10 > 8;
  const hasStars = (seed * 13) % 10 > 4;
  
  // Crystal count (3-15)
  const crystalCount = 3 + (seed * 7) % 13;
  
  // Crystal types
  const crystalTypes = ["Polygon", "Star", "Diamond", "Prism"];
  const dominantCrystalType = crystalTypes[(seed * 3) % crystalTypes.length];
  
  // Mountain layers (2-7)
  const mountainLayers = 2 + (seed * 5) % 6;
  
  // Mountain style
  const mountainStyles = ["Smooth", "Jagged", "Wavy"];
  const dominantMountainStyle = mountainStyles[(seed * 9) % mountainStyles.length];
  
  // Water waves (5-12)
  const waterWaves = 5 + (seed * 11) % 8;
  
  // Water style
  const waterStyle = (seed * 17) % 2 === 0 ? "Smooth" : "Choppy";
  
  // Grid intensity
  const gridStyles = ["Dense", "Normal", "Sparse"];
  const gridStyle = gridStyles[(seed * 19) % gridStyles.length];
  
  // Wireframe crystals
  const wireframeCrystals = (seed * 13) % 100 > 60;
  const crystalStyle = wireframeCrystals ? "Wireframe" : "Solid";
  
  // Glow effects
  const hasGlow = (seed * 23) % 10 > 5;
  
  // Rarity traits
  const hasMaxCrystals = crystalCount >= 13;
  const hasMaxLayers = mountainLayers >= 6;
  const hasAllCelestial = hasSun && hasMoon && hasStars;
  const isWireframeStyle = wireframeCrystals;
  
  return {
    palette,
    bgStyle,
    hasSun,
    hasMoon,
    hasStars,
    crystalCount,
    dominantCrystalType,
    mountainLayers,
    dominantMountainStyle,
    waterWaves,
    waterStyle,
    gridStyle,
    crystalStyle,
    hasGlow,
    hasMaxCrystals,
    hasMaxLayers,
    hasAllCelestial,
    isWireframeStyle
  };
}

// Generate rarity score (optional, for fun)
function calculateRarity(attrs) {
  let score = 0;
  if (attrs.hasMaxCrystals) score += 20;
  if (attrs.hasMaxLayers) score += 15;
  if (attrs.hasAllCelestial) score += 25; // Very rare!
  if (attrs.isWireframeStyle) score += 10;
  if (attrs.crystalCount >= 12) score += 10;
  if (attrs.waterWaves >= 10) score += 5;
  if (attrs.hasGlow) score += 8;
  if (attrs.dominantCrystalType === "Prism") score += 7;
  if (attrs.dominantCrystalType === "Star") score += 5;
  if (attrs.bgStyle === "Psychedelic") score += 5;
  return score;
}

// Generate metadata for a single token
function generateTokenMetadata(tokenId) {
  const attrs = generateAttributes(tokenId);
  const rarity = calculateRarity(attrs);
  
  const metadata = {
    name: `Vaporwave Nature #${tokenId}`,
    description: "A generative artwork featuring crystalline formations, layered mountain ranges, and flowing water rendered in nostalgic vaporwave aesthetics. Each piece is algorithmically unique and generated from blockchain data.",
    artifactUri: `ipfs://${IPFS_BASE_CID}/${tokenId}.png`,
    displayUri: `ipfs://${IPFS_BASE_CID}/${tokenId}.png`,
    thumbnailUri: `ipfs://${IPFS_BASE_CID}/${tokenId}_thumb.png`,
    creators: [CREATOR_NAME],
    date: new Date().toISOString(),
    decimals: 0,
    symbol: "VAPOR",
    isBooleanAmount: true,
    shouldPreferSymbol: false,
    
    // Attributes for filtering/sorting on marketplaces
    attributes: [
      {
        name: "Palette",
        value: attrs.palette
      },
      {
        name: "Background Style",
        value: attrs.bgStyle
      },
      {
        name: "Crystal Count",
        value: attrs.crystalCount.toString()
      },
      {
        name: "Crystal Type",
        value: attrs.dominantCrystalType
      },
      {
        name: "Crystal Style",
        value: attrs.crystalStyle
      },
      {
        name: "Mountain Layers",
        value: attrs.mountainLayers.toString()
      },
      {
        name: "Mountain Style",
        value: attrs.dominantMountainStyle
      },
      {
        name: "Water Waves",
        value: attrs.waterWaves.toString()
      },
      {
        name: "Water Style",
        value: attrs.waterStyle
      },
      {
        name: "Grid Style",
        value: attrs.gridStyle
      },
      {
        name: "Has Sun",
        value: attrs.hasSun ? "Yes" : "No"
      },
      {
        name: "Has Moon",
        value: attrs.hasMoon ? "Yes" : "No"
      },
      {
        name: "Has Stars",
        value: attrs.hasStars ? "Yes" : "No"
      },
      {
        name: "Glow Effect",
        value: attrs.hasGlow ? "Yes" : "No"
      },
      {
        name: "Rarity Score",
        value: rarity.toString()
      }
    ],
    
    // Tags for discoverability
    tags: [
      "generative",
      "vaporwave",
      "crystals",
      "mountains",
      "water",
      "aesthetic",
      "procedural"
    ],
    
    // Formats (required for TZIP-21)
    formats: [
      {
        uri: `ipfs://${IPFS_BASE_CID}/${tokenId}.png`,
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
  
  return metadata;
}

// Main function to generate all metadata files
function generateAllMetadata() {
  const outputDir = path.join(__dirname, 'metadata');
  
  // Create metadata directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  
  console.log(`Generating metadata for ${TOTAL_SUPPLY} tokens...`);
  
  for (let i = 0; i < TOTAL_SUPPLY; i++) {
    const metadata = generateTokenMetadata(i);
    const filename = path.join(outputDir, `${i}.json`);
    
    fs.writeFileSync(filename, JSON.stringify(metadata, null, 2));
    
    if ((i + 1) % 10 === 0) {
      console.log(`Generated ${i + 1}/${TOTAL_SUPPLY} metadata files...`);
    }
  }
  
  console.log(`✓ Successfully generated ${TOTAL_SUPPLY} metadata files in ${outputDir}`);
  console.log(`\nNext steps:`);
  console.log(`1. Generate images for each token (0.png, 1.png, etc.)`);
  console.log(`2. Generate thumbnails (0_thumb.png, 1_thumb.png, etc.)`);
  console.log(`3. Upload all files to IPFS`);
  console.log(`4. Update IPFS_BASE_CID in this script with your CID`);
  console.log(`5. Regenerate metadata with correct IPFS URIs`);
  console.log(`6. Deploy!`);
  
  // Generate stats
  generateStats();
}

// Generate collection statistics
function generateStats() {
  const stats = {
    palettes: {},
    crystalCounts: {},
    crystalTypes: {},
    mountainStyles: {},
    waterStyles: {},
    styles: { Solid: 0, Wireframe: 0 },
    celestialCounts: {
      sun: 0,
      moon: 0,
      stars: 0,
      all: 0
    },
    rarityDistribution: []
  };
  
  for (let i = 0; i < TOTAL_SUPPLY; i++) {
    const attrs = generateAttributes(i);
    const rarity = calculateRarity(attrs);
    
    // Count palettes
    stats.palettes[attrs.palette] = (stats.palettes[attrs.palette] || 0) + 1;
    
    // Count crystal counts
    stats.crystalCounts[attrs.crystalCount] = (stats.crystalCounts[attrs.crystalCount] || 0) + 1;
    
    // Count crystal types
    stats.crystalTypes[attrs.dominantCrystalType] = (stats.crystalTypes[attrs.dominantCrystalType] || 0) + 1;
    
    // Count mountain styles
    stats.mountainStyles[attrs.dominantMountainStyle] = (stats.mountainStyles[attrs.dominantMountainStyle] || 0) + 1;
    
    // Count water styles
    stats.waterStyles[attrs.waterStyle] = (stats.waterStyles[attrs.waterStyle] || 0) + 1;
    
    // Count styles
    stats.styles[attrs.crystalStyle]++;
    
    // Count celestial objects
    if (attrs.hasSun) stats.celestialCounts.sun++;
    if (attrs.hasMoon) stats.celestialCounts.moon++;
    if (attrs.hasStars) stats.celestialCounts.stars++;
    if (attrs.hasAllCelestial) stats.celestialCounts.all++;
    
    // Track rarity
    stats.rarityDistribution.push(rarity);
  }
  
  console.log('\n--- Collection Statistics ---');
  console.log('Palette Distribution:');
  Object.entries(stats.palettes).forEach(([palette, count]) => {
    console.log(`  ${palette}: ${count} (${(count/TOTAL_SUPPLY*100).toFixed(1)}%)`);
  });
  
  console.log('\nCrystal Type Distribution:');
  Object.entries(stats.crystalTypes).forEach(([type, count]) => {
    console.log(`  ${type}: ${count} (${(count/TOTAL_SUPPLY*100).toFixed(1)}%)`);
  });
  
  console.log('\nMountain Style Distribution:');
  Object.entries(stats.mountainStyles).forEach(([style, count]) => {
    console.log(`  ${style}: ${count} (${(count/TOTAL_SUPPLY*100).toFixed(1)}%)`);
  });
  
  console.log('\nWater Style Distribution:');
  Object.entries(stats.waterStyles).forEach(([style, count]) => {
    console.log(`  ${style}: ${count} (${(count/TOTAL_SUPPLY*100).toFixed(1)}%)`);
  });
  
  console.log('\nCrystal Style Distribution:');
  Object.entries(stats.styles).forEach(([style, count]) => {
    console.log(`  ${style}: ${count} (${(count/TOTAL_SUPPLY*100).toFixed(1)}%)`);
  });
  
  console.log('\nCelestial Objects:');
  console.log(`  Has Sun: ${stats.celestialCounts.sun} (${(stats.celestialCounts.sun/TOTAL_SUPPLY*100).toFixed(1)}%)`);
  console.log(`  Has Moon: ${stats.celestialCounts.moon} (${(stats.celestialCounts.moon/TOTAL_SUPPLY*100).toFixed(1)}%)`);
  console.log(`  Has Stars: ${stats.celestialCounts.stars} (${(stats.celestialCounts.stars/TOTAL_SUPPLY*100).toFixed(1)}%)`);
  console.log(`  Has All Three: ${stats.celestialCounts.all} (${(stats.celestialCounts.all/TOTAL_SUPPLY*100).toFixed(1)}%) - ULTRA RARE!`);
  
  console.log('\nRarity Score Distribution:');
  const avgRarity = stats.rarityDistribution.reduce((a, b) => a + b, 0) / TOTAL_SUPPLY;
  const maxRarity = Math.max(...stats.rarityDistribution);
  const minRarity = Math.min(...stats.rarityDistribution);
  console.log(`  Average: ${avgRarity.toFixed(1)}`);
  console.log(`  Range: ${minRarity} - ${maxRarity}`);
  
  const highRarity = stats.rarityDistribution.filter(r => r >= 40).length;
  console.log(`  High Rarity (40+): ${highRarity} (${(highRarity/TOTAL_SUPPLY*100).toFixed(1)}%)`);
  
  const ultraRarity = stats.rarityDistribution.filter(r => r >= 60).length;
  console.log(`  Ultra Rarity (60+): ${ultraRarity} (${(ultraRarity/TOTAL_SUPPLY*100).toFixed(1)}%)`);
}

// Run the generator
if (require.main === module) {
  // Check if configuration is set
  if (IPFS_BASE_CID === "QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX") {
    console.log("⚠️  Warning: Using placeholder IPFS CID");
    console.log("Update IPFS_BASE_CID after uploading images to IPFS\n");
  }
  
  generateAllMetadata();
}

module.exports = { generateTokenMetadata, generateAttributes };
