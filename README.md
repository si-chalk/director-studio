# Canva AI Presentation Template

This is a standalone version of the Canva AI Presentation template. It provides a simple, clean interface for AI Presentation functionality.

This is a **Canva AI Template** - a starting point template for designers and developers to rapidly prototype and build LLM-powered design application experiments. It provides a clean, interactive whiteboard interface that simulates Canva's design experience with integrated AI chat capabilities.

**Key Purpose**: Enable rapid prototyping of AI-enabled design tools by providing a working foundation that demonstrates how to integrate conversational AI into design applications.

## Prerequisites

This will guide you through setting up Cursor, Node.js and NPM. If you already have done this you can go straight to Getting Started.

### Request access to Cursor

Firstly; if you have not requested access to Cursor go here #cursor-contributors and message the @cop

### Check if you have Node.js and NPM installed

Open Spotlight: Command (⌘) + Spacebar and search "terminal" and press Enter to open it.

Paste this in to Terminal and hit enter (make sure you copy the full string including quotes): `echo "Node: $(node --version 2>/dev/null)$(which node 2>/dev/null | sed 's/^/ (/' | sed 's/$/)/' || echo 'Not installed')" && echo "NPM: $(npm --version 2>/dev/null)$(which npm 2>/dev/null | sed 's/^/ (/' | sed 's/$/)/' || echo 'Not installed')" && echo "Brew: $(brew --version 2>/dev/null | head -1)$(which brew 2>/dev/null | sed 's/^/ (/' | sed 's/$/)/' || echo 'Not installed')" && echo "Xcode Tools: $(xcode-select -p 2>/dev/null || echo 'Not installed')"`

If you see a version next to Node and NPM then you can skip to Installing Cursor. If you see `not found` next to Node or NPM then continue.

### Install Node.js and NPM

Click this link (which should say `Ansible Enrolment (Opt In)`) and click `Run` or `Run Again` **ONCE** kandji-self-service://library/items/efc8bb1c-ccf2-4c0b-8c87-07b4b197f50e

Then click this link (which should say `Ansible Run`) and click `Run` or `Run Again` **ONCE** kandji-self-service://library/items/146a9a6d-b7a4-4e93-9a49-66061e00c11f

You won't see anything immediately happen, give it some time, it can take 15-20 minutes.

Accept any prompts that show up.

### Veryify installation

Open Spotlight: Command (⌘) + Spacebar and search "terminal" and press Enter to open it.

Paste this in to Terminal and hit enter (make sure you copy the full string including quotes): `echo "Node: $(node --version 2>/dev/null)$(which node 2>/dev/null | sed 's/^/ (/' | sed 's/$/)/' || echo 'Not installed')" && echo "NPM: $(npm --version 2>/dev/null)$(which npm 2>/dev/null | sed 's/^/ (/' | sed 's/$/)/' || echo 'Not installed')" && echo "Brew: $(brew --version 2>/dev/null | head -1)$(which brew 2>/dev/null | sed 's/^/ (/' | sed 's/$/)/' || echo 'Not installed')" && echo "Xcode Tools: $(xcode-select -p 2>/dev/null || echo 'Not installed')"`

If you see a version next to Node and NPM then it has worked! Now you can install Cursor.

### Installing Cursor

Now you can install Cursor (assuming it has been approved) kandji-self-service://library/items/887560a2-ec44-4daa-a7c2-db030655e269

Sign in with your Canva email and it should take you to Okta

You don't want to share data

You want privacy mode

## Getting Started

1. Drag the folder that contains all the files into Cursor

2. Click View > Terminal to open a new Terminal (at the bottom of the window)

3. Install dependencies. In the Terminal window run `npm install`

4. Start the development server. In the Terminal window run `npm start`

5. Open your browser and navigate to: http://localhost:5173 (you can also hold Alt + Click the link in the Terminal to open it in your browser)

## Build

To build the project, in Terminal run `npm run build`

The build output will be in the `dist` directory.

## Preview Build

To preview the build, in Terminal run `npm run preview`

## Project Structure

- `src/` - Source code
  - `components/` - React components
  - `styles/` - CSS styles
- `public/` - Static assets

## Quick Start with @canva-ct/genai

This project uses the **@canva-ct/genai** package - a comprehensive GenAI services package with LLM streaming, image generation, and Text-to-Speech capabilities.

### Core Capabilities

#### 1. **LLM Chat** - Simple conversational AI

```typescript
import { OpenRouterService } from '@canva-ct/genai/openrouter';

const openrouter = new OpenRouterService();

// Basic non-streaming chat
const response = await openrouter.chat({
  messages: [{ role: 'user', content: 'What is the capital of France?' }],
  model: 'anthropic/claude-sonnet-4',
});

console.log(response.choices[0].message.content);
```

#### 2. **Image Generation** - Google Gemini powered image creation

```typescript
import { OpenRouterService } from '@canva-ct/genai/openrouter';

const openrouter = new OpenRouterService();

// Text-to-image
const response = await openrouter.generateImage({
  prompt: 'A beautiful sunset over mountains with a lake reflection',
  model: 'google/gemini-2.5-flash-image-preview',
  temperature: 0.7,
  max_tokens: 100,
});

// Response structure for image generation
// The generated image is returned in response.choices[0].message.images[0].image_url.url
// as a base64-encoded data URL (e.g., "data:image/png;base64,...")
const imageUrl = response.choices[0].message.images[0].image_url.url;
console.log(imageUrl); // data:image/png;base64,...
```

