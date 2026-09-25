export interface WebsiteConfig {
  siteName: string;
  industry: string;
  style: string;
  theme: string;
  description: string;
  sections: Section[];
  seo: SEOConfig;
  themeSettings: ThemeSettings;
}

export interface Section {
  id: string;
  type: SectionType;
  config: Record<string, any>;
}

export type SectionType =
  | 'hero'
  | 'navbar'
  | 'features'
  | 'about'
  | 'services'
  | 'products'
  | 'pricing'
  | 'testimonials'
  | 'gallery'
  | 'team'
  | 'faq'
  | 'stats'
  | 'cta'
  | 'contact'
  | 'newsletter'
  | 'footer';

export interface SEOConfig {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  favicon: string;
  canonicalUrl: string;
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: string;
  buttonStyle: 'rounded' | 'pill' | 'square';
  spacing: 'compact' | 'normal' | 'spacious';
  mode: 'light' | 'dark';
  preset?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  website: WebsiteConfig;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published';
  publishedUrl?: string;
  thumbnail?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  action?: ChatAction;
}

export interface ChatAction {
  type: 'modify' | 'add' | 'remove' | 'regenerate' | 'theme' | 'style';
  description: string;
}

export interface HistoryState {
  website: WebsiteConfig;
  timestamp: string;
  label: string;
}

export type ViewMode = 'desktop' | 'tablet' | 'mobile';
export type AppView = 'landing' | 'builder' | 'dashboard' | 'templates' | 'pricing';
export type BuilderTab = 'preview' | 'code' | 'seo' | 'theme';

export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  prompt: string;
  preview: string;
}

export const THEME_PRESETS: Record<string, ThemeSettings> = {
  minimal: {
    primaryColor: '#000000',
    secondaryColor: '#666666',
    backgroundColor: '#ffffff',
    textColor: '#1a1a1a',
    fontFamily: 'Inter',
    borderRadius: '8px',
    buttonStyle: 'rounded',
    spacing: 'normal',
    mode: 'light',
    preset: 'minimal',
  },
  luxury: {
    primaryColor: '#1a1a2e',
    secondaryColor: '#c9a96e',
    backgroundColor: '#faf9f6',
    textColor: '#1a1a2e',
    fontFamily: 'Playfair Display',
    borderRadius: '4px',
    buttonStyle: 'square',
    spacing: 'spacious',
    mode: 'light',
    preset: 'luxury',
  },
  modern: {
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    fontFamily: 'Inter',
    borderRadius: '12px',
    buttonStyle: 'pill',
    spacing: 'normal',
    mode: 'light',
    preset: 'modern',
  },
  corporate: {
    primaryColor: '#1e40af',
    secondaryColor: '#3b82f6',
    backgroundColor: '#f8fafc',
    textColor: '#0f172a',
    fontFamily: 'Inter',
    borderRadius: '6px',
    buttonStyle: 'rounded',
    spacing: 'normal',
    mode: 'light',
    preset: 'corporate',
  },
  creative: {
    primaryColor: '#ec4899',
    secondaryColor: '#f97316',
    backgroundColor: '#fffbeb',
    textColor: '#1f2937',
    fontFamily: 'Inter',
    borderRadius: '16px',
    buttonStyle: 'pill',
    spacing: 'spacious',
    mode: 'light',
    preset: 'creative',
  },
  bold: {
    primaryColor: '#dc2626',
    secondaryColor: '#f97316',
    backgroundColor: '#000000',
    textColor: '#ffffff',
    fontFamily: 'Inter',
    borderRadius: '0px',
    buttonStyle: 'square',
    spacing: 'normal',
    mode: 'dark',
    preset: 'bold',
  },
  elegant: {
    primaryColor: '#4a5568',
    secondaryColor: '#a0aec0',
    backgroundColor: '#f7fafc',
    textColor: '#2d3748',
    fontFamily: 'Playfair Display',
    borderRadius: '8px',
    buttonStyle: 'rounded',
    spacing: 'spacious',
    mode: 'light',
    preset: 'elegant',
  },
  dark: {
    primaryColor: '#a78bfa',
    secondaryColor: '#7c3aed',
    backgroundColor: '#0f0f23',
    textColor: '#e2e8f0',
    fontFamily: 'Inter',
    borderRadius: '12px',
    buttonStyle: 'pill',
    spacing: 'normal',
    mode: 'dark',
    preset: 'dark',
  },
};
