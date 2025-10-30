# Architecture Overview

## System Components

### 1. Storyboard Generator (`index.tsx`)

**Responsibilities:**
- User input form (prompt, styles, duration)
- LLM integration (streaming JSON)
- JSON parsing and validation
- State management for generation

**Key Features:**
- Streaming JSON display during generation
- Multiple JSON extraction strategies (handles markdown, extra text)
- Collapsible final JSON viewer with copy button
- Error handling with raw response viewer

**LLM Prompt Strategy:**
- System prompt: Strict JSON-only rules
- User prompt: Schema + inputs + example JSON
- Temperature: 0.3 (for consistency)
- Max tokens: 16000 (for long videos)

### 2. Storyboard Viewer (`StoryboardViewer.tsx`)

**Responsibilities:**
- Orchestrate dual-view system
- Manage thumbnail generation (via `useThumbnailGeneration` hook)
- Switch between Timeline and Storyboard views
- Pass data to appropriate view component

**View State:**
```typescript
viewMode: 'timeline' | 'storyboard'
```

**Data Flow:**
```
StoryboardData (JSON)
  ↓
StoryboardViewer (manages state, thumbnails)
  ↓
  ├─→ TimelineView (if viewMode === 'timeline')
  │     └─→ TimelineShot components
  └─→ StoryboardView (if viewMode === 'storyboard')
        └─→ StoryboardCard components
  ↓
ViewFooter (toggle button)
```

### 2a. Timeline View (`TimelineView.tsx`)

**Responsibilities:**
- Render video player preview (16:9 aspect ratio)
- Display video controls (play button, timeline)
- Render scene labels with calculated widths
- Display shots as TimelineShot components

**Scene Width Calculation:**
```typescript
import { calculateSceneWidth } from './timelineConstants';

const shotDurations = scene.shots.map(shot => shot.duration_ms || 3000);
const sceneWidth = calculateSceneWidth(shotDurations);
// Returns: sum of shot widths + gaps (4px between each shot)
```

**Layout Structure:**
```
video-player-container (flex: 1, fills available height)
  └─ video-player (centers content, 16px padding)
      └─ video-player-content (16:9 aspect ratio, max 100% width/height)
video-controls-container
shots-timeline-container (horizontal scroll)
  ├─ timeline-scene-indicators (width-matched labels)
  └─ shots-grid (horizontal flexbox, 4px gap)
```

### 2b. Storyboard View (`StoryboardView.tsx`)

**Responsibilities:**
- Group shots by scenes
- Render as grid layout
- Display full shot metadata
- Use StoryboardCard components

**Layout Structure:**
```
scenes (grid, gap: 32px)
  └─ scene-section
      ├─ scene-header (title, shot count)
      └─ scene-shots (grid, 3 columns, gap: 16px)
          └─ StoryboardCard (fixed width)

### 3a. Timeline Shot (`TimelineShot.tsx`)

**Responsibilities:**
- Display shot thumbnail in timeline view
- Show shot number badge overlay
- Minimal UI (thumbnail-focused)
- Click to show details (console.log for now)

**Width Calculation:**
```typescript
import { calculateShotWidth } from './timelineConstants';
const cardWidth = calculateShotWidth(durationMs);
// Uses centralized constants
```

**Visual Design:**
- Height: 180px (no aspect ratio constraint)
- Shot number badge: absolute positioned overlay
- Generate button: visible on hover
- Minimal border, subtle shadow

### 3b. Storyboard Card (`StoryboardCard.tsx`)

**Responsibilities:**
- Display full shot metadata in storyboard view
- Show thumbnail, shot number, description
- Fixed width (no duration scaling)
- No edit button (inline editing instead)

**Visual Design:**
- Width: 300px (fixed)
- Thumbnail: 16:9 aspect ratio
- Description: visible below thumbnail
- Shot type and duration: footer section

### 3c. Shot Card - Legacy (`ShotCard.tsx`)

**Note**: This component is being phased out in favor of TimelineShot/StoryboardCard

**Responsibilities:**
- Display shot thumbnail + metadata
- Popover flyout (using React Portal)
- Calculate card width from duration

**Width Calculation:**
```typescript
import { calculateShotWidth } from './timelineConstants';
const cardWidth = calculateShotWidth(durationMs);
```

**Flyout Behavior:**
- Opens on edit button click (portal rendering)
- Positioned dynamically relative to button
- Viewport-aware (adjusts position to stay visible)
- Contains: shot type dropdown, description textarea
- Not persisted (UI state only)

### 4. Timeline Constants (`timelineConstants.ts`)

**Purpose:**
Centralized layout calculations to ensure consistency between CSS and TypeScript.

**Constants:**
```typescript
SHOT_GAP_PX = 4           // Gap between shots (must match CSS)
PIXELS_PER_SECOND = 40     // Duration to width conversion
MIN_SHOT_WIDTH_PX = 40     // Minimum shot width
```

**Functions:**
```typescript
calculateShotWidth(durationMs: number): number
  // Returns: max(durationSeconds * 40, 40)
  // Used by: TimelineShot, ShotCard