#### 3. **Text-to-Speech** - Natural voice synthesis

```typescript
import { TTSService } from '@canva-ct/genai/tts';

const tts = new TTSService();

// Auto-play speech
const audio = await tts.speak({
  input: 'Hello, world! This is text-to-speech.',
  model: 'gpt-4o-mini-tts',
  voice: 'coral',
  response_format: 'mp3',
  autoplay: true,
});
```

#### 4. **Image Analysis** - Analyze images with AI

```typescript
import { OpenRouterService } from '@canva-ct/genai/openrouter';

const openrouter = new OpenRouterService();

// Analyze an image
const analysis = await openrouter.chat({
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: "What's in this image? Describe it in detail." },
        {
          type: 'image_url',
          image_url: {
            url: `data:image/jpeg;base64,${imageBase64}`,
          },
        },
      ],
    },
  ],
  model: 'google/gemini-2.5-flash-image-preview',
  modalities: ['image', 'text'],
});

console.log(analysis.choices[0].message.content);
```

#### 5. **Tool Calling** - Structured outputs for UI control

Tools provide structured outputs that drive UI behavior effectively. This technique is particularly valuable for rapid prototyping when you need to simulate specific behaviors like notifications, dialogs, or interactive elements.

```typescript
import { LLMStreamService } from '@canva-ct/genai/llm';

const llm = new LLMStreamService();

await llm.invoke(
  {
    messages: [{ role: 'user', content: 'Show me a success notification that the file was saved' }],
    model: 'anthropic/claude-sonnet-4',
    temperature: 0.7,
    max_tokens: 4000,
    tools: [
      {
        name: 'create_notification',
        description: 'Display a notification to the user',
        parameters: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'The notification message to display',
            },
            level: {
              type: 'string',
              enum: ['info', 'success', 'warning', 'error'],
              description: 'The notification type/severity',
            },
          },
          required: ['message', 'level'],
        },
      },
    ],
  },
  {
    onMessage: event => {
      if (event.type === 'on_tool_start') {
        console.log('Tool called:', event.tool_name);
      }

      if (event.type === 'on_tool_end') {
        // Structured output from the AI
        const { message, level } = JSON.parse(event.output);

        // Use this to drive your UI
        showNotification(message, level); // Your UI function
      }
    },
  },
);
```

**Why Tool Calling?**

- **Structured Output**: Get JSON data instead of freeform text
- **Rapid Prototyping**: Simulate complex behaviors without building full backend logic
- **Type Safety**: Define exact parameters and types the AI must return
- **Interactive Experiences**: Create multi-step workflows with user choices

### Authentication Setup

**MANDATORY**: Initialize authentication before using any GenAI services.

```typescript
import { setupAuth } from '@canva-ct/genai';

// In your App.tsx or main.tsx
function App() {
  useEffect(() => {
    setupAuth();
  }, []);

  return <YourApp />;
}
```

### Quick Examples

**Tool Calling:**

```typescript
await llm.invoke(
  {
    messages: [{ role: 'user', content: 'Show a success notification' }],
    model: 'anthropic/claude-sonnet-4',
    tools: [
      {
        name: 'create_notification',
        description: 'Show user notification',
        parameters: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            level: { type: 'string', enum: ['info', 'success', 'warning', 'error'] },
          },
          required: ['message'],
        },
      },
    ],
  },
  {
    onMessage: event => {
      if (event.type === 'on_tool_end') {
        console.log('Tool result:', event.output);
      }
    },
  },
);
```

**Streaming Chat:**

```typescript
const emitter = openrouter.chat({
  messages: [{ role: 'user', content: 'Tell me a story' }],
  model: 'openai/gpt-4o',
  stream: true,
});

emitter.on('chunk', response => {
  console.log(response.choices[0].delta.content);
});
```

**Image Analysis:**

```typescript
const analysis = await openrouter.chat({
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: "What's in this image?" },
        {
          type: 'image_url',
          image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
        },
      ],
    },
  ],
  model: 'google/gemini-2.5-flash-image-preview',
  modalities: ['image', 'text'],
});
```

### Package Structure

- `/llm` - agent streaming service with recursive tool support
- `/openrouter` - OpenRouter API integration with image generation
- `/tts` - Text-to-Speech service using OpenAI TTS models

## What Models Are Available?
All AI-powered templates give you access to leading models from major providers, with no extra setup required. This includes models from Google, Anthropic, OpenAI, and Perplexity.


Google
- google/gemini-2.5-flash
- google/gemini-2.5-pro
- google/gemini-2.5-flash-lite

Anthropic
- anthropic/claude-sonnet-4.5
- anthropic/claude-sonnet-4
- anthropic/claude-opus-4.1

OpenAI
- openai/gpt-5
- openai/gpt-5-mini

Perplexity (for sophisticated live web data)
- perplexity/sonar-reasoning-pro
- perplexity/sonar-pro

All models use the OpenRouter notation, so you can easily switch between them when testing prototypes.
For a full list models and their capabilities have a look at [Open Router Models](https://openrouter.ai/models)

