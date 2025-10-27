import { signal } from '@preact/signals-react';
import type { LLMStreamRequest, ToolDefinition } from '@canva-ct/genai/llm';

// Thread ID state
export const threadId = signal<string | null>(null);

export const agentSessionActive = signal<boolean>(false);
export const isStreaming = signal(false);

// CanvaAI Chat Message Types

// Base message interface
interface BaseCanvaAIMessage {
  id: string;
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

// Dropdown option type for choice messages
export interface DropdownOption {
  value: string;
  label: string;
  description?: string;
}

// Specific message type interfaces
export interface UserMessage extends BaseCanvaAIMessage {
  type: 'user';
}

export interface AssistantMessage extends BaseCanvaAIMessage {
  type: 'assistant';
}

export interface NotificationMessage extends BaseCanvaAIMessage {
  type: 'notification';
}

export interface SingleChoiceMessage extends BaseCanvaAIMessage {
  type: 'single_choice';
  context?: string;
  placeholder?: string;
  options: DropdownOption[];
  selectedOption?: DropdownOption;
  isLoading?: boolean;
}

export interface MultipleChoiceMessage extends BaseCanvaAIMessage {
  type: 'multiple_choice';
  context?: string;
  placeholder?: string;
  options: DropdownOption[];
  selectedOptions: DropdownOption[];
  isLoading?: boolean;
}

export interface ImageGalleryMessage extends BaseCanvaAIMessage {
  type: 'image_gallery';
  originalRequest: string;
  prompts: string[];
}

// Discriminated union type for all message types
export type CanvaAIChatMessage =
  | UserMessage
  | AssistantMessage
  | NotificationMessage
  | SingleChoiceMessage
  | MultipleChoiceMessage
  | ImageGalleryMessage;

// examples of tools
export const defaultTools: ToolDefinition[] = [
  {
    name: 'create_notification',
    description: 'Show user notification with different levels',
    parameters: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'The notification message to display',
        },
        level: {
          type: 'string',
          enum: ['info', 'warning', 'error', 'success'],
          description: 'Notification level',
        },
      },
      required: ['message'],
    },
  },
  {
    name: 'generate_image',
    description:
      'Generate 4 varied image prompts based on an initial request, each optimized for image generation models',
    parameters: {
      type: 'object',
      properties: {
        original_request: {
          type: 'string',
          description: 'The original image generation request from the user',
        },
        prompts: {
          type: 'array',
          description: 'Array of 4 varied prompts based on the original request',
          items: {
            type: 'string',
            description: 'A detailed image generation prompt',
          },
          minItems: 4,
          maxItems: 4,
        },
      },
      required: ['original_request', 'prompts'],
    },
  },
];

// Default configuration
export const defaultCanvaAIConfig: LLMStreamRequest = {
  messages: [
    {
      role: 'system',
      content:
        'You are an AI assistant built into this Canva AI Template - a starting template designed for designers working with Cursor to rapidly prototype and build AI-powered design applications. This template demonstrates how to integrate conversational AI into design tools.\n\nYou are a helpful chat assistant that can:\n1. **Answer questions** - Provide guidance and help with design workflows\n2. **Offer design advice** - Share best practices, tips, and creative suggestions\n3. **Assist with workflows** - Help users understand design processes and techniques\n\nFor designers using this template: You can customize this system prompt and add features to prototype any AI-powered functionality you can imagine. This is your playground for exploring how AI can enhance design applications.',
    },
  ],
  model: 'anthropic/claude-sonnet-4',
  temperature: 0.7,
  maxTokens: 4000,
  tools: defaultTools,
};

// CanvaAI configuration state
export const canvaAIConfig = signal<LLMStreamRequest>(defaultCanvaAIConfig);

// Helper functions for CanvaAI configuration
export const updateCanvaAIConfig = (updates: Partial<LLMStreamRequest>): void => {
  canvaAIConfig.value = {
    ...canvaAIConfig.value,
    ...updates,
  };
};

export const getCanvaAIConfig = (): LLMStreamRequest => {
  return canvaAIConfig.value;
};

export const resetCanvaAIConfig = (): void => {
  canvaAIConfig.value = { ...defaultCanvaAIConfig };
};

// Helper function to get conversation history from existing CanvaAI chat messages
export const getCanvaAIHistoryForAPI = (): Array<{
  role: string;
  content: string;
}> => {
  const messages = getCanvaAIMessagesForCurrentThread();
  return messages
    .filter(msg => msg.type === 'user' || msg.type === 'assistant')
    .map(msg => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));
};

// CanvaAI Panel history - persistent across sessions
export const canvaAIChatMessages = signal<Record<string, CanvaAIChatMessage[]>>({});
export const canvaAICurrentStreamingContent = signal<string>('');
export const canvaAIStreamingMessageId = signal<string | null>(null);

// CanvaAI Helper Functions
export const addCanvaAIMessage = (message: Omit<CanvaAIChatMessage, 'id'>): void => {
  const currentThreadId = getOrCreateThreadId();
  const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  const fullMessage: CanvaAIChatMessage = {
    id: messageId,
    ...message,
  } as CanvaAIChatMessage;

  const currentMessages = canvaAIChatMessages.value[currentThreadId] || [];

  canvaAIChatMessages.value = {
    ...canvaAIChatMessages.value,
    [currentThreadId]: [...currentMessages, fullMessage],
  };

  console.log(`[State] Added CanvaAI message to thread ${currentThreadId}:`, fullMessage);
};

