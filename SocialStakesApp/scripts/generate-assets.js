const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function generateAssets() {
    const assetsDir = path.join(__dirname, '..', 'assets');
    
    // Ensure assets directory exists
    await fs.mkdir(assetsDir, { recursive: true });
    
    // Create a basic white square with text
    const size = 1024;
    const buffer = await sharp({
        create: {
            width: size,
            height: size,
            channels: 4,
            background: { r: 255, g: 255, b: 255, alpha: 1 }
        }
    })
    .png()
    .toBuffer();
    
    // Generate different sizes
    const assets = {
        'icon.png': { width: 1024, height: 1024 },
        'splash.png': { width: 2048, height: 2048 },
        'adaptive-icon.png': { width: 1024, height: 1024 },
        'favicon.png': { width: 196, height: 196 }
    };
    
    for (const [filename, dimensions] of Object.entries(assets)) {
        await sharp(buffer)
            .resize(dimensions.width, dimensions.height)
            .png()
            .toFile(path.join(assetsDir, filename));
    }
}

generateAssets().catch(console.error); 