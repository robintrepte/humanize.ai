export type ContentType = {
  id: string;
  name: string;
};

export type Tone = {
  id: string;
  name: string;
};

export type GenerationStep = 'settings' | 'outline' | 'content';

export interface GenerationSettings {
  contentType: string;
  tone: string;
  language: string;
  writingLevel: string;
  prompt: string;
  targetLength: number;
  keywords: string[];
}

export interface OutlineItem {
  id: string;
  title: string;
  depth: number;
  parentTitle: string | undefined;
  subItems?: OutlineItem[];
}

export interface GeneratedContent {
  title: string;
  outline: OutlineItem[];
  content: { [key: string]: string }; // Maps outline item ID to content
  currentGeneratingId: string | null;
} 