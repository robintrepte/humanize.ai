import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

interface AIMessage {
  role: string;
  content: string;
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
        const completion = await this.openai!.chat.completions.create({
          messages: messages,
          model: this.config.model,
          temperature: this.config.temperature ?? 0.7,
          max_tokens: this.config.maxTokens ?? 2000,
        });
        return completion.choices[0].message.content || '';
      } else {
        const completion = await this.anthropic!.messages.create({
          messages: messages.map(m => ({
            role: m.role === 'system' ? 'assistant' : m.role,
            content: m.content,
          })),
          model: this.config.model,
          temperature: this.config.temperature ?? 0.7,
          max_tokens: this.config.maxTokens ?? 2000,
        });
        return completion.content[0].text;
      }
    } catch (error) {
      console.error('AI completion error:', error);
      throw error;
    }
  }
}

export { AIClient, type AIMessage, type AIClientConfig }; 