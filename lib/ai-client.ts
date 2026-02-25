import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

interface AIMessage {
  role: 'system' | 'user' | 'assistant' | 'function';
  content: string;
  name?: string;
}

interface AIClientConfig {
  provider: 'openai' | 'anthropic';
  model: string;
  temperature?: number;
  maxTokens?: number;
}

class AIClient {
  private openai: OpenAI | null = null;
  private anthropic: Anthropic | null = null;
  private config: AIClientConfig;

  constructor(config: AIClientConfig) {
    this.config = config;
    if (config.provider === 'openai') {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    } else {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }
  }

  async complete(messages: AIMessage[]): Promise<string> {
    try {
      if (this.config.provider === 'openai') {
        // Responses API: use instructions for system, input for conversation (messages as EasyInputMessage)
        const systemMessages = messages.filter((m) => m.role === 'system');
        const otherMessages = messages.filter((m) => m.role !== 'system');
        const instructions =
          systemMessages.length > 0
            ? systemMessages.map((m) => m.content).join('\n\n')
            : undefined;
        const inputItems = otherMessages.map((m) => ({
          role: (m.role === 'function' ? 'assistant' : m.role) as 'user' | 'assistant',
          content: m.content,
        }));
        const input =
          inputItems.length === 1 && inputItems[0].role === 'user'
            ? inputItems[0].content
            : inputItems;

        const response = await this.openai!.responses.create({
          model: this.config.model,
          ...(instructions ? { instructions } : {}),
          input,
          temperature: this.config.temperature ?? 0.7,
          max_output_tokens: this.config.maxTokens ?? 2000,
        });
        return response.output_text ?? '';
      } else {
        const completion = await this.anthropic!.messages.create({
          messages: messages.map(m => ({
            role: m.role === 'system' || m.role === 'function' ? 'assistant' : 'user',
            content: m.content,
          })),
          model: this.config.model,
          temperature: this.config.temperature ?? 0.7,
          max_tokens: this.config.maxTokens ?? 2000,
        });
        if (completion.content[0].type === 'text') {
          return completion.content[0].text;
        }
        return '';
      }
    } catch (error) {
      console.error('AI completion error:', error);
      throw error;
    }
  }
}

export { AIClient, type AIMessage, type AIClientConfig }; 