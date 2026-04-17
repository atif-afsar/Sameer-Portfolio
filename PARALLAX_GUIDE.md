# Parallax Scrolling Layout Guide

## Overview

This implementation provides a premium parallax scrolling experience where only the first three sections have layered parallax effects, while all subsequent sections scroll normally.

## Components

### 1. ParallaxSection.jsx
The core component that handles individual parallax sections with three layers:
- **Background Layer**: Slowest movement (0 → 50px) with scale (1 → 1.05) and blur effects
- **Midground Layer**: Medium movement (0 → 100px)
- **Foreground Layer**: Fastest movement (0 → 150px) - contains main content

### 2. ParallaxLayout.jsx
The layout wrapper that:
- Renders the first 3 sections with parallax effects
- Renders remaining sections with normal scroll behavior
- Ensures smooth transitions between parallax and normal sections

## Usage

### Basic Implementation

```jsx
import ParallaxLayout from './components/ParallaxLayout';

const MyPage = () => {
  const parallaxSections = [
    {
      className: 'bg-gradient-to-br from-slate-900 to-purple-900',
      background: <div>Background content (slowest)</div>,
      midground: <div>Midground content (medium)</div>,
      foreground: <div>Main content (fastest)</div>
    },
    // ... 2 more sections
  ];

  const normalSections = [
    <section>Normal scroll section 1</section>,
    <section>Normal scroll section 2</section>,
    // ... more sections
  ];

  return <ParallaxLayout sections={parallaxSections} normalSections={normalSections} />;
};
```

### Section Structure

Each parallax section should have:

```jsx
{
  className: 'bg-color-here', // Background color/gradient
  background: (
    // Decorative elements, large text, gradients
    // Moves slowest, gets slight blur and scale
  ),
  midground: (
    // Secondary elements, patterns, shapes
    // Moves at medium speed
  ),
  foreground: (
    // Main content, headings, text
    // Moves fastest, most prominent
  )
}
```

## Key Features

### Parallax Behavior
- Uses Framer Motion's `useScroll` and `useTransform`
- Tracks scroll progress per section (not globally)
- GPU-accelerated transforms for smooth performance
- Automatic blur and scale on background layers for depth

### Performance Optimizations
- Uses `transform` (translateY) instead of `top` or `margin`
- Minimal re-renders with proper ref usage
- No heavy calculations in scroll handlers
- Overflow hidden to prevent visual glitches

### Smooth Transitions
- No layout shifts between parallax and normal sections
- Proper z-index stacking (background: 0, midground: 10, foreground: 20, normal: 30)
- Seamless scroll experience throughout

## Example: Converting Existing Sections

### Before (Normal Section)
```jsx
<section className="min-h-screen bg-blue-500">
  <h1>My Content</h1>
  <p>Some text</p>
</section>
```

### After (Parallax Section)
```jsx
{
  className: 'bg-blue-500',
  background: (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-[20vw] font-bold text-white/10">BG</div>
    </div>
  ),
  midground: (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-8xl font-bold text-white/20">MID</div>
    </div>
  ),
  foreground: (
    <div className="w-full h-full flex items-center justify-center px-6">
      <div className="max-w-4xl text-center">
        <h1 className="text-7xl font-bold text-white">My Content</h1>
        <p className="text-2xl text-white/80">Some text</p>
      </div>
    </div>
  )
}
```

## Best Practices

1. **Layer Content Appropriately**
   - Background: Large decorative elements, gradients, patterns
   - Midground: Secondary visual elements
   - Foreground: Main content that users need to read

2. **Keep It Subtle**
   - Parallax is most effective when it's noticeable but not distracting
   - The default transform values (50px, 100px, 150px) work well for most cases

3. **Performance**
   - Avoid heavy images in background layers
   - Use CSS gradients and simple shapes when possible
   - Test on lower-end devices

4. **Accessibility**
   - Ensure text remains readable during scroll
   - Maintain sufficient contrast ratios
   - Consider users with motion sensitivity (add prefers-reduced-motion support if needed)

## Customization

### Adjust Parallax Speed

In `ParallaxSection.jsx`, modify the transform values:

```jsx
// Slower parallax
const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 30]);
const midgroundY = useTransform(scrollYProgress, [0, 1], [0, 60]);
const foregroundY = useTransform(scrollYProgress, [0, 1], [0, 100]);

// Faster parallax
const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 80]);
const midgroundY = useTransform(scrollYProgress, [0, 1], [0, 150]);
const foregroundY = useTransform(scrollYProgress, [0, 1], [0, 250]);
```

### Change Number of Parallax Sections

In `ParallaxLayout.jsx`, modify the slice:

```jsx
// For 5 parallax sections instead of 3
{sections.slice(0, 5).map((section, index) => (
  // ...
))}
```

## Demo

See `src/pages/ParallaxDemo.jsx` for a complete working example with three parallax sections and three normal scroll sections.

## Testing

To test the parallax effect:
1. Import and use `ParallaxDemo` component
2. Scroll slowly to see the layered depth effect
3. Notice how sections 4+ scroll normally
4. Check for smooth transitions and no layout shifts

## Troubleshooting

**Issue**: Parallax feels too fast/slow
- Adjust the transform values in `ParallaxSection.jsx`

**Issue**: Layout shifts when transitioning to normal sections
- Ensure normal sections have proper z-index (z-30)
- Check that parallax sections are exactly 100vh

**Issue**: Performance issues
- Reduce blur effects
- Simplify background layer content
- Check for unnecessary re-renders

**Issue**: Content not visible
- Verify z-index stacking order
- Check that layers have proper positioning (absolute)
- Ensure overflow-hidden is applied to section container
