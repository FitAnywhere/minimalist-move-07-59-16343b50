
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './index.html',
  ],
  css: ['./dist/assets/*.css'],
  output: './dist/assets/purged/',
  safelist: [
    // Classes that might be added dynamically
    /^bg-/,
    /^text-/,
    /^hover:/,
    /^animate-/,
    // Shadcn UI classes
    /^radix-/,
    // State-based classes that might be missed in static analysis
    'opacity-0',
    'opacity-100',
    'translate-y-0',
    'translate-y-8',
    'scale-x-0',
    'scale-x-100',
    'hidden',
    'block',
    'visible',
    'invisible',
  ],
  // Maintain CSS variables and their usage
  variables: true,
  rejected: true,
  // Maintain important Tailwind configurations
  fontFace: true,
  keyframes: true,
  // Log detailed information
  info: true,
};
