export interface KamiSection {
  id: string;
  key: 'K' | 'A' | 'M' | 'I';
  title: string;
  description: string;
  content: string;
  color: string;
  isLoading?: boolean;
}

export interface AnalysisResult {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export type CanvasState = KamiSection[];

export enum AIActionType {
  SUGGEST = 'SUGGEST',
  ANALYZE = 'ANALYZE',
  CRITIQUE = 'CRITIQUE'
}
