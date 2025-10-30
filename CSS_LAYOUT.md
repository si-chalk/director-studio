# CSS Layout Guide

## Aspect Ratio Layouts

### The Challenge

Creating a container that maintains a specific aspect ratio (e.g., 16:9) while:
1. Growing to fill available space
2. Never overflowing the container
3. Centering within the container
4. Working whether constrained by width OR height

### The Problem with Naive Approaches

#### ❌ Approach 1: Width-First with max-height

```css
.content {
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 100%;
}
```

**Why it fails:**
1. `width: 100%` is resolved first → element becomes full width
2. `aspect-ratio` calculates height from that width
3. If calculated height > container height, `max-height: 100%` clamps it
4. **But width is NOT recalculated** → content is now distorted or has wrong aspect ratio

**Visual Example:**
```
Container: 800px × 400px
Content with width: 100%:
  → Width = 800px
  → Height = 800 / (16/9) = 450px ❌ Exceeds container!
  → max-height clamps to 400px
  → Result: 800px × 400px = 2:1 ratio (wrong!)
```

#### ❌ Approach 2: Both Dimensions Explicit

```css
.content {
  width: 100%;
  height: 100%;
  aspect-ratio: 16 / 9;
}
```

**Why it fails:**
1. Both width AND height are explicit → no flexibility
2. `aspect-ratio` cannot override explicit dimensions
3. Browser forces element to be 100% × 100%
4. Content stretches to fill → aspect ratio violated

#### ❌ Approach 3: Height-First with max-width

```css
.content {
  height: 100%;
  aspect-ratio: 16 / 9;
  max-width: 100%;
}
```

**Same problem as Approach 1**, just inverted:
- Height calculated first
- Width may exceed container
- `max-width` clamps width but doesn't recalculate height

### ✅ The Working Solution

```css
.parent {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px; /* optional spacing */
}

.content {
  aspect-ratio: 16 / 9;
  max-width: 100%;
  max-height: 100%;
  /* NO explicit width or height! */
}
```

**Why this works:**

1. **No Explicit Dimensions on Content**
   - Element's natural size is determined by `aspect-ratio`
   - Browser has freedom to calculate optimal dimensions

2. **Dual Max Constraints**
   - `max-width: 100%` says "don't exceed parent width"
   - `max-height: 100%` says "don't exceed parent height"
   - Browser respects BOTH simultaneously

3. **Browser Calculation**
   ```
   Container: 800px × 400px
   
   If content tries to fill width:
     → Width = 800px
     → Height = 800 / (16/9) = 450px
     → 450px > 400px ❌ Violates max-height
   
   If content tries to fill height:
     → Height = 400px
     → Width = 400 * (16/9) = 711px
     → 711px < 800px ✓ Respects max-width
     → 400px < 400px ✓ Respects max-height
   
   Browser picks: 711px × 400px (correct 16:9)
   ```

4. **Flexbox Centering**
   - Content naturally sized but may not fill container
   - `align-items: center` centers vertically
   - `justify-content: center` centers horizontally
   - Result: Content centered with empty space on sides/top/bottom

### How aspect-ratio Actually Works

The `aspect-ratio` CSS property:

1. **Establishes a preferred ratio** between width and height
2. **Does NOT override explicit dimensions**
   - If `width: 100%` is set, width is 100%
   - Height calculated from width × aspect ratio
   - Any `max-height` only clamps, doesn't recalculate width

3. **Works best with ONE dimension constrained**
   - Set width → height calculated
   - Set height → width calculated
   - Set neither → browser picks based on content/constraints

4. **Respects max/min constraints**
   - When ONLY max constraints are set (no explicit width/height)
   - Browser can calculate optimal size respecting all constraints
   - This is the key to the solution!

### Real-World Application: Video Player

```css
/* StoryboardViewerEmbedded.css */

/* Container fills available viewport space */
.storyboard-viewer-content-embedded {
  flex: 1;
  overflow: hidden;
  padding: 16px;
  display: flex;
  flex-direction: column;
  min-height: 0; /* Important for flex shrinking */
}

/* Video player container grows to fill available space */
.video-player-container {
  width: 100%;
  flex: 1; /* Grows to fill remaining space */
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* White rounded box that centers content */
.video-player {
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

/* 16:9 content that fits perfectly */
.video-player-content {
  aspect-ratio: 16 / 9;
  max-width: 100%;
  max-height: 100%;
  background: linear-gradient(...);
  border-radius: 8px;
}
```