export const updateCanvaAIMessage = (
  messageId: string,
  updates: Partial<CanvaAIChatMessage>,
): void => {
  const currentThreadId = threadId.value;
  if (!currentThreadId) {
    console.warn(`[State] Cannot update message ${messageId}: no active thread`);
    return;
  }

  const currentMessages = canvaAIChatMessages.value[currentThreadId] || [];
  const messageIndex = currentMessages.findIndex(msg => msg.id === messageId);

  if (messageIndex === -1) {
    console.warn(
      `[State] Cannot update message ${messageId}: message not found in thread ${currentThreadId}`,
    );
    return;
  }

  const updatedMessages = [...currentMessages];
  updatedMessages[messageIndex] = {
    ...updatedMessages[messageIndex],
    ...updates,
  };

  canvaAIChatMessages.value = {
    ...canvaAIChatMessages.value,
    [currentThreadId]: updatedMessages,
  };

  console.log(
    `[State] Updated CanvaAI message ${messageId} in thread ${currentThreadId}:`,
    updates,
  );
};

export const updateCanvaAIStreamingContent = (content: string): void => {
  canvaAICurrentStreamingContent.value = content;
};

export const finalizeCanvaAIStreaming = (): void => {
  const streamingContent = canvaAICurrentStreamingContent.value.trim();

  if (streamingContent) {
    addCanvaAIMessage({
      type: 'assistant',
      content: streamingContent,
      timestamp: new Date().toISOString(),
    });
  }

  canvaAICurrentStreamingContent.value = '';
  canvaAIStreamingMessageId.value = null;
};

export const getCanvaAIMessagesForCurrentThread = (): CanvaAIChatMessage[] => {
  const currentThreadId = threadId.value;
  if (!currentThreadId) return [];

  return canvaAIChatMessages.value[currentThreadId] || [];
};

export const clearCanvaAIHistoryForCurrentThread = (): void => {
  const currentThreadId = threadId.value;
  if (!currentThreadId) return;

  const updatedMessages = { ...canvaAIChatMessages.value };
  delete updatedMessages[currentThreadId];
  canvaAIChatMessages.value = updatedMessages;

  canvaAICurrentStreamingContent.value = '';
  canvaAIStreamingMessageId.value = null;

  console.log(`[State] Cleared CanvaAI history for thread ${currentThreadId}`);
};

export const initializeCanvaAIForCurrentThread = (): void => {
  const currentThreadId = getOrCreateThreadId();

  if (!canvaAIChatMessages.value[currentThreadId]) {
    canvaAIChatMessages.value = {
      ...canvaAIChatMessages.value,
      [currentThreadId]: [
        {
          id: `init_${Date.now()}`,
          type: 'assistant',
          content:
            "👋 Hello! I'm your AI assistant built into this LLM-powered Canva AI Template.\n\nThis template is designed for **Canvanauts** to rapidly experiment with AI-powered design features. You can:\n\n💬 **Chat with me** - Ask questions, get guidance, discuss design workflows\n🎨 **Generate images** - I can create AI-powered images using Google Gemini\n🔧 **Use me to mock AI features** - I can simulate text analysis, smart suggestions, or any AI functionality you want to prototype\n\nThis template is your playground for exploring how AI can enhance design applications. What would you like to build today?\n\n**Happy Hacking!**",
          timestamp: new Date().toISOString(),
        },
      ],
    };
  }
};

export const getCanvaAIHistoryDebugInfo = (): {
  totalThreads: number;
  currentThreadId: string | null;
  currentThreadMessageCount: number;
  allThreadIds: string[];
} => {
  const currentThread = threadId.value;
  const allThreads = Object.keys(canvaAIChatMessages.value);
  const currentThreadMessages = currentThread
    ? canvaAIChatMessages.value[currentThread]?.length || 0
    : 0;

  return {
    totalThreads: allThreads.length,
    currentThreadId: currentThread,
    currentThreadMessageCount: currentThreadMessages,
    allThreadIds: allThreads,
  };
};

export const clearAllCanvaAIHistory = (): void => {
  canvaAIChatMessages.value = {};
  canvaAICurrentStreamingContent.value = '';
  canvaAIStreamingMessageId.value = null;
  console.log('[State] Cleared all CanvaAI chat history');
};

// Function to stop streaming when changing contexts (called by streaming service)
export const stopStreamingForThreadChange = (): void => {
  isStreaming.value = false;
  canvaAICurrentStreamingContent.value = '';
  canvaAIStreamingMessageId.value = null;
  console.log('[State] Stopped streaming for thread change');
};

// Debug function to manually stop streaming if it gets stuck
export const forceStopStreaming = (): void => {
  isStreaming.value = false;
  canvaAICurrentStreamingContent.value = '';
  canvaAIStreamingMessageId.value = null;
  console.log('[State] Manually stopped streaming');
};

// Generate a new thread ID for agent sessions
export const generateThreadId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `canvas_thread_${timestamp}_${random}`;
};

// Initialize or get thread ID
export const getOrCreateThreadId = (): string => {
  if (!threadId.value) {
    threadId.value = generateThreadId();
  }
  return threadId.value;
};

// Reset thread (for new sessions)
export const resetThread = (): void => {
  threadId.value = generateThreadId();
  agentSessionActive.value = false;
  stopStreamingForThreadChange();
};

export const seed = signal(Math.random());
