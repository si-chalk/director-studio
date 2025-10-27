import React, { useState } from 'react';
import { LLMStreamService } from '@canva-ct/genai/llm';
import type { LLMStreamRequest } from '@canva-ct/genai/llm';
import StoryboardViewer from './StoryboardViewer';
import './style.css';

const llmService = new LLMStreamService();

const STYLE_OPTIONS = [
  'Cinematic',
  'Storyboard (sketch style)',
  'Vibrant commercial',
  'Documentary',
  'Minimalist',
  'Film noir',
  'Vintage',
  'Modern tech',
];

const STORYBOARD_SCHEMA = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Storyboard",
  "type": "object",
  "required": ["version", "input", "styleSettings", "characterRegistry", "objectRegistry", "environmentRegistry", "scenes"],
  "properties": {
    "version": { "type": "string" },
    "generated_at": { "type": "string", "format": "date-time" },
    "input": {
      "type": "object",
      "required": ["user_prompt", "style_filter", "duration_seconds"],
      "properties": {
        "user_prompt": { "type": "string" },
        "style_filter": {
          "type": "array",
          "items": { "type": "string" },
          "minItems": 1
        },
        "duration_seconds": { "type": "integer", "minimum": 1, "maximum": 300 }
      }
    },
    "styleSettings": {
      "type": "object",
      "description": "Stored, updateable visual settings reused across scenes/shots.",
      "properties": {
        "camera_type": { "type": "string" },
        "lighting_style": { "type": "string" },
        "colour_palette": { "type": "string" },
        "render_style": { "type": "string" },
        "aspect_ratio": { "type": "string" },
        "notes": { "type": "string" }
      },
      "additionalProperties": false
    },
    "characterRegistry": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "name", "description"],
        "properties": {
          "id": { "type": "string", "pattern": "^[a-z0-9_-]+$" },
          "name": { "type": "string" },
          "description": { "type": "string" },
          "appearance": { "type": "string" },
          "wardrobe": { "type": "string" },
          "age_range": { "type": "string" },
          "tags": { "type": "array", "items": { "type": "string" } }
        },
        "additionalProperties": false
      }
    },
    "objectRegistry": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "name", "description"],
        "properties": {
          "id": { "type": "string", "pattern": "^[a-z0-9_-]+$" },
          "name": { "type": "string" },
          "description": { "type": "string" },
          "visual_traits": { "type": "string" },
          "tags": { "type": "array", "items": { "type": "string" } }
        },
        "additionalProperties": false
      }
    },
    "environmentRegistry": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "name", "description"],
        "properties": {
          "id": { "type": "string", "pattern": "^[a-z0-9_-]+$" },
          "name": { "type": "string" },
          "description": { "type": "string" },
          "visual_details": { "type": "string" },
          "lighting": { "type": "string" },
          "tags": { "type": "array", "items": { "type": "string" } }
        },
        "additionalProperties": false
      }
    },
    "scenes": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["scene_id", "title", "description", "visual_prompt", "shots"],
        "properties": {
          "scene_id": { "type": "string", "pattern": "^[a-z0-9_-]+$" },
          "title": { "type": "string" },
          "description": { "type": "string" },
          "visual_prompt": { "type": "string" },
          "time_range": {
            "type": "object",
            "properties": {
              "start_s": { "type": "number", "minimum": 0 },
              "end_s": { "type": "number", "minimum": 0 }
            },
            "required": ["start_s", "end_s"]
          },
          "shots": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["shot_id", "shot_number", "shot_type", "description", "visual_prompt", "thumbnail_prompt"],
              "properties": {
                "shot_id": { "type": "string", "pattern": "^[a-z0-9_-]+$" },
                "shot_number": { "type": "integer", "minimum": 1 },
                "shot_type": {
                  "type": "string",
                  "enum": [
                    "Close Up",
                    "Extreme Close Up",
                    "Medium Shot",
                    "Medium Close Up",
                    "Wide Shot",
                    "Extreme Wide",
                    "Insert",
                    "Overhead",
                    "POV",
                    "Tracking",
                    "Push In",
                    "Pull Out",
                    "Tilt",
                    "Pan",
                    "Static"
                  ]
                },
                "description": { "type": "string" },
                "visual_prompt": { "type": "string" },
                "thumbnail_prompt": { "type": "string" },
                "duration_s": { "type": "number", "minimum": 0.1 },
                "characters": {
                  "type": "array",
                  "items": { "type": "string" },
                  "description": "Character IDs appearing in this shot"
                },
                "objects": {
                  "type": "array",
                  "items": { "type": "string" },
                  "description": "Object IDs appearing in this shot"
                },
                "environment_id": {
                  "type": "string",
                  "description": "Environment ID from registry (optional)"
                }
              },
              "additionalProperties": false
            }
          }
        },
        "additionalProperties": false
      }
    }
  },
  "additionalProperties": false
};

