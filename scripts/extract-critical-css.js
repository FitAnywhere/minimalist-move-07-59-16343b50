
/**
 * This script extracts critical CSS for above-the-fold content
 * To use: node scripts/extract-critical-css.js
 */

const critical = require('critical');
const fs = require('fs');
const path = require('path');

// Config
const BUILD_DIR = path.join(__dirname, '../dist');
const HTML_FILE = path.join(BUILD_DIR, 'index.html');
const CRITICAL_CSS_FILE = path.join(BUILD_DIR, 'critical.css');

async function extractCriticalCSS() {
  console.log('Extracting critical CSS...');
  
  try {
    // Make sure the build directory exists
    if (!fs.existsSync(BUILD_DIR)) {
      console.error('Build directory not found. Run build first.');
      process.exit(1);
    }
    
    // Extract critical CSS
    const { css } = await critical.generate({
      base: BUILD_DIR,
      src: 'index.html',
      width: 1300,
      height: 900,
      target: {
        css: 'critical.css',
        html: 'index-critical.html',
        uncritical: 'non-critical.css',
      },
      inline: false,
      dimensions: [
        {
          width: 375,
          height: 667,
        },
        {
          width: 1024,
          height: 768,
        },
        {
          width: 1440,
          height: 900,
        },
      ],
      penthouse: {
        // Penthouse options for viewport height
        // Limit to 2 viewport heights for truly above-the-fold styles
        forceInclude: [
          '.font-extrabold',
          '.text-xl',
          '.text-3xl',
          '.md\\:text-4xl',
          'h1', 'h2', 'h3',
          '.bg-yellow-400',
          '.bg-yellow',
        ],
        renderWaitTime: 2000,
      },
    });
    
    console.log('Critical CSS extracted successfully!');
    console.log(`File size: ${(css.length / 1024).toFixed(2)}KB`);
    
    // TODO: In production, you would then inline this CSS directly into the HTML
    // and load the non-critical CSS asynchronously
    
  } catch (error) {
    console.error('Error extracting critical CSS:', error);
    process.exit(1);
  }
}

extractCriticalCSS();
