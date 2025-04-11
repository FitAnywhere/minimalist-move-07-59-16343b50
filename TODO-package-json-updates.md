
# Package.json Updates

The following updates should be made to package.json:

1. Add the following dev dependencies:
   - critical: "^5.1.1"
   - cssnano: "^6.0.3"
   - purgecss: "^5.0.0"

2. Update build scripts to include optimization:
   ```json
   "scripts": {
     "build": "vite build && npm run optimize",
     "optimize": "node scripts/extract-critical-css.js"
   }
   ```

Since we can't directly modify package.json, please run:

```bash
npm install --save-dev critical cssnano purgecss
```

And update your scripts manually.
