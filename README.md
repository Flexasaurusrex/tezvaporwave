# Vaporwave Nature - Tezos NFT Collection

A generative art NFT collection featuring crystalline formations, layered mountains, and flowing water rendered in nostalgic vaporwave aesthetics. Built on Tezos blockchain with p5.js generative engine.

![Vaporwave Nature Preview](preview.png)

## ✨ Features

- 🎨 **Fully Generative**: Each piece is algorithmically unique
- 💎 **Crystals**: Geometric formations with vaporwave gradients
- ⛰️ **Mountains**: Layered ranges with procedural peaks
- 🌊 **Water**: Flowing waves with shimmer effects
- 🌈 **4 Color Palettes**: Pink/Cyan, Neon Sunset, Electric Dreams, Digital Paradise
- ⚡ **Retro Effects**: Grid overlays, scanlines, and vignettes
- 🔗 **Tezos Blockchain**: FA2 standard, 5 tz fixed price
- 🎯 **100 Total Supply**: Limited edition collection

## 📁 Project Structure

```
vaporwave-nature/
├── vaporwave_nature.js      # p5.js generative art engine
├── vaporwave_contract.py    # SmartPy FA2 minting contract
├── index.html               # Vaporwave-styled minting interface
├── generate_metadata.js     # Metadata generator for IPFS
├── DEPLOYMENT.md            # Full deployment guide
└── README.md               # This file
```

## 🚀 Quick Start

### 1. Test the Art Locally

Open `index.html` in a browser to see the generative art in action. Click the canvas or press the "Generate New Preview" button to see different variations.

### 2. Test the Contract