**Result:**
- Viewport height: 900px
- Header: 80px
- Controls: 60px
- Timeline: 220px
- Padding: 32px
- Available for video: ~508px

- Video player fills height (508px)
- Content calculates: 508px × (16/9) = ~903px width
- If container width is 1200px: content is 903px × 508px (centered)
- If container width is 800px: content recalculates to 711px × 400px (centered)

## Flex Layout with min-height: 0

### The Problem

Flexbox children don't shrink below their content size by default:

```css
.parent {
  display: flex;
  flex-direction: column;
  height: 600px;
}

.child {
  flex: 1;
  /* Will NOT shrink below content height! */
}
```

### The Solution

Add `min-height: 0` to flex children that need to shrink:

```css
.parent {
  display: flex;
  flex-direction: column;
  height: 600px;
}

.child {
  flex: 1;
  min-height: 0; /* Allows shrinking below content size */
  overflow: hidden; /* Handle content overflow */
}
```

**Why this matters:**
- Without `min-height: 0`, video player might not shrink
- Content could overflow viewport
- Scrollbars appear in wrong places

## Horizontal Scrolling Containers

### Proper Structure

```css
/* Scrollable parent */
.scroll-container {
  width: 100%;
  overflow-x: auto;
  padding-bottom: 16px; /* Space for scrollbar */
}

/* Content wider than container */
.scroll-content {
  display: flex;
  gap: 4px;
  width: fit-content; /* Allows content to exceed parent */
}

/* Individual items don't shrink */
.scroll-item {
  flex-shrink: 0; /* Prevents squishing */
  width: [calculated]; /* Dynamic or fixed */
}
```

### Scene Labels Alignment

**Challenge:** Scene labels above shots must match shot widths exactly

**Solution:** Calculate scene width = sum of shot widths + gaps

```typescript
// timelineConstants.ts
export const calculateSceneWidth = (shotDurations: number[]): number => {
  const shotWidths = shotDurations.map(calculateShotWidth);
  const totalShotWidth = shotWidths.reduce((sum, w) => sum + w, 0);
  const totalGaps = (shotDurations.length - 1) * SHOT_GAP_PX;
  return totalShotWidth + totalGaps;
};
```

```tsx
// TimelineView.tsx
<div style={{ width: `${calculateSceneWidth(shotDurations)}px` }}>
  Scene Label
</div>
```

**Key insight:** Must include gaps in calculation, not just shot widths!

## Popover Positioning with Portals

### Challenge

Flyout menus need to:
1. Render outside parent DOM (avoid overflow: hidden)
2. Position relative to trigger button
3. Stay within viewport bounds

### Solution: React Portal + Dynamic Positioning

```tsx
const [flyoutPosition, setFlyoutPosition] = useState({ top: 0, left: 0 });
const buttonRef = useRef<HTMLButtonElement>(null);

useEffect(() => {
  if (isOpen && buttonRef.current) {
    const rect = buttonRef.current.getBoundingClientRect();
    const flyoutWidth = 300;
    
    // Position right of button
    let left = rect.right + 8;
    let top = rect.top;
    
    // Keep within viewport
    if (left + flyoutWidth > window.innerWidth) {
      left = rect.left - flyoutWidth - 8; // Position left instead
    }
    
    setFlyoutPosition({ top, left });
  }
}, [isOpen]);

// Render outside parent DOM
return createPortal(
  <div style={{ position: 'fixed', top, left }}>
    Flyout Content
  </div>,
  document.body
);
```

## Performance Considerations

### What We DON'T Need

1. **Virtual Scrolling**
   - Typical storyboards: 20-100 shots
   - Modern browsers handle this easily
   - Virtual scrolling adds complexity

2. **React.memo**
   - Shot cards are simple components
   - Re-render cost is minimal
   - Premature optimization

3. **CSS-in-JS**
   - Plain CSS is fast
   - No runtime style generation
   - Better caching

### What We DO Need

1. **Centralized Constants**
   - Avoid magic numbers
   - Single source of truth
   - Easy to update

2. **Proper Flex Layout**
   - Let browser do the work
   - Native performance
   - Works across devices

3. **Smart Scrolling**
   - Only scroll where needed
   - Custom scrollbar styling
   - Smooth scrolling

---

**Last Updated**: October 29, 2025