calculateSceneWidth(shotDurations: number[]): number
  // 1. Calculate each shot width
  // 2. Sum all widths
  // 3. Add gaps: (numShots - 1) * SHOT_GAP_PX
  // Used by: TimelineView for scene label widths
```

**CSS Synchronization:**
```css
/* StoryboardViewerEmbedded.css */
/* IMPORTANT: Gap value must match SHOT_GAP_PX in timelineConstants.ts */
.shots-grid {
  gap: 4px; /* = SHOT_GAP_PX */
}
```

**Future-Proofing:**
When implementing shot duration editing:
- Scene widths auto-recalculate on re-render
- No manual width updates needed
- React inline styles use `calculateSceneWidth()` dynamically

### 5. Thumbnail Generator Service (`thumbnailGenerator.ts`)

**Responsibilities:**
- Build hierarchical context prompts
- Call Google Gemini image generation API
- Manage batch generation with rate limiting
- Extract image URLs from responses

**Hierarchical Context Structure:**
```
1. Video Context (overall prompt)
2. Environment (if applicable)
3. Characters (if in shot)
4. Objects (if in shot)
5. Previous Shots (last 3 with context)
6. Style Settings (global)
7. Shot-specific prompt
```

**Prompt Example:**
```
Video Context: Kickstarter campaign for a watch brand called 'Saros'
Environment: workshop - Small artisan workspace with natural lighting. Wood desk, metal tools, warm atmosphere
Characters: Alex: Founder and watchmaker (early 30s, focused expression, casual work attire)
Objects: saros_watch: Precision timepiece with visible mechanical movement (brushed steel case, cream dial)
Recent shots: Shot 2: Close-up of gears turning. Shot 3: Hands adjusting mechanism
[Style: Cinematic, Storyboard sketch | Lighting: Soft dawn | Camera: 35mm]
Shot Type: Medium Shot
Macro sketch of metallic gears under warm light, shallow depth, analog texture
Single frame, cinematic still, high quality, detailed
```

**Rate Limiting:**
- 3 concurrent generations max
- 1 second delay between batches
- Prevents API 429 errors

### 6. Thumbnail Generation Hook (`useThumbnailGeneration.ts`)

**State Management:**
```typescript
{
  thumbnails: Map<shotId, imageUrl>,
  generating: Set<shotId>,
  progress: { completed, total },
  errors: Map<shotId, errorMessage>
}
```

**Methods:**
- `generateSingle(request, styleContext, storyboardData)`
- `generateAll(requests, styleContext, storyboardData, concurrency)`
- `clearThumbnail(shotId)`
- `clearAll()`

## Data Flow

### Generation Flow
```
User Input
  ↓
LLM Streaming Service
  ↓
JSON Parser (multiple strategies)
  ↓
Validation (check required fields)
  ↓
StoryboardViewer (flatten & render)
  ↓
ShotCards (dynamic width)
```

### Thumbnail Flow
```
Click "Generate All Thumbnails"
  ↓
Build requests for all shots
  ↓
For each shot:
  → Get environment from registry
  → Get characters/objects from registry
  → Get previous shots context
  → Build hierarchical prompt
  ↓
Batch generation (3 at a time)
  ↓
Extract image URL from response
  ↓
Update thumbnail map
  ↓
ShotCard displays image
```

## Schema Design Decisions

### Why Registries?

**Problem**: "Chef puts dish in oven" generates different dish each time
**Solution**: Object registry defines the dish once, referenced in all shots

**Implementation**:
```json
{
  "objectRegistry": [{
    "id": "creme_brulee",
    "name": "Crème Brûlée Dish",
    "description": "Six white porcelain ramekins",
    "visual_traits": "Classic French ceramic, caramelized sugar top"
  }],
  "shots": [{
    "objects": ["creme_brulee"],  // Reference, not redescribe
    ...
  }]
}
```

### Why Optional Environments?

Not all videos need location tracking:
- ✅ Cooking video: Kitchen environment crucial
- ✅ Product demo: Studio environment matters
- ❌ Abstract animation: No location
- ❌ Surreal dream: Constantly changing

### Why duration_ms (not duration_s)?

1. **Precision**: Video editing uses milliseconds
2. **No Decimals**: Integer math is cleaner
3. **Standard**: FFmpeg, video codecs use ms
4. **UI Calculation**: `durationMs / 1000 * 40` for width

## UI Architecture

### Layout Structure
```
StoryboardGenerator (main screen)
├── Floating Input Panel (left, collapsible)
│   ├── Concept textarea
│   ├── Style chips
│   ├── Duration slider
│   ├── Generate button
│   ├── Streaming JSON (during generation)
│   └── Final JSON viewer (after generation)
└── Storyboard Canvas (right, fills viewport)
    └── StoryboardViewer
        ├── Header (title, meta, Generate All button)
        ├── [Timeline View] OR [Storyboard View]
        └── Footer (view toggle button)