1. Go to [SmartPy IDE](https://smartpy.io/ide)
2. Copy contents of `vaporwave_contract.py`
3. Click "Run" to execute tests
4. Review test scenarios

### 3. Generate Metadata

```bash
# Install Node.js first, then:
node generate_metadata.js
```

This creates JSON files in `metadata/` folder following TZIP-21 standard.

### 4. Generate Images

You'll need to generate 100 PNG images (800x800px):

**Option A**: Manual generation
- Open `index.html`
- Generate each variation
- Right-click and save each image as `0.png`, `1.png`, etc.

**Option B**: Automated (requires setup)
- Use p5.js in Node.js with node-canvas
- See `DEPLOYMENT.md` for details

### 5. Upload to IPFS

1. Sign up for [Pinata](https://pinata.cloud) or [NFT.storage](https://nft.storage)
2. Upload all images and metadata files
3. Note your IPFS CID (Content Identifier)
4. Update `generate_metadata.js` with your CID and regenerate

### 6. Deploy Contract

1. Open [SmartPy IDE](https://smartpy.io/ide)
2. Deploy to Ghostnet (testnet) first
3. Parameters:
   - `admin`: Your Tezos address
   - `metadata_base_uri`: Your IPFS base URI
4. Test minting on testnet
5. Deploy to mainnet when ready

### 7. Deploy Frontend

1. Update `CONTRACT_ADDRESS` in `index.html`
2. Upload to [Netlify](https://netlify.com), [Vercel](https://vercel.com), or any web host
3. Share your minting site!

## 🎨 Generative Features

Each NFT is generated with deterministic randomness based on blockchain data:

- **Palettes**: 4 different vaporwave color schemes
- **Crystals**: 5-12 geometric crystals per piece
  - Variable sizes, rotations, and positions
  - Solid or wireframe styles
  - Glow effects
- **Mountains**: 3-5 layers of procedural peaks
  - Different heights and roughness
  - Layered depth effect
- **Water**: 6-10 flowing wave layers
  - Shimmer reflections
  - Parallax movement
- **Effects**: Grid overlay, scanlines, vignette

### Rarity Traits

- **Crystal Count**: Higher counts are rarer
- **Wireframe Style**: ~40% of collection
- **Max Mountain Layers**: ~33% have 5 layers
- **Palette Distribution**: Evenly distributed
- **Rarity Score**: Calculated based on trait combinations

## 💰 Economics

- **Mint Price**: 5 ꜩ (tez)
- **Total Supply**: 100 tokens
- **Royalties**: 10% on secondary sales (configurable)
- **Standard**: FA2 (automatically indexed on OBJKT, Teia, etc.)

## 🛠️ Technical Stack

- **Art Engine**: p5.js (JavaScript)
- **Smart Contract**: SmartPy (Python-based)
- **Blockchain**: Tezos (FA2 standard)
- **Frontend**: HTML/CSS/JS with Taquito + Beacon SDK
- **Storage**: IPFS for metadata and images
- **Wallets**: Temple, Kukai, Umami (via Beacon)

## 📝 Smart Contract Features

- ✅ FA2 standard compliant
- ✅ Fixed price minting (5 tz)
- ✅ Pausable (admin control)
- ✅ Adjustable max supply
- ✅ Withdrawable funds
- ✅ Transfer and operator management
- ✅ Balance queries
- ✅ TZIP-016 metadata

## 🎯 Marketplace Integration

Your NFTs will automatically appear on:

- **[OBJKT.com](https://objkt.com)** - Largest Tezos NFT marketplace
- **[Teia.art](https://teia.art)** - Community-run marketplace
- **[fxhash.xyz](https://fxhash.xyz)** - Generative art platform

No additional listing needed - FA2 tokens are automatically indexed!

## 🧪 Testing Checklist

- [ ] Test p5.js generation (multiple variations)
- [ ] Compile SmartPy contract (no errors)
- [ ] Run SmartPy test scenarios
- [ ] Generate metadata files
- [ ] Generate sample images
- [ ] Upload test data to IPFS
- [ ] Deploy to Ghostnet
- [ ] Test minting on testnet
- [ ] Test transfers
- [ ] Test wallet connection
- [ ] Deploy frontend
- [ ] End-to-end test
- [ ] Deploy to mainnet

## 📚 Documentation

- [Full Deployment Guide](DEPLOYMENT.md) - Complete step-by-step instructions
- [SmartPy Docs](https://smartpy.io/docs) - Smart contract development
- [Tezos Docs](https://tezos.com/developers) - Blockchain documentation
- [TZIP Standards](https://gitlab.com/tezos/tzip) - Token standards
- [Taquito Docs](https://tezostaquito.io) - JavaScript SDK

## 🤝 Support

- **Tezos Discord**: [Join here](https://discord.gg/tezos)
- **Reddit**: r/tezos
- **Twitter**: #Tezos #TezosNFT

## 📄 License

MIT License - Feel free to use and modify for your own projects!

## 🎉 Credits

- **Art Engine**: p5.js
- **Blockchain**: Tezos
- **Design Inspiration**: Vaporwave aesthetic, 80s/90s digital art
- **Community**: Tezos NFT creators and collectors

---

## 🚨 Important Notes

1. **Test on Ghostnet first** - Always test on testnet before mainnet
2. **Pin IPFS files** - Ensure your IPFS files are permanently pinned
3. **Backup everything** - Save your contract address, admin keys, etc.
4. **Gas fees** - Account for Tezos transaction fees (~0.5-1 tz for deployment)
5. **Metadata standard** - Follow TZIP-21 for proper marketplace display

## 🎨 Customization Ideas

Want to modify this project? Here are some ideas:

- Add more natural elements (clouds, stars, plants)
- Implement different pricing tiers
- Add whitelist/allowlist for early access
- Create reveal mechanism (hide art until sellout)
- Add animation to the generative art
- Implement Dutch auction pricing
- Add staking or utility features
- Create companion collection

## 📊 Collection Statistics

The metadata generator provides automatic stats:
- Palette distribution
- Style distribution (Solid vs Wireframe)
- Rarity score distribution
- Trait combinations

Run `node generate_metadata.js` to see full stats.

---

**Ready to launch?** Follow the Quick Start guide above or see [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

**Questions?** Check the Tezos developer Discord or open an issue!

Good luck with your drop! 🌊💎⛰️✨
