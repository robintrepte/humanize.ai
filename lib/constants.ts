export const CONTENT_TYPES = [
  { id: 'blog-post', name: 'Blog Post' },
  { id: 'article', name: 'Article' },
  { id: 'product-description', name: 'Product Description' },
  { id: 'social-media', name: 'Social Media Post' },
  { id: 'email', name: 'Email' },
  { id: 'landing-page', name: 'Landing Page' },
] as const;

export const TONES = [
  { id: 'professional', name: 'Professional' },
  { id: 'casual', name: 'Casual' },
  { id: 'friendly', name: 'Friendly' },
  { id: 'formal', name: 'Formal' },
  { id: 'persuasive', name: 'Persuasive' },
  { id: 'informative', name: 'Informative' },
] as const;

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'German' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'it', name: 'Italian' },
] as const;

export const WRITING_LEVELS = [
  { id: 'basic', name: 'Basic' },
  { id: 'intermediate', name: 'Intermediate' },
  { id: 'advanced', name: 'Advanced' },
] as const; 