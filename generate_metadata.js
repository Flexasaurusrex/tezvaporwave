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
  
  // Palette
  const paletteIndex = seed % palettes.length;
  const palette = palettes[paletteIndex];
  
  // Crystal count (5-12)
  const crystalCount = 5 + (seed * 7) % 8;
  
  // Mountain layers (3-5)
  const mountainLayers = 3 + (seed * 3) % 3;
  
  // Water waves (6-10)
  const waterWaves = 6 + (seed * 5) % 5;
  
  // Grid intensity
  const gridIntensity = ["Low", "Medium", "High"][(seed * 2) % 3];
  
  // Wireframe crystals
  const wireframeCrystals = (seed * 13) % 100 > 60;
  
  // Crystal style
  const crystalStyle = wireframeCrystals ? "Wireframe" : "Solid";
  
  // Time of day (based on background gradient)
  const timeOfDay = ["Dusk", "Night", "Dawn"][(seed * 11) % 3];
  
  // Rarity traits
  const hasSuperCrystals = crystalCount >= 11; // Rare
  const hasMaxLayers = mountainLayers === 5; // Uncommon
  const isWireframeStyle = wireframeCrystals; // Special
  
  return {
    palette: palette.name,
    crystalCount,
    mountainLayers,
    waterWaves,
    gridIntensity,
    crystalStyle,
    timeOfDay,
    hasSuperCrystals,
    hasMaxLayers,
    isWireframeStyle
  };
}

// Generate rarity score (optional, for fun)
function calculateRarity(attrs) {
  let score = 0;
  if (attrs.hasSuperCrystals) score += 20;
  if (attrs.hasMaxLayers) score += 15;
  if (attrs.isWireframeStyle) score += 10;
  if (attrs.crystalCount >= 10) score += 10;
  if (attrs.waterWaves >= 9) score += 5;
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
        name: "Crystal Count",
        value: attrs.crystalCount.toString()
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
        name: "Water Waves",
        value: attrs.waterWaves.toString()
      },
      {
        name: "Grid Intensity",
        value: attrs.gridIntensity
      },
      {
        name: "Time of Day",
        value: attrs.timeOfDay
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
    styles: { Solid: 0, Wireframe: 0 },
    rarityDistribution: []
  };
  
  for (let i = 0; i < TOTAL_SUPPLY; i++) {
    const attrs = generateAttributes(i);
    const rarity = calculateRarity(attrs);
    
    // Count palettes
    stats.palettes[attrs.palette] = (stats.palettes[attrs.palette] || 0) + 1;
    
    // Count crystal counts
    stats.crystalCounts[attrs.crystalCount] = (stats.crystalCounts[attrs.crystalCount] || 0) + 1;
    
    // Count styles
    stats.styles[attrs.crystalStyle]++;
    
    // Track rarity
    stats.rarityDistribution.push(rarity);
  }
  
  console.log('\n--- Collection Statistics ---');
  console.log('Palette Distribution:');
  Object.entries(stats.palettes).forEach(([palette, count]) => {
    console.log(`  ${palette}: ${count} (${(count/TOTAL_SUPPLY*100).toFixed(1)}%)`);
  });
  
  console.log('\nCrystal Style Distribution:');
  Object.entries(stats.styles).forEach(([style, count]) => {
    console.log(`  ${style}: ${count} (${(count/TOTAL_SUPPLY*100).toFixed(1)}%)`);
  });
  
  console.log('\nRarity Score Distribution:');
  const avgRarity = stats.rarityDistribution.reduce((a, b) => a + b, 0) / TOTAL_SUPPLY;
  const maxRarity = Math.max(...stats.rarityDistribution);
  const minRarity = Math.min(...stats.rarityDistribution);
  console.log(`  Average: ${avgRarity.toFixed(1)}`);
  console.log(`  Range: ${minRarity} - ${maxRarity}`);
  
  const highRarity = stats.rarityDistribution.filter(r => r >= 30).length;
  console.log(`  High Rarity (30+): ${highRarity} (${(highRarity/TOTAL_SUPPLY*100).toFixed(1)}%)`);
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
