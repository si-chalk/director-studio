# Director Studio - AI Storyboard Generator

## What Is This?

Director Studio is an AI-powered storyboard generator for video concepts. It generates structured, shot-by-shot breakdowns of video ideas with visual thumbnails, designed for integration within Canva's editor interface.

## What It DOES ✅

### Core Functionality

1. **Structured Storyboard Generation**
   - Takes a text prompt (e.g., "Kickstarter campaign for a watch brand")
   - Generates complete shot-by-shot breakdown
   - Returns structured JSON with scenes, shots, and metadata
   - LLM-powered (GPT-4o) with strict JSON validation

2. **Shot-Level Details**
   - Shot type (Close Up, Wide Shot, etc.)
   - Description of what happens in the shot
   - Recommended duration in milliseconds
   - Visual prompt for consistency
   - Thumbnail prompt for image generation

3. **Visual Consistency System**
   - **Environment Registry**: Tracks locations (kitchens, offices, etc.)
   - **Character Registry**: Maintains character appearance across shots
   - **Object Registry**: Ensures props look identical throughout
   - Hierarchical context system for thumbnail generation

4. **AI Thumbnail Generation**
   - Google Gemini 2.5 Flash Image Preview
   - Generates preview images for each shot
   - Maintains visual consistency across all shots
   - Batch generation with progress tracking
   - Individual shot regeneration on click

5. **Dual View System**
   - **Timeline View**: Video editor-style interface
     - Horizontal scrollable shot track
     - Dynamic card width based on duration (1s = 40px)
     - Scene labels above shots (width-matched to shots)
     - Centered video player preview (16:9 aspect ratio)
     - Minimal UI focused on visual flow
   - **Storyboard View**: Director-focused interface
     - Grid-based scene-grouped cards
     - Full shot metadata displayed
     - Thumbnail, shot number, description visible
     - Editing and directing workflow
   - View toggle in footer bar (bottom-right)

6. **Shot Editing**
   - **Timeline View**: Popover details on demand
   - **Storyboard View**: Full card with inline editing
   - Real-time updates (not persisted)

## What It DOESN'T Do ❌

### Out of Scope

1. **No Video Generation**
   - Does NOT generate actual video files
   - Does NOT render/export video
   - Storyboard preview only

2. **No Persistence**
   - Does NOT save storyboards to database
   - Does NOT have user accounts/authentication
   - Regenerate on page reload

3. **No Video Editing**
   - Does NOT edit existing videos
   - Does NOT have timeline editing tools
   - Does NOT support video upload

4. **No Collaboration**
   - Single-user only
   - No real-time collaboration
   - No comments or feedback system

5. **No Export**
   - Does NOT export to PDF
   - Does NOT export to video editing software
   - JSON copy only (via UI)

6. **No Asset Management**
   - Does NOT manage media libraries
   - Does NOT upload custom images
   - AI-generated thumbnails only

## Key Technical Decisions

### Why Milliseconds for Duration?
- More precise than seconds
- Standard in video editing (e.g., 3000ms vs 3.0s)
- Better for timeline visualization

### Why Hierarchical Context?
- Solves the "creme brulee problem": Without context, AI generates inconsistent objects
- Example: Chef putting dish in oven - without context, the dish changes appearance
- Solution: Environment + Object + Previous Shots context

### Why Dual Views?
- **Timeline View**: For playback and visual flow
  - Mimics video editor UX (Premiere, Final Cut)
  - Duration-based width creates visual pacing representation
  - Natural left-to-right narrative flow
  - Focus on timing and rhythm
- **Storyboard View**: For directing and editing
  - Grid layout for easy comparison
  - Full metadata visible at once
  - Better for script/shot planning
  - Focus on content and composition

### Why Centralized Layout Constants?
- Single source of truth for shot widths
- `timelineConstants.ts` defines: gap spacing, pixels per second, min width
- Ensures scene labels always match shot widths
- CSS comments link to TypeScript constants
- Future-proof for duration editing features

## Current Branches

### `main`
- Original implementation with scene groupings
- Grid-based layout
- "Generate video" buttons on cards

### `simple-mode`
- **Dual-view system** (Storyboard + Timeline)
- Timeline view with video player preview
- Dynamic card widths based on duration (centralized constants)
- Scene labels with matched widths
- Popover-style shot details
- Separate card components per view (TimelineShot, StoryboardCard)
- Footer bar with view toggle
- **Current active development branch**

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **AI Services**: @canva-ct/genai package
  - LLM: GPT-4o (OpenRouter)
  - Image Gen: Google Gemini 2.5 Flash Image Preview
- **Styling**: Plain CSS (no framework)
- **State Management**: React hooks (useState, useCallback)

## JSON Schema Version

Current schema: **v1.0**

Required fields per shot:
- `duration_ms` (integer, milliseconds)
- `shot_type` (enum of 15 types)
- `description`, `visual_prompt`, `thumbnail_prompt`

Optional fields per shot:
- `environment_id` (reference to environmentRegistry)
- `characters[]` (array of character IDs)
- `objects[]` (array of object IDs)

## Known Limitations

1. **JSON Parsing Fragility**
   - LLM sometimes returns markdown-wrapped JSON
   - Multiple extraction strategies implemented
   - Still occasionally fails on complex prompts

2. **Thumbnail Consistency Challenges**
   - Despite hierarchical context, some variation occurs
   - Temperature setting affects consistency
   - No image-to-image reference capability yet

3. **No Duration Validation**
   - LLM can generate any duration
   - No enforcement of total duration matching input
   - No validation that shots add up correctly

4. **Single Style Per Storyboard**
   - Style filters apply to entire storyboard
   - Can't mix styles per scene/shot
   - styleSettings are global only

## Future Considerations (Not Implemented)

- Thumbnail caching (localStorage)
- Storyboard save/load
- Export to video editing formats
- Reference image upload for consistency
- Multi-user collaboration
- Animation previews
- Audio/music suggestions
- Script/dialogue integration

## Success Criteria

A successful storyboard generation:
1. Returns valid JSON matching schema
2. All shots have duration_ms values
3. Thumbnails generate without errors
4. Visual consistency across shots
5. Total duration reasonably close to input duration
6. Shot types make narrative sense

---

**Last Updated**: October 29, 2025
**Schema Version**: 1.0
**Active Branch**: simple-mode
**Major Updates**: Dual-view system, centralized layout constants, aspect-ratio video player