const StoryboardGenerator: React.FC = () => {
  const [userPrompt, setUserPrompt] = useState('Kickstarter campaign for a watch brand called Saros');
  const [styleFilters, setStyleFilters] = useState<string[]>(['Cinematic', 'Storyboard (sketch style)']);
  const [duration, setDuration] = useState(60);
  const [isGenerating, setIsGenerating] = useState(false);
  const [storyboardJson, setStoryboardJson] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState('');
  const [showViewer, setShowViewer] = useState(false);
  const [rawResponse, setRawResponse] = useState<string>('');
  const [showJson, setShowJson] = useState(false);

  const toggleStyleFilter = (style: string) => {
    setStyleFilters(prev => 
      prev.includes(style) 
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const generateStoryboard = async () => {
    if (!userPrompt.trim() || styleFilters.length === 0) {
      setError('Please provide a prompt and at least one style filter');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setStoryboardJson(null);
    setStreamingContent('');

    const systemPrompt = `You are an AI storyboard generator that outputs ONLY valid JSON.

CRITICAL OUTPUT RULES:
1. Your ENTIRE response must be a single valid JSON object
2. Start immediately with { and end with }
3. NO markdown formatting (no \`\`\`json)
4. NO explanations or text before/after the JSON
5. Ensure all strings are properly quoted and escaped
6. Ensure all arrays and objects are properly closed
7. Use commas between all properties (but not after the last one)

ENVIRONMENT REGISTRY RULES:
- Create environments ONLY for location-based videos (cooking, product demos, realistic narratives)
- Skip environments for: abstract, surreal, or constantly-changing settings
- Include visual_details and lighting for each environment
- Reference environment_id in shots that occur in that location

VALIDATION:
- All required fields must be present: version, generated_at, input, styleSettings, characterRegistry, objectRegistry, environmentRegistry, scenes
- Each scene must have: scene_id, title, description, visual_prompt, shots
- Each shot must have: shot_id, shot_number, shot_type, description, visual_prompt, thumbnail_prompt
- IDs must be lowercase with underscores (e.g., "scene_1", "shot_1")`;

    const exampleJson = {
      "version": "1.0",
      "generated_at": new Date().toISOString(),
      "input": {
        "user_prompt": "Example video",
        "style_filter": ["Cinematic"],
        "duration_seconds": 30
      },
      "styleSettings": {
        "camera_type": "DSLR",
        "lighting_style": "Natural",
        "colour_palette": "Warm tones",
        "render_style": "Photorealistic"
      },
      "characterRegistry": [],
      "objectRegistry": [],
      "environmentRegistry": [],
      "scenes": [{
        "scene_id": "scene_1",
        "title": "Opening",
        "description": "Introduction",
        "visual_prompt": "Bright, clean setting",
        "shots": [{
          "shot_id": "shot_1",
          "shot_number": 1,
          "shot_type": "Wide Shot",
          "description": "Establishing shot",
          "visual_prompt": "Bright, clean wide angle view",
          "thumbnail_prompt": "Wide angle view of clean space"
        }]
      }]
    };

    const userMessage = `Generate a complete storyboard in valid JSON format.

Inputs:
- user_prompt: "${userPrompt}"
- style_filter: ${JSON.stringify(styleFilters)}
- duration_seconds: ${duration}

Your output must follow this structure (but with your generated content):
${JSON.stringify(exampleJson, null, 2)}

IMPORTANT: Output ONLY the JSON object. Start with { and end with }. No other text.`;

    const request: LLMStreamRequest = {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      model: 'openai/gpt-4o',
      temperature: 0.3,
      max_tokens: 16000,
      tools: []
    };

    let accumulatedContent = '';

    try {
      await llmService.invoke(request, {
        onMessage: (event) => {
          if (event.type === 'on_chat_model_stream') {
            const content = event.content || '';
            accumulatedContent += content;
            setStreamingContent(accumulatedContent);
          }
        },
        onComplete: () => {
          console.log('Generation complete');
          setIsGenerating(false);
          
          // Try to parse the JSON with multiple strategies
          try {
            let jsonStr = accumulatedContent.trim();
            
            console.log('Raw response length:', jsonStr.length);
            console.log('First 300 chars:', jsonStr.substring(0, 300));
            console.log('Last 100 chars:', jsonStr.substring(Math.max(0, jsonStr.length - 100)));
            
            // Strategy 1: Extract from markdown code blocks
            const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
            if (codeBlockMatch) {
              console.log('Found markdown code block, extracting...');
              jsonStr = codeBlockMatch[1].trim();
            }
            
            // Strategy 2: Remove common prefixes/suffixes
            jsonStr = jsonStr.replace(/^(Here's the storyboard JSON:|Here is the JSON:|JSON:|Output:)\s*/i, '');
            jsonStr = jsonStr.replace(/\s*(That's the complete storyboard|Hope this helps|Let me know).*$/i, '');
            
            // Strategy 3: Find first { and last }
            const firstBrace = jsonStr.indexOf('{');
            const lastBrace = jsonStr.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
              jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
            }
            
            // Strategy 4: Try to repair common JSON issues
            // Remove trailing commas before closing braces/brackets
            jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1');
            
            console.log('Cleaned JSON length:', jsonStr.length);
            console.log('First 300 chars of cleaned:', jsonStr.substring(0, 300));
            
            const parsed = JSON.parse(jsonStr);
            
            // Validate required fields
            if (!parsed.scenes || !Array.isArray(parsed.scenes)) {
              throw new Error('Invalid storyboard: missing scenes array');
            }
            
            if (!parsed.environmentRegistry) {
              console.warn('Missing environmentRegistry, adding empty array');
              parsed.environmentRegistry = [];
            }
            
            console.log('✅ Successfully parsed JSON with', parsed.scenes.length, 'scenes');
            
            setStoryboardJson(parsed);
            setStreamingContent('');
            setShowViewer(true);
          } catch (e) {
            console.error('❌ Failed to parse JSON:', e);
            console.error('Full content:', accumulatedContent);
            
            const errorMsg = e instanceof Error ? e.message : 'Unknown error';
            setError(`Failed to parse generated JSON: ${errorMsg}. The AI may have returned invalid JSON. Please try again.`);
            setRawResponse(accumulatedContent);
          }
        },
        onError: (err) => {
          console.error('Generation error:', err);
          setError(err.message || 'An error occurred during generation');
          setIsGenerating(false);
        }
      });
    } catch (err) {
      console.error('Failed to start generation:', err);
      setError(err instanceof Error ? err.message : 'Failed to start generation');
      setIsGenerating(false);
    }
  };

  return (
    <div className="storyboard-generator-workspace">
      {/* Floating Input Panel */}
      <div className={`floating-input-panel ${storyboardJson ? 'collapsed' : ''}`}>
        <div className="panel-header">
          <h2>Storyboard Generator</h2>
          {storyboardJson && (
            <button 
              className="collapse-toggle"
              onClick={() => setShowViewer(!showViewer)}
            >
              {showViewer ? '◀' : '▶'}
            </button>
          )}
        </div>

        <div className={`panel-content ${!showViewer && storyboardJson ? 'hidden' : ''}`}>
          <div className="input-section compact">
            <label>Concept</label>
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="e.g., Kickstarter campaign for a watch brand called Saros"
              rows={3}
              disabled={isGenerating}
            />
          </div>

          <div className="input-section compact">
            <label>Styles</label>
            <div className="style-chips">
              {STYLE_OPTIONS.map(style => (
                <button
                  key={style}
                  className={`style-chip ${styleFilters.includes(style) ? 'active' : ''}`}
                  onClick={() => toggleStyleFilter(style)}
                  disabled={isGenerating}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div className="input-section compact">
            <label>Duration: {duration}s</label>
            <input
              type="range"
              min="1"
              max="300"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              disabled={isGenerating}
            />
            <div className="duration-labels">
              <span>1s</span>
              <span>5 minutes</span>
            </div>
          </div>

          <button
            className="generate-button"
            onClick={generateStoryboard}
            disabled={isGenerating || !userPrompt.trim() || styleFilters.length === 0}
          >
            {isGenerating ? 'Generating...' : 'Generate Storyboard'}
          </button>

          {error && (
            <div className="error-message">
              {error}
              {rawResponse && (
                <details style={{ marginTop: '12px' }}>
                  <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
                    View raw response
                  </summary>
                  <pre style={{ 
                    marginTop: '8px', 
                    padding: '12px', 
                    background: '#f9fafb', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '12px',
                    maxHeight: '300px',
                    overflow: 'auto'
                  }}>
                    {rawResponse}
                  </pre>
                </details>
              )}
            </div>
          )}

          {/* Streaming JSON Output */}
          {isGenerating && streamingContent && (
            <div className="streaming-section">
              <div className="streaming-header">
                <div className="pulse-indicator"></div>
                <span>Generating storyboard...</span>
              </div>
              <pre className="streaming-json">{streamingContent}</pre>
            </div>
          )}

          {/* Final JSON Output (after generation) */}
          {!isGenerating && storyboardJson && (
            <div className="json-output-section">
              <button 
                className="toggle-json-button"
                onClick={() => setShowJson(!showJson)}
              >
                {showJson ? '▼' : '▶'} View JSON Output
              </button>
              
              {showJson && (
                <div className="json-viewer">
                  <div className="json-viewer-header">
                    <span className="json-label">Generated JSON</span>
                    <button
                      className="copy-json-button"
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(storyboardJson, null, 2));
                        // Optional: Show a toast notification
                        alert('JSON copied to clipboard!');
                      }}
                    >
                      Copy
                    </button>
                  </div>
                  <pre className="json-content">{JSON.stringify(storyboardJson, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Pannable Canvas Area */}
      <div className="storyboard-canvas">
        {storyboardJson ? (
          <StoryboardViewer 
            data={storyboardJson} 
            onClose={() => {
              setStoryboardJson(null);
              setShowViewer(false);
            }} 
          />
        ) : (
          <div className="canvas-placeholder">
            <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
              <rect x="20" y="30" width="120" height="80" rx="8" stroke="#3a3a3a" strokeWidth="3"/>
              <rect x="35" y="45" width="35" height="28" rx="4" fill="#2a2a2a"/>
              <rect x="75" y="45" width="35" height="28" rx="4" fill="#2a2a2a"/>
              <rect x="115" y="45" width="20" height="28" rx="4" fill="#2a2a2a"/>
              <rect x="35" y="77" width="90" height="28" rx="4" fill="#2a2a2a"/>
            </svg>
            <h3>Your storyboard will appear here</h3>
            <p>Configure your inputs in the panel and generate a storyboard</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryboardGenerator;