Timeline View:
└── storyboard-viewer-content-embedded (flex column, fills height)
    ├── video-player-container (flex: 1, grows to fill)
    │   └── video-player (centers content)
    │       └── video-player-content (16:9, max 100% w/h)
    ├── video-controls-container (hugs content height)
    │   └── play button + timeline
    └── shots-timeline-container (horizontal scroll)
        ├── timeline-scene-indicators (width-matched labels)
        └── shots-grid (4px gap)
            └── TimelineShot (many)

Storyboard View:
└── scenes (grid layout)
    └── scene-section (per scene)
        ├── scene-header
        └── scene-shots (3-column grid)
            └── StoryboardCard (many)
```

### CSS Architecture

**Colors** (simple-mode):
- Background: `#F0F1F5` (light gray)
- Cards: `#FFFFFF` (white)
- Text: `rgba(13, 18, 22, 0.86)` (dark gray)
- Header: `#FFFFFF` with `#e5e7eb` border

**Scrollbar** (horizontal):
- Track: `#f3f4f6`
- Thumb: `#d1d5db`
- Hover: `#9ca3af`

**Animations**:
- Flyout slide: `translateX(100%)` → `translateX(0)` (0.3s)
- Overlay fade: `opacity: 0` → `opacity: 1` (0.2s)
- Card hover: `translateY(0)` → `translateY(-2px)` (0.2s)

### Aspect Ratio Layout (Critical Learning)

**Problem**: Video player needs to maintain 16:9 aspect ratio while fitting container

**Failed Approaches:**
1. ❌ `width: 100%; aspect-ratio: 16/9; max-height: 100%`
   - Width determined first, height calculated
   - `max-height` clamps height but doesn't recalculate width
   - Result: Overflow or distortion

2. ❌ `width: 100%; height: 100%; aspect-ratio: 16/9`
   - Both dimensions forced, aspect ratio violated
   - Result: Stretched content

**Working Solution:**
```css
.video-player {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.video-player-content {
  aspect-ratio: 16 / 9;
  max-width: 100%;
  max-height: 100%;
  /* NO explicit width or height */
}
```

**Why This Works:**
- Parent fills container (100% width/height)
- Child has aspect-ratio but NO explicit dimensions
- `max-width` and `max-height` create two-way constraints
- Browser calculates size to fit within both constraints
- Flexbox centering keeps content centered
- Result: Largest possible 16:9 box within container

**Key Insight:**
The `aspect-ratio` property works best when the element has NO explicit width/height, only max constraints. Let the browser calculate the optimal size to satisfy both the aspect ratio and the max constraints.

## Error Handling

### JSON Parsing Errors
1. Try markdown code block extraction
2. Try first `{` to last `}`
3. Try remove common prefixes
4. Try remove trailing commas
5. Fail → Show raw response with debug panel

### Thumbnail Generation Errors
- Stored per shot in errors Map
- Display in shot card (red X icon)
- Retry individual shot by clicking
- Don't block other shots

### API Errors
- HTTP 400: Invalid prompt → Check model capabilities
- HTTP 429: Rate limit → Batch delay insufficient
- HTTP 500: Server error → Retry with exponential backoff

## Performance Considerations

### Rendering
- React.memo NOT used (small shot counts)
- Virtual scrolling NOT needed (<100 shots typical)
- Thumbnails as base64 data URLs (no external fetching)

### Memory
- Thumbnails stored in component state (not global)
- Cleared on storyboard reset
- No memory leaks (proper cleanup)

### API Costs
- Storyboard generation: ~$0.05-0.20 per generation
- Thumbnail generation: ~$0.01-0.05 per shot
- 30-shot storyboard: ~$0.35-1.70 total

## Testing Strategy (Not Implemented)

Future testing would cover:
1. JSON parsing edge cases
2. Thumbnail URL extraction
3. Width calculation accuracy
4. Context building logic
5. Registry reference resolution

---

**Last Updated**: October 29, 2025
**Major Updates**: 
- Dual-view system (Timeline + Storyboard)
- Centralized layout constants (timelineConstants.ts)
- Aspect-ratio layout solution for video player
- Scene label width synchronization

